import { useContext, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { TextField } from '../../components/Fields'
import { Alert } from '../../components/Alert'
import { Loading } from '../../components/Loading'
import { getCustomer, updateCustomer } from '../../Api'

import { VaultContext } from '../../providers/VaultProvider'

export default function NewCustomer({ props }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let { customerId } = useParams();
  const [formValues, setFormValues] = useState({
    id: '',
    name: '',
    email: '',
    ssn: '',
  });
  const { isSecured } = useContext(
    VaultContext
  );

  useEffect(() => {
    setIsLoading(true);
    getCustomer(customerId)
      .then(
        (customer) => {
          setIsLoading(false);
          setFormValues({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            ssn: customer.ssn,
          });
        },
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      )
  }, [customerId, isSecured])

  const handleSubmit = (event) => {
    event.preventDefault();

    if( isSubmitting ) return;

    // TODO: Add form validation
    
    setIsSubmitting(true);
    updateCustomer({
      id: formValues.id,
      name: formValues.name,
      email: formValues.email,
      ssn: formValues.ssn,
    })
      .then(
        () => {
          setIsSubmitting(false);
          setSuccess({ message: "Successfully saved!" });
          setTimeout(() => { setSuccess(null); }, 2000);
        },
        (error) => {
          setIsSubmitting(false);
          setError(error);
        }
      )
  };

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <AppLayout>
      {
        isLoading ?
        <Loading className="py-12" text="Loading..." /> :
        <div className="mx-auto w-full max-w-2lg sm:px-4 md:w-2/3 md:max-w-md md:px-0">
          <div className="sm:flex sm:items-center">
            <header className="flex flex-row items-center space-x-6">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Edit customer</h1>
            </header>
          </div>

          { 
            error && 
              <Alert color='red' icon='exclamation' className="mt-10">
                Error: {error.message}
              </Alert> 
          }

          { 
            success && 
              <Alert color='green' icon='check' className="mt-10">
                {success.message}
              </Alert> 
          }

          {
            !error &&
              <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
                <TextField
                  label="Name"
                  id="name"
                  name="name"
                  value={formValues.name}
                  required
                  disabled={isSubmitting}
                  onChange={handleValueChange}
                />
                <TextField
                  label="Email address"
                  id="email"
                  name="email"
                  value={formValues.email}
                  type="email"
                  required
                  disabled={isSubmitting}
                  onChange={handleValueChange}
                />
                <TextField
                  label="Social security number"
                  id="ssn"
                  name="ssn"
                  value={formValues.ssn}
                  required={false}
                  disabled={isSubmitting}
                  onChange={handleValueChange}
                />
                <div>
                  <Button
                    type="submit"
                    variant="solid"
                    color="blue"
                    className="w-full"
                    isSubmitting={isSubmitting}
                  >
                    <span>
                      Save customer <span aria-hidden="true">&rarr;</span>
                    </span>
                  </Button>
                  <div className="mt-4 flex justify-center text-sm">
                    <Link className="text-blue-700 hover:text-blue-500  font-medium cursor-pointer" to="/customers" aria-label="Back to customers">
                      <span className="sr-only">Back to custoemrs</span>
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
          }
        </div>
      }
    </AppLayout>
  )
}
