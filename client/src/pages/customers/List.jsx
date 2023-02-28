import { useState, useEffect } from 'react'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { Loading } from '../../components/Loading'
import { getCustomers } from '../../Api'

export default function ListCustomers() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

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
  }, [])

  return (
    <AppLayout error={error} isLoading={isLoading}>
    <div>
      <div className="sm:flex sm:items-center">
        <header className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-700">
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
                isLoading ? 
                  <Loading className="py-12" text="Loading..." /> :
                  (
                    customers.length === 0 ? (
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
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {customers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-900">
                                {customer.name}
                              </td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{customer.email}</td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{customer.ssn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
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