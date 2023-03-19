import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthLayout } from '../layouts/AuthLayout'
import { Button } from '../components/Button'
import { TextField } from '../components/Fields'
import { Logo } from '../components/Logo'
import { LoginContext } from '../providers/LoginProvider'

export default function Login() {
  const { handleLoginClick } = useContext(
    LoginContext
  );
 
  return (
    <AuthLayout>
      <div className="flex flex-col">
        <Link to="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-purple-600 hover:underline"
            >
              Sign up
            </Link>{' '}
            for a free trial.
          </p>
        </div>
      </div>
      <form onSubmit={handleLoginClick} className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <div>
          <Button
            type="submit"
            variant="solid"
            color="blue"
            className="w-full"
          >
            <span>
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
