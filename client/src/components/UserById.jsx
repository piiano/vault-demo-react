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
        {user ? 
          <span className="flex items-center">
            { user?.avatar && <img src={user.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full mr-3" /> }
            <span className="block truncate">
                <span>{user?.name}</span>
            </span>
          </span>
          :
          <span>-</span>
        }
    </span>
  )
}