import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ListCustomers from './pages/customers/List'
import NewCustomer from './pages/customers/New'
import { LoginProvider, RequireLogin } from './providers/LoginProvider';

function App() {
  
  return (
    <BrowserRouter>
      <LoginProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route
            path="/register"
            element={
              <Register />
            }
          />
          <Route
            path="/login"
            element={
              <Login />
            }
          />
          <Route
            path="/customers"
            element={
              <RequireLogin><ListCustomers /></RequireLogin>
            }
          />
          <Route
            path="/customers/new"
            element={
              <RequireLogin><NewCustomer /></RequireLogin>
            }
          />
        </Routes>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
