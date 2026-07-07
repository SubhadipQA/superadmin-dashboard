import { ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back, here is what is happening today' },
  '/zones': { title: 'Parking Area Approval', subtitle: 'Review and approve submitted parking areas' },
  '/vendors': { title: 'Vendor Management', subtitle: 'Manage all registered vendors on the platform' },
  '/settlements': { title: 'Payment Summary', subtitle: 'Review and process pending payments' },
  '/analytics': { title: 'Platform Analytics', subtitle: 'Platform wide performance and revenue insights' },
  '/customers': { title: 'Customer Management', subtitle: 'Search and manage customer accounts' },
}

const Header = () => {
  const location = useLocation()
  const current = pageTitles[location.pathname] || { title: 'YPark Admin', subtitle: '' }

  return (
    <div className="h-16 bg-white border-b border-ypark-black/10 flex items-center justify-between px-6 shrink-0">

      {/* Left — Page Title */}
      <div>
        <h1 className="text-ypark-black font-bold text-base leading-none">
          {current.title}
        </h1>
        <p className="text-ypark-black/50 text-xs mt-1">
          {current.subtitle}
        </p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        {/* <button className="relative w-9 h-9 rounded-lg border border-ypark-black/10 flex items-center justify-center hover:bg-ypark-light-gray transition-colors">
          <Bell className="w-4 h-4 text-ypark-black/50" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button> */}

        {/* Admin Info */}
        <button className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-ypark-black/10 hover:bg-ypark-light-gray transition-colors">
          <div className="w-7 h-7 rounded-full bg-ypark-deep-blue flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <div className="text-left">
            <p className="text-ypark-black text-xs font-semibold leading-none">Super Admin</p>
            <p className="text-ypark-black/50 text-xs mt-0.5">admin@ypark.in</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-ypark-black/40" />
        </button>

      </div>
    </div>
  )
}

export default Header