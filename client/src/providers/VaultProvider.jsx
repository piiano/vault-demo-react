import React, { createContext, useState, useEffect } from 'react';
import { setVaultMode } from '../Api';

const VaultContext = createContext();

const VaultProvider = (props) => {
  const [isSecured, setIsSecured] = useState(
    localStorage.getItem('isSecured') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isSecured', isSecured);
    setVaultMode(isSecured);
  }, [isSecured]);

  const toggleIsSecured = () => {
    setIsSecured(!isSecured);
  };

  const contextValue = {
    isSecured,
    toggleIsSecured,
  };

  return (
    <VaultContext.Provider value={contextValue}>
      {props.children}
    </VaultContext.Provider>
  );
}

export { VaultProvider, VaultContext };