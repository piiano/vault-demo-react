import { useContext } from 'react'
import { Container } from './Container'
import { Toggle } from './Toggle'
import { VaultContext } from '../providers/VaultProvider'
import clsx from 'clsx'

export default function VaultBanner({ className, title, ...props }) {
  const { isSecured, toggleIsSecured } = useContext(
    VaultContext
  );

  return (
    <div className={clsx('border-b bg-orange-50', className)} 
      {...props}>
        <Container>
          <div className="flex items-center justify-between gap-x-10 py-2.5 sm:py-3">
            <p className="text-sm leading-6 text-gray-600">
              This is a Piiano Vault sample on how to use the Vault API to store and retrieve sensitive information.
            </p>
            <Toggle title="Secure mode"
              enabled={isSecured}
              setEnabled={toggleIsSecured}/>
          </div>
        </Container>
    </div>
  )
}