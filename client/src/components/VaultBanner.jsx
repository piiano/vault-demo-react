import { useContext, useState, useEffect } from 'react'
import { Container } from './Container'
import { Toggle } from './Toggle'
import { VaultContext } from '../providers/VaultProvider'
import { LoginContext } from '../providers/LoginProvider'
import clsx from 'clsx'
import SelectMenu from './SelectMenu'

import { getUsers } from '../Api'

export default function VaultBanner({ className, title, ...props }) {
  const { isSecured, toggleIsSecured } = useContext(
    VaultContext
  );

  const { switchUser, isLoadingUsers, users, profile } = useContext(
    LoginContext
  );

  const [selectedUser, setSelectedUser] = useState(null)
  
  useEffect(() => {
    if( profile ) {
      let user = users.find(u => u.id === profile.id)
      setSelectedUser(user);
    } else {
      setSelectedUser(users[0]);
    }
  }, [users])

  useEffect(() => {
    // When profile changes, set selected user
    if( profile ) {
      let user = users.find(u => u.id === profile.id)
      setSelectedUser(user)
    }
  }, [profile])

  useEffect(() => {
    // When selected user changes, create token for that user
    if( selectedUser ) {
      switchUser(selectedUser)
    }
  }, [selectedUser])

  return (
    <div className={clsx('border-b bg-orange-50', className)} 
      {...props}>
        <Container>
          <div className="flex items-center justify-between gap-x-10 py-2 sm:py-2">
            <SelectMenu
              isLoading={ isLoadingUsers }
              className="w-60" 
              selected={selectedUser}
              setSelected={setSelectedUser} 
              items={users}
              by="id"
            />

            <p className="text-sm text-orange-700 py-1 text-center hidden md:block">
              This is a demo on how to use Piiano Vault to protect sensitive information.
            </p>
            
            <Toggle className="w-60 justify-end" title="Secure mode"
              enabled={isSecured}
              setEnabled={toggleIsSecured}/>
          </div>
        </Container>
    </div>
  )
}