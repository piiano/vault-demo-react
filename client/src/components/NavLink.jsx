import { NavLink as RouterNavLink } from 'react-router-dom'
import clsx from 'clsx'

export function NavLink({ href, onClick, children }) {
  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        clsx((isActive ? "bg-slate-100 text-slate-900" : "text-slate-700"), "inline-block rounded-lg py-1 px-2 text-sm hover:bg-slate-100 hover:text-slate-900")
      }
    >
      {children}
    </RouterNavLink>
  )
}
