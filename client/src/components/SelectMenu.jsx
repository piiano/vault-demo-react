import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import clsx from 'clsx'
import { Placeholder } from './Loading'

export default function SelectMenu({ className, label, items, selected, setSelected, isLoading, by }) {
  return (
      <div className={clsx('flex items-center', className)}>
        <Listbox defaultValue={selected} onChange={setSelected} by={by}>
          {({ open }) => (
            <>
              { label && <Listbox.Label className="text-sm font-medium text-gray-900 mr-2">{label}</Listbox.Label> }
              <div className="relative w-full">
                <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer">
                  <span className="flex items-center">
                    <Placeholder isLoading={isLoading} className="w-4 h-4 my-0 rounded-full mr-3" >
                      { selected?.avatar && <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full mr-3" /> }
                    </Placeholder>
                    
                    <span className="block truncate">
                      <Placeholder isLoading={isLoading} className="h-2 my-0" >
                        {selected?.name}
                      </Placeholder>
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open && !isLoading}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {items.map((item, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          clsx(
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={item}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              { item.avatar && <img src={item.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full mr-3" /> }
                              <span
                                className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}
                              >
                                {item.name}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={clsx(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
  )
}
