import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.baseURL = API_BASE_URL;

let customers = [
  { id: "1", name: 'Customer 1', email: 'customer1@piiano.com', ssn: '123-45-6789' },
  { id: "2", name: 'Customer 2', email: 'customer2@piiano.com', ssn: '323-45-6389' },
  { id: "3", name: 'Customer 3', email: 'customer3@piiano.com', ssn: '523-25-6782' },
  // More customers...
]

export const getCustomers = () => {
  /*return new Promise((resolve, reject) => {
    // Mimic a slow API call
    setTimeout(() => {
      resolve(customers)}, 1000);
  });*/
  
  return axios.get('/customers')
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const createCustomer = (customer) => {
  /*return new Promise((resolve, reject) => {
    // Mimic a slow API call
    setTimeout(() => {
      resolve(customer)
    }, 1000);
  });*/
  console.log(customer)
  return axios.post('/customers/', customer)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const getCustomer = (customerId) => {
  /*let customer = customers.find(c => c.id === customerId);

  return new Promise((resolve, reject) => {
    // Mimic a slow API call
    setTimeout(() => {
      if( customer ) {
        resolve(customer)
      } else {
        reject(new Error(`Customer not found: ${customerId}`))
      }
        
    }, 1000);
  });*/

  return axios.get(`/customers/${customerId}/`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const updateCustomer = (customer) => {
  /*return new Promise((resolve, reject) => {
    // Mimic a slow API call
    setTimeout(() => {
      resolve(customer)
    }, 1000);
  });*/

  return axios.put(`/customers/${customer.id}/`, customer)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const deleteCustomer = (customerId) => {
  return axios.delete(`/customers/${customerId}/`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`API request failed: ${error.message}`);
    });
};

export const setVaultMode = (isSecured) => {
  if( isSecured ) {
    axios.defaults.headers.common['X-Vault-Mode'] = "secure";
  } else {
    axios.defaults.headers.common['X-Vault-Mode'] = "insecure";
  }
}