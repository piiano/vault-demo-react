import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { TextField } from '../../components/Fields'
import { Alert, ErrorAlert } from '../../components/Alert'
import { Loading } from '../../components/Loading'
import { getCustomer, updateCustomer } from '../../Api'

import { VaultContext } from '../../providers/VaultProvider'
import { LoginContext, MaskIfSupportRole } from '../../providers/LoginProvider'
import { isoDateStrFromEpoch, epochFromIsoDateTimeStr, isoDateStrFromCurrentTime } from '../../lib/utils'

export default function NewCustomer({ props }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let { customerId } = useParams();
  const [dirty, setDirty] = useState({
    name: false,
    email: false,
    ssn: false,
    expiration: true,
  });
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    ssn: '',
    expiration: null,
  });
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
          setFormValues({
            name: customer.name,
            email: customer.email,
            ssn: MaskIfSupportRole({ profile, text: customer.ssn }),
            expiration: isoDateStrFromEpoch(customer.expiration, null)
          });
        },
        (error) => {
          setIsLoading(false);
          setError(error);
        }
      )
  }, [customerId, isSecured, profile])

  const handleSubmit = (event) => {
    event.preventDefault();

    if( isSubmitting ) return;

    // TODO: Add form validation
    
    setIsSubmitting(true);
    
    // Only pick dirty fields
    let payload = Object.fromEntries(Object.entries(formValues).filter(([key]) => dirty[key] ));

    // Set expiration to epoch seconds or null if empty
    payload['expiration'] = epochFromIsoDateTimeStr(payload['expiration'], null);

    updateCustomer(customerId, payload)
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
    setDirty({ ...dirty, [name]: true });
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCancelButtonClick = (event) => {
    try {
      navigate.goBack();
    } catch (error) {
      return;  
    }
    event.preventDefault();
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
            error && <ErrorAlert error={error} /> 
          }

          { 
            success && 
              <Alert color='green' icon='check' className="mt-10">
                {success.message}
              </Alert> 
          }

          <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
            <TextField
              label="Name"
              id="name"
              name="name"
              value={formValues.name}
              required
              disabled={isSubmitting}
              error={error && error.errors && error.errors["name"]}
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
              error={error && error.errors && error.errors["email"]}
              onChange={handleValueChange}
            />
            <TextField
              label="Social security number"
              id="ssn"
              name="ssn"
              value={ formValues.ssn }
              placeholder="e.g. 123-45-6789"
              required={false}
              disabled={isSubmitting}
              error={error && error.errors && error.errors["ssn"]}
              onChange={handleValueChange}
            />
            <TextField
              label="Expiration"
              id="expiration"
              name="expiration"
              type="datetime-local"
              error={error && error.errors && error.errors["expiration"]}
              value={ formValues.expiration }
              min={ isoDateStrFromCurrentTime() }
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
                  Save customer <span aria-hidden="true">&rarr;</span>
                </span>
              </Button>
              <div className="mt-4 flex justify-center text-sm">
                <Button variant="link" color="blue" href="/customers" onClick={handleCancelButtonClick} aria-label="Back to customers">
                  <span className="sr-only">Back to custoemrs</span>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      }
    </AppLayout>
  )
}
