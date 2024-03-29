import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.baseURL = API_BASE_URL;

let customers = [
  { id: "1", name: 'Customer 1', email: 'customer1@piiano.com', ssn: '123-45-6789', owner_id: "1", expiration: 1620000000 },
  { id: "2", name: 'Customer 2', email: 'customer2@piiano.com', ssn: '323-45-6389', owner_id: "2", expiration: 1620000000 },
  { id: "3", name: 'Customer 3', email: 'customer3@piiano.com', ssn: '523-25-6782', owner_id: "3", expiration: 1620000000 },
  // More customers...
]

let users = [
  { id: "1", name: 'User 1', email: 'user1@example.com', role: 'member', avatar: 'https://www.gravatar.com/avatar/111d68d06e2d317b5a59c2c6c5bad808?d=identicon' },
  { id: "2", name: 'User 2', email: 'user2@example.com', role: 'member', avatar: 'https://www.gravatar.com/avatar/ab53a2911ddf9b4817ac01ddcd3d975f?d=identicon' },
  { id: "3", name: 'Piiano Support', email: 'support@piiano.com', role: 'support', avatar: 'https://www.gravatar.com/avatar/51e1dc098d02ed5e96c1069b4c4bd029?d=identicon' },
]

let isAxiosMock = false;

class UnprocessableEntityError extends Error {
  constructor(error) {
    super(error.message || "Unprocessable entity");
    let errors = Object.assign({}, error.errors);

    Object.keys(errors).forEach(function(k) {
      errors[k] = errors[k]?.text?.message || errors[k]?.status || errors[k];
    });
    this.errors = errors;
    
  }
}

// Mock Axios requests if the isAxiosMock environment variable is set to true
if (isAxiosMock) {
  // Import the Axios mock adapter library
  const MockAdapter = require('axios-mock-adapter');

  // Create a new mock adapter instance
  const mockAxios = new MockAdapter(axios, { delayResponse: 250 });

  // Mock requests here
  mockAxios
    .onPost('/customers').reply(200, customers)
    .onGet('/customers').reply(200, (config) => {
      return customers.map(c => {
        c.owner_id = "Test"
        return c
      });
    })
    .onAny(/\/customers\/\d+\/reveal\/\d+/).reply(200, 
      { code: "123456" }
    )
    .onAny(/\/customers\/\d+$/).reply((config) => {
      const customerId = config.url.split('/').pop();
      const customer = customers.find(c => c.id === customerId);
      return customer ? [200, customer] : [404, { message: 'Customer not found.' }];
    })
    .onAny('/profile').reply((config) => {
      let profile = null;
      if (config.headers && config.headers.Authorization) {
        // Assume the token is the user ID
        const id = config.headers.Authorization.split(' ')[1];
        profile = users.find(u => u.id?.toLowerCase() === id?.toLowerCase());
        if (profile && config.method === 'put') {
          let payload = JSON.parse(config.data);
          profile.name = payload?.name
          profile.email = payload?.email
        }
      }

      return profile ? [200, profile] : [404, { message: 'Profile not found.' }];
    })
    .onGet('/users').reply(200, users)
    .onPost('/oauth/tokens').reply((config) => {
      const { email } = JSON.parse(config.data);
      const user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());  
      if (user) {
        return [200, { token: user.id }];
      } else {
        return [401, { message: 'Invalid email or password.' }];
      } 
    })
    .onPost('/vault/key-rotation').reply(200, { message: 'Vault keys rotated successfully.' })
}

/* Customers */
export const getCustomers = () => {
  return axios.get('/customers')
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const createCustomer = (customer) => {
  return axios.post('/customers', customer)
    .then(response => response.data)
    .catch(error => {
      if( error.response.status === 422 ) {
        throw new UnprocessableEntityError(error.response.data);
      } else {
        throw new Error(`API request failed: ${error.message}`);
      }
    });
};

export const getCustomer = (customerId) => {
  return axios.get(`/customers/${customerId}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};


export const updateCustomer = (customerId, customer) => {
  return axios.patch(`/customers/${customerId}`, customer)
    .then(response => response.data)
    .catch(error => {
      if( error.response.status === 422 ) {
        throw new UnprocessableEntityError(error.response.data);
      } else {
        throw new Error(`API request failed: ${error.message}`);
      }
    });
};

export const deleteCustomer = (customerId) => {
  return axios.delete(`/customers/${customerId}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const sendCustomerFieldRevealCode = (customerId, field) => {
  return axios.get(`/customers/${customerId}/reveal/${field}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const verifyCustomerFieldRevealCode = (customerId, field, code, state = null) => {
  return axios.post(`/customers/${customerId}/reveal/${field}`, { code, state })
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

/* Profile */
export const getProfile = () => {
  return axios.get(`/profile`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const updateProfile = (profile) => {
  return axios.put(`/profile`, profile)
    .then(response => response.data)
    .catch(error => {
      if( error.response.status === 422 ) {
        throw new UnprocessableEntityError(error.response.data);
      } else {
        throw new Error(`API request failed: ${error.message}`);
      }
    });
};

/* Token exchange */
export const createToken = (email) => {
  return axios.post(`/oauth/tokens`, { email })
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
}

/* Users */
export const getUsers = () => {
  return axios.get('/users')
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

/* Vault admin */
export const rotateVaultKeys = () => {
  return axios.post('/vault/key-rotations')
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

/* Auth headers */
export const setAuthToken = (token) => {
  if( token ) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
  } else {
    axios.defaults.headers.common['Authorization'] = null;
  }
}

/* Vault headers */
export const setVaultMode = (isSecured) => {
  if( isSecured ) {
    axios.defaults.headers.common['X-Vault-Mode'] = "secure";
  } else {
    axios.defaults.headers.common['X-Vault-Mode'] = "insecure";
  }
}
