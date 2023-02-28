import clsx from 'clsx'

export function Announcement({ className, ...props }) {
  return (
    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
      <div
      className={clsx('relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20', className)}
      {...props}
      />
    </div>
  )
}
