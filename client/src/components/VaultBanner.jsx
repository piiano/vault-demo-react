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
        <Container>
        <p className="text-sm text-orange-700 py-1 text-center hidden md:block">
              Links:&nbsp;
              <a target="_blank" href="http://localhost:5601/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15h,to:now))&_a=(columns:!(message,reason,operation_id,user_name,personsIDs,data_requested,data_accessed,container.labels.com_docker_compose_service),filters:!(),interval:s,query:(language:kuery,query:'not%20(type:log)%20and%20not%20(operation_id:internal)%20and%20(container.labels.com_docker_compose_service:client%20piiano-vault%20server-python-django)'),sort:!(!('@timestamp',desc)))">logs</a>
              &nbsp;|&nbsp;
              <a target="_blank" href="http://localhost:5050">terminal</a>
            </p>
        </Container>
    </div>
  )
}