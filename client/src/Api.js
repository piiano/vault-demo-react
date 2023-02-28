import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

axios.defaults.baseURL = API_BASE_URL;

export const getCustomers = () => {
  return new Promise((resolve, reject) => {
    // Mimic a slow API call
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Customer 1', email: 'customer1@piiano.com', ssn: '123-45-6789' },
        { id: 2, name: 'Customer 2', email: 'customer2@piiano.com', ssn: '323-45-6389' },
        { id: 3, name: 'Customer 3', email: 'customer3@piiano.com', ssn: '523-25-6782' },
        // More customers...
      ])}, 1000);
  });
  
  // return axios.get('/customers')
  //   .then(response => response.data)
  //   .catch(error => {
  //     throw new Error(`API request failed: ${error.message}`);
  //   });
};

export const createCustomer = (customer) => {
  return new Promise((resolve, reject) => {
    // Mimic a slow API call
    setTimeout(() => {
      resolve(customer)
    }, 1000);
  });
  // return axios.post('/customers', customer)
  //   .then(response => response.data)
  //   .catch(error => {
  //     throw new Error(`API request failed: ${error.message}`);
  //   });
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
