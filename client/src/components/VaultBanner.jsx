import { useContext, useState, useEffect, Fragment } from 'react'
import { Container } from './Container'
import { Toggle } from './Toggle'
import { Modal } from './Modal';
import { VaultContext } from '../providers/VaultProvider'
import { LoginContext } from '../providers/LoginProvider'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, CommandLineIcon, Bars3BottomLeftIcon, ArrowPathIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import SelectMenu from './SelectMenu'
import { rotateVaultKeys } from '../Api';
import { ErrorAlert } from './Alert';

function VaultActionsMenu({className}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  function handleRotateVaultKeys() {
    setIsSubmitting(true);
    rotateVaultKeys()
      .then(
        () => {
          setIsDialogOpen(false);
          setIsSubmitting(false);
        },
        (error) => {
          setIsSubmitting(false);
          setError(error);
        }
      )
  }

  const actions = [
    { name: 'View logs',
      icon: Bars3BottomLeftIcon,
      href: "http://localhost:5601/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15h,to:now))&_a=(columns:!(message,reason,operation_id,user_name,personsIDs,data_requested,data_accessed,container.labels.com_docker_compose_service),filters:!(),interval:s,query:(language:kuery,query:'not%20(type:log)%20and%20not%20(operation_id:internal)'),sort:!(!('@timestamp',desc)))",
      target: '_blank' },
    { name: 'View terminal', 
      icon: CommandLineIcon, 
      href: 'http://localhost:5050',
      target: '_blank' },
    { name: 'Rotate Vault keys', 
      icon: ArrowPathIcon, 
      onClick: () => { setIsDialogOpen(true) } }
  ]
  return (
    <Menu as="div" className={ clsx("relative inline-block text-left", className) }>
      <div>
        <Menu.Button className="relative w-full cursor-pointer rounded-md py-1.5 pl-3 pr-10 text-left text-gray-700 hover:text-gray-900 focus:outline-none sm:text-sm sm:leading-6 cursor-pointer">
          Developers
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
          {
            actions.map((action, index) => (
              
                <Menu.Item key={index}>
                  {({ active }) => (
                    <a
                      href={action.href}
                      onClick={action.onClick}
                      className={clsx(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm cursor-pointer'
                      )}  
                      target={action.target}
                    >
                      {action.icon && (
                          <action.icon 
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                      )}
                      <span className="truncate">{action.name}</span>
                    </a>
                  )}
                </Menu.Item>
            ))
          }
          </div>
        </Menu.Items>
      </Transition>
      <Modal 
        open={isDialogOpen} 
        setOpen={setIsDialogOpen} 
        title="Rotate Vault keys?"
        confirmButtonText="Yes, rotate Vault keys"
        cancelButtonText="No, don't rotate"
        onConfirmationButtonClick={handleRotateVaultKeys} 
        icon="arrow-path"
        color="green"
        isSubmitting={isSubmitting} >

        { 
          error && 
            <ErrorAlert error={error} />
        }
        <p className="mt-4 text-sm text-gray-600">
          Are you sure you want to rotate Vault keys? This action cannot be undone.
        </p>
      </Modal>
    </Menu>
  )
}

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
    <div className={clsx('border-b border-t bg-orange-50', className)} 
      {...props}>
        <Container>
          <div className="flex items-center justify-between gap-x-10 py-2 sm:py-2">
            <div className="flex items-center justify-between">
              <SelectMenu
                isLoading={ isLoadingUsers }
                className="w-60" 
                selected={selectedUser}
                setSelected={setSelectedUser} 
                items={users}
                by="id"
              />
            </div>

            <p className="text-sm text-orange-600 py-1 text-center hidden md:block">
              This is a demo on how to use Piiano Vault to protect sensitive information.
            </p>

            <div className="ml-3 flex items-center justify-between">
              <VaultActionsMenu className="hidden sm:block" />
              <div className="ml-2 mr-3 h-5 w-px bg-gray-400 hidden sm:block" />
              <Toggle className="justify-end w-full" title="Secure mode"
                enabled={isSecured}
                setEnabled={toggleIsSecured}/>
            </div>
            
          </div>
        </Container>
    </div>
  )
}