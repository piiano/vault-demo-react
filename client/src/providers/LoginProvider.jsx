import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { setAuthToken, createToken, getProfile, getUsers } from '../Api';

import clsx from 'clsx';

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
    refreshUsers();
  }, [])


  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    refreshProfile();
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

  const refreshUsers = () => {
    setIsLoadingUsers(true);
    getUsers()
      .then(
        (users) => {
          setUsers(users.sort((a, b) => a.name.localeCompare(b.name)));
          setIsLoadingUsers(false);
        },
        (error) => {
          setIsLoadingUsers(false);
          console.log(error);
        }
      )
  }

  const refreshProfile = () => {
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
  }

  const refresh = () => {
    refreshProfile();
    refreshUsers();
  }

  const contextValue = {
    isLoadingUsers,
    isLoadingProfile,
    isLoggedIn,
    users,
    profile,
    refresh,
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

const maskText = (text, length=4, char="X") => {
  if( text ) {
    return text.replace(/\d{4}$/g, Array(length + 1).join(char));  
  } else {
    return "";
  }
}

const MaskIfRoles = ({ profile, roles, text, length=4, char="X" }) => {
  if( profile && roles.includes(profile.role) ) {
    return maskText(text, length, char);
  }
  return text;
}

const MaskIfSupportRole = ({ profile, text, length=4, char="X" }) => {
  return MaskIfRoles({ profile, roles: ["support"], text, length, char });
}

export { LoginProvider, LoginContext, RequireLogin, RequireSupportRole, MaskIfSupportRole };