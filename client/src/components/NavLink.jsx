import { Link } from 'react-router-dom'

export function NavLink({ href, onClick, children }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="inline-block rounded-lg py-1 px-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  )
}
