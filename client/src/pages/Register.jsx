import { Link } from 'react-router-dom'

import { AuthLayout } from '../layouts/AuthLayout'
import { Button } from '../components/Button'
import { TextField } from '../components/Fields'
import { Logo } from '../components/Logo'

export default function Register() {
  return (
    <AuthLayout>
      <div className="flex flex-col">
        <Link to="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">
            Sign up
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:underline"
            >
              Sign in
            </Link>{' '}
            to your account.
          </p>
        </div>
      </div>
      <form
        action="#"
        className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2"
      >
        <TextField
          className="col-span-full"
          label="Name"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required={false}
        />
        <TextField
          className="col-span-full"
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          className="col-span-full"
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <div className="col-span-full">
          <Button
            type="submit"
            variant="solid"
            color="blue"
            className="w-full"
          >
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
