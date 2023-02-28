import { useContext, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { Placeholder } from '../../components/Loading'
import { ErrorAlert } from '../../components/Alert'
import { UserById } from '../../components/UserById'
import { getCustomers } from '../../Api'
import { markFilter, pluralize } from '../../lib/utils'
import { VaultContext } from '../../providers/VaultProvider'
import { LoginContext, RequireSupportRole, MaskIfSupportRole, SecretTextIfSupportRole, RequireMemberRoleForCurrentUser } from '../../providers/LoginProvider'
import { SearchField } from '../../components/Fields'
import { TableSortToggle } from '../../components/TableSortToggle'

export default function ListCustomers() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sorting, setSorting] = useState({
    column: 'name',
    direction: 'asc'
  });
  const [customers, setCustomers] = useState([
    {},{},{}
  ]);
  const [customersCache, setCustomersCache] = useState([]);
  const { isSecured } = useContext(
    VaultContext
  );
  const { profile } = useContext(
    LoginContext
  );

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilter(value);
  };

  useEffect(() => {
    setIsLoading(true);
    getCustomers()
      .then(
        (customers) => {
          setIsLoading(false);
          setCustomersCache(customers);
        },
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      )
  }, [isSecured, profile])

  const applyFilterAndSorting = () => {
    let results = [...customersCache];
    
    // Apply filter
    if( filter && filter.length > 0 ) {
      results = results.filter((customer) => {
        return (
          customer?.name?.toLowerCase().includes(filter.toLowerCase()) ||
          customer?.email?.toLowerCase().includes(filter.toLowerCase()) ||
          customer?.ssn?.toLowerCase().includes(filter.toLowerCase())
        )
      });
    }

    // Apply sorting
    results = results.sort((a, b) => {
      if( a[sorting.column] < b[sorting.column] ) {
        return sorting.direction === 'asc' ? -1 : 1;
      }
      if( a[sorting.column] > b[sorting.column] ) {
        return sorting.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
        
    // Set results
    setCustomers(results);
  }

  useMemo(() => {
    applyFilterAndSorting();
  }, [customersCache, filter, sorting])

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
            <RequireMemberRoleForCurrentUser>
              <Button href="/customers/new" color="blue">New customer</Button>
            </RequireMemberRoleForCurrentUser>
          </div>
        </div>

        <div className='mt-8'>
          <SearchField 
            id="filter"
            name="filter"
            type="search"
            value={filter}
            placeholder="Filter by name, email or SSN..."
            disabled={isLoading}
            onChange={handleFilterChange}
            className="sm:w-96" />
        </div>
        
        <div className="mt-4 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                { 
                  error && 
                    <ErrorAlert error={error} />
                }
                
                {
                  !isLoading && customers.length === 0 ? (
                  <EmptyState 
                    message="No matching customers"
                    className="py-12 bg-gray-50" />
                  ) : (
                    <div>     
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"> 
                          <tr>
                            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-900">
                              <TableSortToggle text="Name" column="name" sorting={sorting} setSorting={setSorting} />
                            </th>
                            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-900">
                              <TableSortToggle text="Email" column="email" sorting={sorting} setSorting={setSorting} />
                            </th>
                            <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-900">
                              <TableSortToggle text="SSN" column="ssn" sorting={sorting} setSorting={setSorting} />
                            </th>
                            <RequireSupportRole profile={profile}>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-900">
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
                                  <Link to={`/customers/${customer.id}`} className="text-purple-700 hover:text-purple-500 cursor-pointer" aria-label="Edit customer">
                                    {markFilter(filter, customer.name)}
                                  </Link>
                                </Placeholder>
                              </td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                <Placeholder isLoading={isLoading}>{markFilter(filter, customer.email)}</Placeholder>
                              </td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                                <Placeholder isLoading={isLoading}>{
                                  <SecretTextIfSupportRole 
                                    profile={profile} 
                                    email={customer.email} 
                                    text={markFilter(filter, MaskIfSupportRole({ profile: profile, text: customer.ssn }))} 
                                    verifyCode={(password) => { return new Promise((resolve) => { resolve(customer.ssn); } ) }}
                                    sendCode={() => { return new Promise((resolve) => { resolve(); }) }}
                                  />
                                }</Placeholder>
                              </td>
                              <RequireSupportRole profile={profile}>
                                <td className="whitespace-nowrap py-4 px-3 text-sm font-medium text-gray-500">
                                  <Placeholder isLoading={isLoading}><UserById id={customer.owner_id} /></Placeholder>
                                </td>
                              </RequireSupportRole>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                <Placeholder isLoading={isLoading}>
                                  <Link to={`/customers/${customer.id}/edit`} className="text-purple-700 hover:text-purple-500 cursor-pointer" aria-label="Edit customer">
                                    Edit
                                  </Link>
                                </Placeholder>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>
              <Placeholder isLoading={isLoading}>
                <div className="flex justify-between py-4 text-sm text-gray-500">
                  {pluralize(customers.length, 'result', true)}
                </div>
              </Placeholder>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}