import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import clsx from 'clsx'

const iconColors = {
  yellow: 'text-yellow-500',
  purple: 'text-purple-500',
  green: 'text-green-500',
  red: 'text-red-500',
  orange: 'text-orange-500',
}

const iconBgColors = {
  yellow: 'bg-yellow-100',
  purple: 'bg-purple-100',
  green: 'bg-green-100',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
}

export function Icon({ icon, color, className, bgClassName }) {
  className = clsx(
    'h-6 w-6',
    iconColors[color],
    className
  )

  bgClassName = clsx(
    'mx-auto flex h-12 w-12 items-center justify-center rounded-full',
    iconBgColors[color],
    bgClassName
  )

  switch (icon) {
    case 'shield-check':
      return (
        <div className={bgClassName}>
          <ShieldCheckIcon className={className} aria-hidden="true" />
        </div>
      )
    case 'check':
      return (
        <div className={bgClassName}>
          <CheckIcon className={className} aria-hidden="true" />
        </div>
      )
    case 'exclamation':
        return (
          <div className={bgClassName}>
            <ExclamationIcon className={className} aria-hidden="true" />
          </div>
        )
    default:
      return null
  }
}

export default function Modal({ 
    title, 
    confirmButtonText = 'Confirm', 
    confirmButtonColor = 'blue',
    cancelButtonText = 'Cancel',
    cancelButtonColor = 'blue',
    onConfirmationButtonClick,
    open, 
    setOpen, 
    icon = 'check', 
    color = 'green', 
    className, 
    isSubmitting,
    children,
    ...props 
  }) {

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className={clsx(className, "relative z-10")} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    {icon && <Icon icon={icon} color={color} /> }
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </Dialog.Title>
                    <div className="mt-4">
                      {children}
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-8">
                  <Button
                    type="button"
                    variant="solid"
                    color={confirmButtonColor}
                    isSubmitting={isSubmitting}
                    onClick={onConfirmationButtonClick}
                    className="inline-flex w-full sm:col-start-1"
                  >
                    <span className="sr-only">{confirmButtonText}</span>
                    {confirmButtonText}
                  </Button>
                  <div className="mt-4 flex justify-center text-sm">
                    <Button
                      variant="link" 
                      color={cancelButtonColor}
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">{cancelButtonText}</span>
                      {cancelButtonText}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}