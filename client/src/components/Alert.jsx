import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

const baseColors = {
  yellow: 'border-yellow-400 bg-yellow-50',
  blue: 'border-blue-400 bg-blue-50',
  green: 'border-green-400 bg-green-50',
  red: 'border-red-400 bg-red-50',
}

const textColors = {
  yellow: 'text-yellow-700',
  blue: 'text-blue-700',
  green: 'text-green-700',
  red: 'text-red-700',
}

const iconColors = {
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  red: 'text-red-400',
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
            <ExclamationTriangleIcon className={className} aria-hidden="true" />
          </div>
        )
    default:
      return null
  }
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
          <p className={textClassName}>
            {props.children}
          </p>
        </div>
      </div>
    </div>
  )
}
