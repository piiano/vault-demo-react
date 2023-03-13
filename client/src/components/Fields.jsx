import { Placeholder } from './Loading'
import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

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

export function SelectField({ id, label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
      
    </div>
  )
}
