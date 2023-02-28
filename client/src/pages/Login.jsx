import { Link } from 'react-router-dom'

import { useContext, useState, useEffect} from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { Button } from '../components/Button'
import { TextField } from '../components/Fields'
import { Logo } from '../components/Logo'
import { LoginContext } from '../providers/LoginProvider'
import SelectMenu from '../components/SelectMenu'

export default function Login() {
  const { isLoadingUsers, switchUser, handleLoginClick, users, profile } = useContext(
    LoginContext
  );
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if( profile ) {
      let user = users.find(u => u.id === profile.id)
      setSelectedUser(user);
    } else {
      setSelectedUser(users[0]);
    }
  }, [users])

  useEffect(() => {
    // When selected user changes, create token for that user
    if( selectedUser ) {
      switchUser(selectedUser)
    }
  }, [selectedUser])
 
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
            Choose an account to impersonate from the following list:
          </p>
        </div>
      </div>
      <form onSubmit={handleLoginClick} className="mt-10 grid grid-cols-1 gap-y-8">
        <SelectMenu
          isLoading={ isLoadingUsers }
                selected={selectedUser}
                setSelected={setSelectedUser} 
                items={users}
                by="id"
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
