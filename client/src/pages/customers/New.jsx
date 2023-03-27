import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { TextField } from '../../components/Fields'
import { ErrorAlert } from '../../components/Alert'

import { createCustomer } from '../../Api'

export default function NewCustomer() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    ssn: '',
    expiration: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if( isSubmitting ) return;

    setIsSubmitting(true);
    
    let payload = Object.fromEntries(Object.entries(formValues));

    if( payload['expiration'] ) {
      payload['expiration'] = new Date(payload['expiration']).toMilliseconds();
    }

    createCustomer(payload)
      .then(
        () => {
          setIsSubmitting(false);
          navigate('/customers');
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
      <div className="mx-auto w-full max-w-2lg sm:px-4 md:w-2/3 md:max-w-md md:px-0">
        <div className="sm:flex sm:items-center">
          <header className="flex flex-row items-center space-x-6">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Create customer</h1>
          </header>
        </div>

        { 
          error && <ErrorAlert error={error} /> 
        }

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
            label="Name"
            id="name"
            name="name"
            error={error && error.errors && error.errors["name"]}
            required
            disabled={isSubmitting}
            onChange={handleValueChange}
          />
          <TextField
            label="Email address"
            id="email"
            name="email"
            type="email"
            error={error && error.errors && error.errors["email"]}
            required
            disabled={isSubmitting}
            onChange={handleValueChange}
          />
          <TextField
            label="Social security number"
            id="ssn"
            name="ssn"
            error={error && error.errors && error.errors["ssn"]}
            placeholder="e.g. 123-45-6789"
            required={false}
            disabled={isSubmitting}
            onChange={handleValueChange}
          />
          <TextField
              label="Expiration"
              id="expiration"
              name="expiration"
              type="datetime-local"
              value={ formValues.expiration }
              min={new Date().toISOString().split('.')[0].slice(0,16)}
              required={false}
              disabled={isSubmitting}
              hint="Set an expiration time to schedule removal of this customer object."
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
                Create customer <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
            <div className="mt-4 flex justify-center text-sm">
              <Link className="text-purple-700 hover:text-purple-500  font-medium cursor-pointer" to="/customers" aria-label="Back to customers">
                <span className="sr-only">Back to custoemrs</span>
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
