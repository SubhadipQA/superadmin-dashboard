import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Users,
  Wallet,
  BarChart3,
  //UserCircle,
  LogOut,
  ParkingCircle
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
    <div className="flex flex-col h-full w-64 bg-[#0D1B2A] text-white">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1A3048]">
        <div className="w-8 h-8 rounded-lg bg-[#1565C0] flex items-center justify-center">
          <ParkingCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-none">YPark</p>
          <p className="text-[#506A84] text-xs mt-0.5">Super Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#1565C0] text-white'
                  : 'text-[#8BA8C8] hover:bg-[#132236] hover:text-white'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — Admin Info + Logout */}
      <div className="px-3 py-4 border-t border-[#1A3048]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {admin?.name || 'Super Admin'}
            </p>
            <p className="text-[#506A84] text-xs truncate">
              {admin?.email || 'admin@ypark.in'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-[#8BA8C8] hover:bg-[#132236] hover:text-white transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

    </div>
  )
}

export default Sidebar