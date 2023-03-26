import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { pluralize } from '../lib/utils'

const baseColors = {
  yellow: 'border-yellow-500 bg-yellow-50',
  purple: 'border-purple-500 bg-purple-50',
  green: 'border-green-500 bg-green-50',
  red: 'border-red-500 bg-red-50',
}

const textColors = {
  yellow: 'text-yellow-500',
  purple: 'text-purple-500',
  green: 'text-green-500',
  red: 'text-red-500',
}

const iconColors = {
  yellow: 'text-yellow-500',
  purple: 'text-purple-500',
  green: 'text-green-500',
  red: 'text-red-500',
}

export function Icon({ icon, color, className }) {
  className = clsx(
    'h-5 w-5',
    iconColors[color],
    className
  )

  switch (icon) {
    case 'check':
      return (
        <div className="flex-shrink-0">
          <CheckCircleIcon className={className} aria-hidden="true" />
        </div>
      )
    case 'exclamation':
        return (
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className={className} aria-hidden="true" />
          </div>
        )
    default:
      return null
  }
}

export function ErrorAlert({ error = {}, list = false }) {
  let keys = error.errors ? Object.keys(error.errors) : null;
  return <Alert color='red' icon='exclamation' className="mt-10">
    { keys ?
      <>
        <h3 className="text-sm text-red-700">
          Found {pluralize(keys.length, 'error', true)} with your submission:
        </h3>
        {list &&
          <ul className="list-disc list-inside">
            {keys.map((key, index) => (
              <li key={keys}>{key}: {error.errors[key]}</li>
            ))}
          </ul>
        }
      </>
      :
      <div>Error: {error.message}</div>
    }
  </Alert> 
}

export function Alert({
  color = 'yellow',
  icon = '',
  className,
  ...props
}) {
  className = clsx(
    'rounded-md p-4',
    baseColors[color],
    className
  )

  let textClassName = clsx(
    'text-sm',
    textColors[color],
  )

  return (
    <div className={className}>
      <div className="flex items-center">
        {
          icon && <Icon icon={icon} color={color} />
        }
        <div className="ml-3">
          <div className={textClassName}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}
