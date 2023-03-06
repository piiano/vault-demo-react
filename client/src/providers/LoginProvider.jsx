import React, { createContext, useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginContext = createContext();

const LoginProvider = (props) => {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLoginClick = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    navigate("/customers");
  };

  const handleLogoutClick = (event) => {
    event.preventDefault();
    setIsLoggedIn(false);
  };

  const getLoggedInProfile = () => {
    //localStorage.getItem('loggedInUser')
    return {
      name: 'Test',
      email: 'example@piiano.com',
      imageUrl: 
        'https://piiano.com/wp-content/themes/hello-elementor/assets/images/cropped-favicon-512x512.png',
    }
  };

  const contextValue = {
    isLoggedIn,
    handleLoginClick,
    handleLogoutClick,
    getLoggedInProfile,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {props.children}
    </LoginContext.Provider>
  );
}

const RequireLogin = ({ children }) => {
    const { isLoggedIn } = useContext(
        LoginContext
    );
 
    if( !isLoggedIn ) {
        return <Navigate to='/login' />
    }
    return children;
}

export { LoginProvider, LoginContext, RequireLogin };