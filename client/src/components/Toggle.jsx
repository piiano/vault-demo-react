import { Switch } from '@headlessui/react'
import clsx from 'clsx'

export function Toggle({ className, title, description, enabled, setEnabled, ...props }) {
  return (
    <Switch.Group as="div"
      className={clsx('flex items-center', className)}
      {...props}>
      <Switch.Label as="span" className="mr-3">
        <span 
          className={clsx(
            enabled ? 'text-orange-600' : 'text-gray-900',
            'text-sm font-medium cursor-pointer'
          )}>{title}</span>{' '}
      </Switch.Label>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={clsx(
          enabled ? 'bg-orange-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}