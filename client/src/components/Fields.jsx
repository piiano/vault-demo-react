import { Placeholder } from './Loading'
import {
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-purple-500 sm:text-sm'

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
          <input id={id} type={type} {...props} className={formClasses} />
        </Placeholder>
      </div>
    
  )
}

export function SearchField({
  id,
  label,
  type = 'text',
  className = '',
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
            <input id={id} type={type} {...props} className={clsx(formClasses, 'pl-9')} />
          </div>
        </Placeholder>
      </div>
    
  )
}


export function SelectField({ id, label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
      
    </div>
  )
}
