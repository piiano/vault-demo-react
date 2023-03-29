import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { setAuthToken, createToken, getProfile, getUsers } from '../Api';
import { SecretText } from '../components/SecretText';

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

const maskText = (text, char="X") => {
  if( text ) {
    return text.replace(/^(\d{3})(.)[\d\-]{2}/g, Array(4).join(char) + "-" + Array(3).join(char))
  } else {
    return "";
  }
}

const MaskIfRoles = ({ profile, roles, text, char="X" }) => {
  if( profile && roles.includes(profile.role) ) {
    return maskText(text, char);
  }
  return text;
}

const MaskIfSupportRole = ({ profile, text, char="X" }) => {
  return MaskIfRoles({ profile, roles: ["support"], text, char });
}

const SecretTextIfRoles = ({ profile, roles, email, text, sendCode, verifyCode, format="XXXXXXXXXXXXXX" }) => {
  if( profile && roles.includes(profile.role) ) {
    return <SecretText sendCode={sendCode} verifyCode={verifyCode} email={email} format={format} />
  }
  return text;
} 

const SecretTextIfSupportRole = ({ profile, email, text, sendCode, verifyCode, format="XXXXXXXXXXXXXX" }) => {
  return SecretTextIfRoles({ profile, roles: ["support"], email, text, sendCode, verifyCode, format });
} 

export { LoginProvider, LoginContext, RequireLogin, RequireSupportRole, MaskIfSupportRole, SecretTextIfSupportRole };