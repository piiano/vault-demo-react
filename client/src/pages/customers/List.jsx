import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { Placeholder } from '../../components/Loading'
import { Alert } from '../../components/Alert'
import { getCustomers } from '../../Api'

import { VaultContext } from '../../providers/VaultProvider'
import { LoginContext, RequireSupportRole, RedactIfSupportRole } from '../../providers/LoginProvider'

export default function ListCustomers() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([
    {},{},{}
  ]);
  const { isSecured } = useContext(
    VaultContext
  );
  const { profile } = useContext(
    LoginContext
  );


  useEffect(() => {
    setIsLoading(true);
    getCustomers()
      .then(
        (customers) => {
          setIsLoading(false);
          setCustomers(customers);
        },
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      )
  }, [isSecured, profile])

  return (
    <AppLayout>
      <div>
        <div className="sm:flex sm:items-center">
          <header className="sm:flex-auto">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Customers</h1>
            <p className="mt-2 max-w-4xl text-sm text-gray-500">
              A list of all the customers in your account.
          </p>
          </header>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button href="/customers/new" color="blue">New customer</Button>
          </div>
        </div>
        
        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                { 
                  error && 
                    <Alert color='red' icon='exclamation' className="mt-10">
                      Error: {error.message}
                    </Alert> 
                }
                
                {
                  !isLoading && customers.length === 0 ? (
                  <EmptyState 
                    message="No customers"
                    className="py-12" />
                  ) : (     
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50"> 
                        <tr>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Name
                          </th>
                          <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                            SSN
                          </th>
                          <RequireSupportRole profile={profile}>
                            <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                              Owner
                            </th>
                          </RequireSupportRole>
                          <th />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {(isLoading ? Array(3).fill({}) : customers).map((customer, i) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900">
                              <Placeholder isLoading={isLoading}>
                                <Link to={`/customers/${customer.id}`} className="text-blue-700 hover:text-blue-500 cursor-pointer" aria-label="Edit customer">
                                  {customer.name}
                                </Link>
                              </Placeholder>
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                              <Placeholder isLoading={isLoading}>{customer.email}</Placeholder>
                            </td>
                            <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                              <Placeholder isLoading={isLoading}>
                                <RedactIfSupportRole profile={profile}>{customer.ssn}</RedactIfSupportRole>
                              </Placeholder>
                            </td>
                            <RequireSupportRole profile={profile}>
                              <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-500">
                                <Placeholder isLoading={isLoading}>{customer.owner || '-'}</Placeholder>
                              </td>
                            </RequireSupportRole>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                              <Placeholder isLoading={isLoading}>
                                <Link to={`/customers/${customer.id}/edit`} className="text-blue-700 hover:text-blue-500 cursor-pointer" aria-label="Edit customer">
                                  Edit
                                </Link>
                              </Placeholder>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}