import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ListCustomers from './pages/customers/List'
import NewCustomer from './pages/customers/New'
import EditCustomer from './pages/customers/Edit'
import EditProfile from './pages/profile/Edit'
import { LoginProvider, RequireLogin } from './providers/LoginProvider';
import { VaultProvider } from './providers/VaultProvider';
import ShowCustomer from './pages/customers/Show';

function App() {
  
  return (
    <BrowserRouter>
      <LoginProvider>
        <VaultProvider>
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
              path="/profile"
              element={
                <RequireLogin><EditProfile /></RequireLogin>
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
            <Route
              path="/customers/:customerId"
              element={
                <RequireLogin><ShowCustomer /></RequireLogin>
              }
            />
            <Route
              path="/customers/:customerId/edit"
              element={
                <RequireLogin><EditCustomer /></RequireLogin>
              }
            />
          </Routes>
        </VaultProvider>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
