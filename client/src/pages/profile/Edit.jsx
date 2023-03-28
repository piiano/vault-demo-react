import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { Button } from '../../components/Button'
import { TextField } from '../../components/Fields'
import { Alert } from '../../components/Alert'
import { Loading } from '../../components/Loading'
import { updateProfile } from '../../Api'

import { LoginContext } from '../../providers/LoginProvider'

export default function EditProfile({ props }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    id: '',
    name: '',
    avatar: '',
    email: ''
  });
  const { refresh, profile, isLoadingProfile } = useContext(
    LoginContext
  );

  useEffect(() => {
    if( !profile ) return;
    setFormValues({
      id: profile.id,
      avatar: profile.avatar,
      name: profile.name,
      email: profile.email,
    });
  }, [profile]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if( isSubmitting ) return;

    // TODO: Add form validation
    
    setIsSubmitting(true);
    updateProfile({
      id: formValues.id,
      name: formValues.name,
      email: formValues.email,
    })
      .then(
        () => {
          setIsSubmitting(false);
          setSuccess({ message: "Successfully saved!" });
          setTimeout(() => { setSuccess(null); }, 2000);
          refresh();
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
        isLoadingProfile ?
        <Loading className="py-12" text="Loading..." /> :
        <div className="mx-auto w-full max-w-2lg sm:px-4 md:w-2/3 md:max-w-md md:px-0">
          <div className="sm:flex sm:items-center">
            <header className="flex flex-row items-center space-x-6">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">Edit your profile</h1>
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
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src={formValues.avatar} alt="" />
                  </div>
                </div>
                <TextField
                  label="Name"
                  id="name"
                  name="name"
                  value={formValues.name}
                  required={false}
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
                <div>
                  <Button
                    type="submit"
                    variant="solid"
                    color="blue"
                    className="w-full"
                    isSubmitting={isSubmitting}
                  >
                    <span>
                      Save profile <span aria-hidden="true">&rarr;</span>
                    </span>
                  </Button>
                  <div className="mt-4 flex justify-center text-sm">
                    <Button variant="link" color="blue" href="/customers" onClick={handleCancelButtonClick} aria-label="Back to customers">
                      <span className="sr-only">Back</span>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
          }
        </div>
      }
    </AppLayout>
  )
}
