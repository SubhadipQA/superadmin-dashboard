import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Users,
  Wallet,
  BarChart3,
  CircleHelp,
  //UserCircle,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Parking Area',
    path: '/zones',
    icon: MapPin,
  },
  {
    label: 'Vendors',
    path: '/vendors',
    icon: Users,
  },
  {
    label: 'Payment Summary',
    path: '/settlements',
    icon: Wallet,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
  {
    label: 'Support',
    path: '/support',
    icon: CircleHelp,
  },
  // {
  //   label: 'Customers',
  //   path: '/customers',
  //   icon: UserCircle,
  // },
]

const Sidebar = () => {

  const navigate = useNavigate()
  const { admin, logout } = useAuthStore()

  return (
    <div className="flex flex-col h-full w-64 bg-ypark-black text-white">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-ypark-sidebar-border">
        <img 
          src="/ypark-admin-white.svg" 
          alt="YPark Admin" 
          className="h-7"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-ypark-deep-blue text-white shadow-lg shadow-ypark-deep-blue/30'
                  : 'text-ypark-sidebar-muted hover:bg-ypark-sidebar-hover hover:text-white'
              )
            }
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — Admin Info + Logout */}
      <div className="px-3 py-4 border-t border-ypark-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-ypark-deep-blue flex items-center justify-center text-white text-sm font-bold">
            {admin?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {admin?.name || 'Super Admin'}
            </p>
            <p className="text-ypark-sidebar-muted text-xs truncate">
              {admin?.email || 'admin@ypark.in'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-ypark-sidebar-muted hover:bg-ypark-sidebar-hover hover:text-white transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>

    </div>
  )
}

export default Sidebar