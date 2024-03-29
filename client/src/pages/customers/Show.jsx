import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { ErrorAlert } from '../../components/Alert'
import { Placeholder } from '../../components/Loading'
import { UserById } from '../../components/UserById'
import { getCustomer } from '../../Api'
import { VaultContext } from '../../providers/VaultProvider'
import { LoginContext, SecretTextIfSupportRole } from '../../providers/LoginProvider'
import { Button } from '../../components/Button'
import { formatEpoch } from '../../lib/utils'

export default function ShowCustomer({ props }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let { customerId } = useParams();
  const [customer, setCustomer] = useState({});
  const { isSecured } = useContext(
    VaultContext
  );
  const { profile } = useContext(
    LoginContext
  );

  useEffect(() => {
    setIsLoading(true);
    getCustomer(customerId)
      .then(
        (customer) => {
          setIsLoading(false);
          setCustomer(customer);
        },
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      )
  }, [customerId, isSecured, profile])

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-2lg sm:px-4 md:w-2/3 md:max-w-md md:px-0">
        <Button className="text-sm" href={`/customers`} variant="link" color="blue">← Back to customers</Button>

        { 
          error && 
            <ErrorAlert error={error} className="mt-10" />
        }

        {
          !error &&
          <>
          <div className="mt-4 grid grid-cols-1">
            <div className="sm:flex sm:items-center">
              <header className="sm:flex-auto truncate">
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900  text-ellipsis">
                  <Placeholder className="py-3.5 bg-gray-300" isLoading={isLoading}>{customer.name}</Placeholder>
                </h1>
                <div className="mt-1 max-w-4xl text-sm text-gray-500  text-ellipsis">
                  <Placeholder isLoading={isLoading}>{customer.email}</Placeholder>
                </div>
              </header>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1">
            <div className="flex items-center">
              <header className="flex-auto">
                <h3 className="font-medium text-gray-900">Details</h3>
              </header>
              <div className="flex xl:mt-0 xl:ml-3 text-sm">
                <div className="ml-3">
                  <Button href={`/customers/${customerId}/edit`} variant="link" color="blue">Edit</Button>
                </div>
              </div>
            </div>
            <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">ID</dt>
                <dd className="ml-2 truncate text-gray-900">
                  <Placeholder isLoading={isLoading}>{customer.id}</Placeholder>
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">Name</dt>
                <dd className="ml-2 truncate text-gray-900">
                  <Placeholder isLoading={isLoading}>{customer.name}</Placeholder>
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">Email</dt>
                <dd className="ml-2 truncate text-gray-900">
                  <Placeholder isLoading={isLoading}>{customer.email}</Placeholder>
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">SSN</dt>
                <dd className="ml-2 truncate text-gray-900 text-right">
                  <Placeholder isLoading={isLoading}>
                    <SecretTextIfSupportRole 
                        profile={profile} 
                        email={customer.email} 
                        text={customer.ssn} 
                        verifyCode={(password) => { return new Promise((resolve) => { resolve(customer.ssn); } ) }}
                        sendCode={() => { return new Promise((resolve) => { resolve(); }) }}
                      />
                  </Placeholder>
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">Expiration</dt>
                <dd className="ml-2 truncate text-gray-900">
                  <Placeholder isLoading={isLoading}>{formatEpoch(customer.expiration)}</Placeholder>
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm font-medium">
                <dt className="text-gray-500">Owner</dt>
                <dd className="ml-2 truncate text-gray-900">
                  <Placeholder isLoading={isLoading}><UserById id={customer.owner_id} /></Placeholder>
                </dd>
              </div>
            </dl>
          </div>
          </>
        }
      </div>
    </AppLayout>
  )
}
