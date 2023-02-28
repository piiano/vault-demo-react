import clsx from 'clsx'

export function Loading({ className, text, ...props }) {
  return (
    <div
      className={clsx('flex items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 leading-6 text-md text-gray-500 transition ease-in-out duration-150 cursor-not-allowed', className)}
      {...props} disabled="">
      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div>
        {text}
      </div>
    </div>
  )
}