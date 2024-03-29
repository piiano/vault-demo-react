import { Link } from 'react-router-dom'
import clsx from 'clsx'

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center rounded-md py-2 px-4 text-sm font-semibold disabled:opacity-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
  outline:
    'group inline-flex ring-1 items-center justify-center rounded-md py-2 px-4 text-sm disabled:opacity-50 focus:outline-none',
}

const variantStyles = {
  link: {
    red:
      'font-medium text-red-700 hover:text-red-500 cursor-pointer',
    blue:
      'font-medium text-purple-700 hover:text-purple-500 cursor-pointer',
  },
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
    blue: 'bg-purple-600 text-white hover:text-slate-100 hover:bg-purple-500 active:bg-purple-800 active:text-purple-100 focus-visible:outline-purple-600',
    green: 'bg-green-600 text-white hover:text-slate-100 hover:bg-green-500 active:bg-green-800 active:text-green-100 focus-visible:outline-green-600',
    red: 'bg-red-600 text-white hover:text-slate-100 hover:bg-red-500 active:bg-red-800 active:text-green-100 focus-visible:outline-red-600',
    white:
      'bg-white text-slate-900 hover:bg-purple-50 active:bg-purple-200 active:text-slate-600 focus-visible:outline-white',
  },
  outline: {
    slate:
      'ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-purple-600 focus-visible:ring-slate-300',
    white:
      'bg-white ring-gray-300 text-gray-900 hover:text-gray-700 hover:ring-gray-400 active:ring-gray-700 active:text-grat-400 focus-visible:outline-white hover:bg-gray-50',
    red:
      'bg-red-50 ring-red-700 text-red-700 hover:text-red-500 hover:ring-red-500 active:ring-red-700 active:text-red-400 focus-visible:outline-white',
  },
}

function Spinner() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

export function Button({
  variant = 'solid',
  color = 'slate',
  className,
  confirm,
  isSubmitting,
  href,
  ...props
}) {
  let submittingStyles = isSubmitting ? 'pr-4' : '';

  className = clsx(
    baseStyles[variant],
    variantStyles[variant][color],
    submittingStyles,
    className
  )

  return href ? (
    <Link to={href} className={className} {...props} disabled={isSubmitting}>
      {isSubmitting && <Spinner variant={variant} color={color} />}
      {props.children}
    </Link>
  ) : (
    <button className={className} {...props} disabled={isSubmitting}>
      {isSubmitting && <Spinner variant={variant} color={color} />}
      {props.children}
    </button>
  )
}
