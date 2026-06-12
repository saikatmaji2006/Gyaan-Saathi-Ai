import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import BookMascot from '../common/BookMascot'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link--active' : 'nav-link--inactive'}`

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
      style={{ background: 'var(--navbar-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline">
          <BookMascot pose="idle" size={36} />
          <span className="text-lg font-bold text-white tracking-tight">
            Gyan Saathi
          </span>
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/explain" className={linkClass}>Explain</NavLink>
          <NavLink to="/quiz" className={linkClass}>Quiz</NavLink>
          <NavLink to="/settings" className={linkClass}>Settings</NavLink>
        </div>
      </div>
    </motion.nav>
  )
}
