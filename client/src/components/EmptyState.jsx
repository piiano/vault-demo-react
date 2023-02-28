import clsx from 'clsx'

export function EmptyState({ message, description, className, ...props }) {
  return (
    <div
      className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8', className)}
      {...props} >
      <div className="text-center">
        <p className="mt-1 text-md text-gray-500">{message}</p>
      </div>
    </div>
  )
}
