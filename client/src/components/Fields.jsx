import { Placeholder } from './Loading'
import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-purple-500 sm:text-sm pr-10'

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-800 cursor-pointer string optional"
    >
      {children}
    </label>
  )
}

export function TextField({
  id,
  label,
  type = 'text',
  className = '',
  errorClassName = 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-300',
  required,
  isLoading,
  error = null,
  hint = null,
  ...props
}) {
  return (
    
      <div className={className}>
        {label && <Label id={id}>{label}
          {!required && <span className="text-gray-500 font-normal">{' '}(optional)</span>}
        </Label>}
        <Placeholder className="h-8"  isLoading={isLoading}>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input id={id} type={type} {...props} className={clsx(formClasses, error? errorClassName : '')} />
            {
              error && 
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            }
          </div>
          { error && <div className="mt-2 text-red-600 text-xs">{error}</div> }
          { hint && <div className="mt-2 text-sm text-gray-500">{hint}</div> }
        </Placeholder>
      </div>
    
  )
}

export function SearchField({
  id,
  label,
  type = 'text',
  className = '',
  errorClassName = 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-300',
  error = null,
  hint = null,
  required,
  isLoading,
  ...props
}) {
  return (
      <div className={className}>
        {label && <Label id={id}>{label}
          {!required && <span className="text-gray-500 font-normal">{' '}(optional)</span>}
        </Label>}
        <Placeholder className="h-8"  isLoading={isLoading}>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              aria-hidden="true"
            >
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input id={id} type={type} {...props} className={clsx(formClasses, 'pl-9', error ? errorClassName : '')} />
          </div>
        </Placeholder>
      </div>
    
  )
}


export function SelectField({ 
  id, 
  label, 
  className = '', 
  errorClassName = 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-300',
  error = null, 
  hint = null,
  required,
  ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}
          {!required && <span className="text-gray-500 font-normal">{' '}(optional)</span>}
        </Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8', error ? errorClassName : '')} />
      { error && <div className="mt-2 text-red-600 text-xs">{error}</div> }
      { hint && <div className="mt-2 text-sm text-gray-500">{hint}</div> }
    </div>
  )
}
