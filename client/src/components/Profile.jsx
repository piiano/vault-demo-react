import { Fragment, useContext, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { LoginContext } from '../providers/LoginProvider'
import { Link } from 'react-router-dom'

import { getProfile } from '../Api'

import clsx from 'clsx';

export function MobileProfile({ className }) {
  const { isLoadingProfile, profile } = useContext(
    LoginContext
  );

  useEffect(() => {}, [profile]);

  className = clsx(
    'flex items-center px-4',
    className
  )

  return (
    profile && <div className={className}>
      {profile.avatar && (
      <div className="flex-shrink-0 mr-3">
        <img className="h-10 w-10 rounded-full" src={profile.avatar} alt="" />
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
  const { profile, handleLogoutClick } = useContext(
    LoginContext
  );

  useEffect(() => {}, [profile]);
  
  const navigation = [
    { name: 'Your profile', to: '/profile', className: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 ' },
    { name: 'Logout', onClick: handleLogoutClick, className: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 ' },

  ]  

  className = clsx(
    'relative ml-3',
    className
  )
  
  return (
    profile && <Menu as="div" className={className}>
      <div>
        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="sr-only">Open profile menu</span>
          {profile.avatar && (
            <img className="h-8 w-8 rounded-full" src={profile.avatar} alt="" />
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
        
        <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div className="truncate">
                  <div className="flex flex-row items-center py-4 px-4">
                    {profile.avatar && (
                      <div className="flex-shrink-0 mr-3">
                        <img className="h-10 w-10 rounded-full" src={profile.avatar} alt="" />
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
          </div>
          <div className="py-1">
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
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}