import { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { LoginContext } from '../providers/LoginProvider'
import { Link } from 'react-router-dom'

import clsx from 'clsx';

const profile = {
  name: 'Test',
  email: 'example@piiano.com',
  imageUrl: 
    'https://piiano.com/wp-content/themes/hello-elementor/assets/images/cropped-favicon-512x512.png',
}

export function MobileProfile({ className }) {
  return (
    <div className="flex items-center px-4">
      {profile.imageUrl && (
      <div className="flex-shrink-0 mr-3">
        <img className="h-10 w-10 rounded-full" src={profile.imageUrl} alt="" />
      </div>
      )}
      <div>
        <div className="text-base font-medium leading-snug text-gray-800">{profile.name}</div>
        <div className="text-sm font-medium leading-snug text-gray-500">{profile.email}</div>
      </div>
    </div>
  );
}

export function NavProfile({ className }) {
  const { isLoggedIn, handleLogoutClick } = useContext(
    LoginContext
  );

  const navigation = [
    { name: 'Sign out', onClick: handleLogoutClick, className: 'text-red-600 hover:text-red-700 hover:bg-red-50' },
  ]  

  className = clsx(
    'relative ml-3',
    className
  )

  return (
    <Menu as="div" className={className}>
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="sr-only">Open profile menu</span>
          {profile.imageUrl && (
            <img className="h-8 w-8 rounded-full" src={profile.imageUrl} alt="" />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        
        <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <div className="truncate">
                <div className="flex flex-row items-center py-4 px-4 border-b">
                  {profile.imageUrl && (
                    <div className="flex-shrink-0 mr-3">
                      <img className="h-10 w-10 rounded-full" src={profile.imageUrl} alt="" />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-medium leading-snug text-gray-800 truncate">{profile.name}</div>
                    <div className="text-sm font-medium leading-snug text-gray-500 truncate">{profile.email}</div>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
          {navigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <Link
                  to={item.to}
                  onClick={item.onClick}
                  className={clsx(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm',
                    item.className
                  )}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}