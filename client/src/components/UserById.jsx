import { useContext, useState, useEffect } from 'react'
import { LoginContext } from '../providers/LoginProvider'
import clsx from 'clsx'

export function UserById({ className, id, ...props }) {
  const [user, setUser] = useState(null)

  const { users } = useContext(
    LoginContext
  );

  useEffect(() => {
    setUser(users.find(u => u.id === id));
  }, [users])

  return (
    <span className={clsx(user ? '' : 'text-gray-500', className)} 
      {...props}>
        {user ? user.name : '-'}
    </span>
  )
}