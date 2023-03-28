import clsx from 'clsx';
import { useState } from 'react';
import { TextField } from './Fields';
import Modal from './Modal';

export function SecretText({
  className, 
  email, 
  revealButtonText = 'Reveal',
  verifyCode,
  sendCode,
  format, 
  ...props
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [secretText, setSecretText] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  function handleConfirm() {
    setIsSubmitting(true);
    // TODO: Call an API to verify the code
    verifyCode(password)
      .then((secretText) => {
        setPassword('');
        setSecretText(secretText);
        setIsDialogOpen(false);
        setIsSubmitting(false);
      })
      .catch(error => {
        // Code doesn't match, show error message
        setError("Invalid code. Please try again.");
        setIsSubmitting(false);
      });
  }

  function handleReveal() {
    setIsSubmitting(true);
    sendCode()
      .then(() => {
        setPassword('');
        setSecretText('');
        setIsDialogOpen(true);
        setIsSubmitting(false);
      })
      .catch(error => {
        // Code doesn't match, show error message
        setError("Invalid code. Please try again.");
        setIsSubmitting(false);
      });
    setIsSubmitting(false);
  }

  return (
    <div className={clsx(className, 'relative')} {...props}>
      {
        secretText ? (
          <p className="relative flex">{secretText}</p>
          ) : 
          <>
            <p className="relative text-center flex justify-center-center blur blur-sm opacity-75">{format}</p>
            <div className="absolute w-32 top-0 mx-auto top-0 flex justify-center">
              <button 
                className="rounded bg-white py-1 px-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={handleReveal}>{revealButtonText}</button>
            </div>
          </>
      }
      <Modal 
        open={isDialogOpen} 
        setOpen={setIsDialogOpen} 
        title="Confirm verification code"
        confirmButtonText="Continue"
        onConfirmationButtonClick={handleConfirm} 
        icon="shield-check"
        color="orange"
        isSubmitting={isSubmitting} >
        
        <p className="mt-4 text-sm text-gray-600">
          We sent an email to <b>{email}</b> with a one-time verification code.

          To access this data, please enter the verification code below.
        </p>

        <div className="mt-6">
          <TextField
            id="verification-code"
            name="verification-code"
            type="text"
            className='w-full'
            inputClassName='text-md sm:text-md tracking-widest text-center'
            placeholder='XXXXXX'
            value={ password }
            disabled={isSubmitting}
            error={error}
            onChange={handlePasswordChange}
          />
        </div>
      </Modal>
    </div>
  )
}
