import {
  MapPin,
  Users,
  Activity,
  IndianRupee,
  TrendingUp,
  Clock,
} from 'lucide-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Mock Data ───────────────────────────────────────────
const stats = [
  {
    label: 'Revenue This Month',
    value: '₹4,28,500',
    change: '+12.5% from last month',
    positive: true,
    icon: IndianRupee,
    color: 'bg-[#1565C0]',
  },
  {
    label: 'Active Parking Areas',
    value: '38',
    change: '+3 approved this week',
    positive: true,
    icon: MapPin,
    color: 'bg-[#2E7D32]',
  },
  {
    label: 'Parking Visits Today',
    value: '1,243',
    change: '+8.2% from yesterday',
    positive: true,
    icon: Activity,
    color: 'bg-[#00BCD4]',
  },
  {
    label: 'New Vendors',
    value: '7',
    change: 'Registered this week',
    positive: true,
    icon: Users,
    color: 'bg-[#F57F17]',
  },
]

const recentZones = [
  {
    id: 1,
    name: 'Salt Lake Sector V Roadside',
    owner: 'Rajesh Kumar',
    city: 'Kolkata',
    zone_type: 'ON_ROAD',
    has_marked_slots: false,
    submitted: '25 Apr 2026',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 2,
    name: 'South City Mall Basement',
    owner: 'Priya Ventures Pvt Ltd',
    city: 'Kolkata',
    zone_type: 'OFF_ROAD',
    has_marked_slots: true,
    submitted: '24 Apr 2026',
    status: 'PENDING_APPROVAL',
  },
  {
    id: 3,
    name: 'Park Street Parking Bay',
    owner: 'Mohammed Alam',
    city: 'Kolkata',
    zone_type: 'OFF_ROAD',
    has_marked_slots: false,
    submitted: '23 Apr 2026',
    status: 'APPROVED',
  },
  {
    id: 4,
    name: 'New Town Action Area 1',
    owner: 'Sneha Properties',
    city: 'Kolkata',
    zone_type: 'OFF_ROAD',
    has_marked_slots: true,
    submitted: '22 Apr 2026',
    status: 'REJECTED',
  },
]

const topZones = [
  { name: 'South City Mall Basement', city: 'Kolkata', revenue: '₹52,400', sessions: 312 },
  { name: 'Salt Lake Sector V', city: 'Kolkata', revenue: '₹38,200', sessions: 287 },
  { name: 'Park Street Bay', city: 'Kolkata', revenue: '₹31,800', sessions: 241 },
  { name: 'New Town AA1', city: 'Kolkata', revenue: '₹28,600', sessions: 198 },
  { name: 'Howrah Station Road', city: 'Howrah', revenue: '₹22,100', sessions: 176 },
]

const last7DaysRevenue = [
  { date: '20 Apr', upi: 8000, cash: 5000, online: 2000, subscription: 1600 },
  { date: '21 Apr', upi: 9500, cash: 4500, online: 1500, subscription: 800 },
  { date: '22 Apr', upi: 7200, cash: 6000, online: 3000, subscription: 1600 },
  { date: '23 Apr', upi: 11000, cash: 5500, online: 2500, subscription: 800 },
  { date: '24 Apr', upi: 9800, cash: 4800, online: 1800, subscription: 1600 },
  { date: '25 Apr', upi: 13000, cash: 7000, online: 3500, subscription: 800 },
  { date: '26 Apr', upi: 10500, cash: 5200, online: 2200, subscription: 1600 },
]

// ─── Helpers ─────────────────────────────────────────────
const statusConfig = {
  PENDING_APPROVAL: {
    label: 'Pending',
    className: 'bg-[#F57F17]/10 text-[#F57F17] border border-[#F57F17]/20',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20',
  },
}

const getZoneTypeBadge = (zone_type, has_marked_slots) => {
  if (zone_type === 'ON_ROAD') {
    return {
      label: 'Govt. Authorized',
      className: 'bg-[#1565C0]/10 text-[#1565C0] border border-[#1565C0]/20',
    }
  }
  if (zone_type === 'OFF_ROAD' && !has_marked_slots) {
    return {
      label: 'Private · No Parking Spaces',
      className: 'bg-[#F57F17]/10 text-[#F57F17] border border-[#F57F17]/20',
    }
  }
  return {
    label: 'Private · With Parking Spaces',
    className: 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20',
  }
}

// ─── Components ───────────────────────────────────────────
const StatCard = ({ label, value, change, positive, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-5 border border-[#D1D5DC] flex items-start gap-4">
    <div className={`${color} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[#506A84] text-xs font-medium">{label}</p>
      <p className="text-[#1A2332] text-2xl font-bold mt-0.5">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <TrendingUp className={`w-3 h-3 ${positive ? 'text-[#2E7D32]' : 'text-[#C0392B]'}`} />
        <p className={`text-xs ${positive ? 'text-[#2E7D32]' : 'text-[#C0392B]'}`}>{change}</p>
      </div>
    </div>
  </div>
)

// ─── Page ─────────────────────────────────────────────────
const DashboardHome = () => {
  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Revenue Last 7 Days */}
      <div className="bg-white rounded-xl border border-[#D1D5DC] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[#1A2332] font-bold text-sm">Revenue — Last 7 Days</h2>
            <p className="text-[#506A84] text-xs mt-0.5">
              Daily breakdown by payment method
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: 'UPI', color: '#1565C0' },
              { label: 'Cash', color: '#2E7D32' },
              { label: 'Online', color: '#00BCD4' },
              { label: 'Monthly Pass', color: '#7B1FA2' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: item.color }}
                />
                <span className="text-[#506A84] text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={last7DaysRevenue}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F0F4F8"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#506A84' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#506A84' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                fontSize: '11px',
                border: '1px solid #D1D5DC',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value, name) => [
                `₹${value.toLocaleString()}`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Bar
              dataKey="upi"
              stackId="a"
              fill="#1565C0"
              name="UPI"
            />
            <Bar
              dataKey="cash"
              stackId="a"
              fill="#2E7D32"
              name="Cash"
            />
            <Bar
              dataKey="online"
              stackId="a"
              fill="#00BCD4"
              name="Online"
            />
            <Bar
              dataKey="subscription"
              stackId="a"
              fill="#7B1FA2"
                name="Monthly Pass"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">

        {/* Recent Parking Area Submissions */}
        <div className="col-span-2 bg-white rounded-xl border border-[#D1D5DC]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#D1D5DC]">
            <div>
              <h2 className="text-[#1A2332] font-bold text-sm">Recent Parking Area Submissions</h2>
              <p className="text-[#506A84] text-xs mt-0.5">Latest parking areas waiting for your review</p>
            </div>
            <button className="text-[#1565C0] text-xs font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-[#D1D5DC]">
            {recentZones.map((zone) => {
              const status = statusConfig[zone.status]
              return (
                <div key={zone.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F4F8] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#1565C0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1A2332] text-sm font-semibold truncate">{zone.name}</p>
                    <p className="text-[#506A84] text-xs">{zone.owner} · {zone.city}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getZoneTypeBadge(zone.zone_type, zone.has_marked_slots).className}`}>
                    {getZoneTypeBadge(zone.zone_type, zone.has_marked_slots).label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>
                    {status.label}
                  </span>
                  <div className="flex items-center gap-1 text-[#506A84]">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{zone.submitted}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Performing Parking Areas */}
        <div className="bg-white rounded-xl border border-[#D1D5DC]">
          <div className="px-5 py-4 border-b border-[#D1D5DC]">
            <h2 className="text-[#1A2332] font-bold text-sm">Top Performing Parking Areas</h2>
            <p className="text-[#506A84] text-xs mt-0.5">By revenue this month</p>
          </div>
          <div className="divide-y divide-[#D1D5DC]">
            {topZones.map((zone, index) => (
              <div key={zone.name} className="px-5 py-3.5 flex items-center gap-3">
                <span className="text-[#506A84] text-xs font-bold w-4 shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1A2332] text-xs font-semibold truncate">{zone.name}</p>
                  <p className="text-[#506A84] text-xs">{zone.city} · {zone.sessions} parking visits</p>
                </div>
                <p className="text-[#1565C0] text-xs font-bold shrink-0">{zone.revenue}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardHome