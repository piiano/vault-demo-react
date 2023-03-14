import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { setAuthToken, createToken, getProfile, getUsers } from '../Api';

const LoginContext = createContext();

const LoginProvider = (props) => {
  const navigate = useNavigate();
  
  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    //localStorage.getItem('isLoggedIn') === 'true'
    true
  );

  const [profile, setProfile] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [users, setUsers] = useState([])

  useEffect(() => {
    setIsLoadingUsers(true);
    getUsers()
      .then(
        (users) => {
          setUsers(users);
          setIsLoadingUsers(false);
        },
        (error) => {
          setIsLoadingUsers(false);
          console.log(error);
        }
      )
  }, [])


  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if( token ) {
      setIsLoadingProfile(true);
      localStorage.setItem('token', token);
      setAuthToken(token);
      // Fetch profile
      
      getProfile()
        .then(
          (profile) => {
            setProfile(profile);
            setIsLoadingProfile(false);
          },
          (error) => {
            setIsLoadingProfile(false);
            console.log(error);
          }
        )
    } else {
      localStorage.removeItem('token');
      setAuthToken(null);
    }
  }, [token]);

  const switchUser = (user) => {
    createToken(user.email)
      .then(
        ({ token }) => {
          setToken(token);
        },
        (error) => {
          console.log(error);
        }
      )
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    navigate("/customers");
  };

  const handleLogoutClick = (event) => {
    event.preventDefault();
    // setIsLoggedIn(false);
    // Stay logged in
    setIsLoggedIn(true);
  };

  const contextValue = {
    isLoadingUsers,
    isLoadingProfile,
    isLoggedIn,
    users,
    profile,
    switchUser,
    handleLoginClick,
    handleLogoutClick,
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

const RequireRoles = ({ profile, roles, children }) => {
  if( profile && roles.includes(profile.role) ) {
    return children;
  }
  return null;
}

const RequireSupportRole = ({ profile, redact, children }) => {
  return <RequireRoles redact={redact} profile={profile} roles={["support"]} children={children} />
}

const RedactIfRoles = ({ profile, roles, children }) => {
  if( profile && roles.includes(profile.role) ) {
    return <span className="text-gray-500">{'<REDACTED>'}</span>;
  }
  return children;
}

const RedactIfSupportRole = ({ profile, roles, children }) => {
  return <RedactIfRoles profile={profile} roles={["support"]} children={children} />
}

export { LoginProvider, LoginContext, RequireLogin, RequireSupportRole, RedactIfSupportRole };