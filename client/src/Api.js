import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.baseURL = API_BASE_URL;

let customers = [
  { id: "1", name: 'Customer 1', email: 'customer1@piiano.com', ssn: '123-45-6789' },
  { id: "2", name: 'Customer 2', email: 'customer2@piiano.com', ssn: '323-45-6389' },
  { id: "3", name: 'Customer 3', email: 'customer3@piiano.com', ssn: '523-25-6782' },
  // More customers...
]

let users = [
  { id: "1", name: 'User 1', email: 'user1@example.com', role: 'owner', avatar: 'https://www.gravatar.com/avatar/111d68d06e2d317b5a59c2c6c5bad808?d=identicon' },
  { id: "2", name: 'User 2', email: 'user2@example.com', role: 'owner', avatar: 'https://www.gravatar.com/avatar/ab53a2911ddf9b4817ac01ddcd3d975f?d=identicon' },
  { id: "3", name: 'Piiano Support', email: 'support@piiano.com', role: 'support', avatar: 'https://www.gravatar.com/avatar/51e1dc098d02ed5e96c1069b4c4bd029?d=identicon' },
]

let isAxiosMock = false;

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
    .onAny(/\/customers\/\d+/).reply((config) => {
      const customerId = config.url.split('/').pop();
      const customer = customers.find(c => c.id === customerId);
      return customer ? [200, customer] : [404, { message: 'Customer not found.' }];
    })
    .onAny('/profile').reply((config) => {
      let profile = null;
      if (config.headers && config.headers.Authorization) {
        // Assume the token is the user email
        const email = config.headers.Authorization.split(' ')[1];
        profile = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
      }

      return profile ? [200, profile] : [404, { message: 'Profile not found.' }];
    })
    .onGet('/users').reply(200, users)
    .onPost('/oauth/tokens').reply((config) => {
      const { email } = JSON.parse(config.data);
      const user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());  
      if (user) {
        return [200, { token: email }];
      } else {
        return [401, { message: 'Invalid email or password.' }];
      } 
    })
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
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const getCustomer = (customerId) => {
  return axios.get(`/customers/${customerId}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const updateCustomer = (customer) => {
  return axios.put(`/customers/${customer.id}`, customer)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const deleteCustomer = (customerId) => {
  return axios.delete(`/customers/${customerId}`)
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
      throw new Error(`API request failed: ${error.message}`);
    });
};

/* Token exchange */
export const createToken = (id) => {
  return axios.post(`/oauth/tokens`, { id })
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
