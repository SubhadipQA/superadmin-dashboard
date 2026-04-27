import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  MapPin,
  Users,
  Activity,
  IndianRupee,
  UserPlus,
  Calendar,
} from 'lucide-react'

// ─── Mock Data ─────────────────────────────────────────────

const dailyRevenue = [
  { date: '01 Apr', upi: 12000, cash: 8000, online: 3000, subscription: 4000 },
  { date: '05 Apr', upi: 15000, cash: 9000, online: 4000, subscription: 4000 },
  { date: '10 Apr', upi: 11000, cash: 7000, online: 2000, subscription: 8000 },
  { date: '15 Apr', upi: 18000, cash: 11000, online: 5000, subscription: 4000 },
  { date: '20 Apr', upi: 22000, cash: 13000, online: 6000, subscription: 8000 },
  { date: '25 Apr', upi: 19000, cash: 10000, online: 4000, subscription: 4000 },
  { date: '30 Apr', upi: 25000, cash: 14000, online: 7000, subscription: 8000 },
]

const topZones = [
  { name: 'South City Mall', revenue: 52400 },
  { name: 'Salt Lake Sec V', revenue: 38200 },
  { name: 'Park Street Bay', revenue: 31800 },
  { name: 'New Town AA1', revenue: 28600 },
  { name: 'Howrah Station', revenue: 22100 },
]

const vehicleDistribution = [
  { name: 'Two Wheeler', value: 54, color: '#1565C0' },
  { name: 'Four Wheeler', value: 38, color: '#00BCD4' },
  { name: 'Heavy', value: 8, color: '#F57F17' },
]

const cityBreakdown = [
  {
    city: 'Kolkata',
    zones: 6,
    sessions: 1243,
    revenue: 128400,
    commission: 12840,
  },
  {
    city: 'Howrah',
    zones: 2,
    sessions: 312,
    revenue: 28600,
    commission: 2860,
  },
  {
    city: 'Salt Lake',
    zones: 3,
    sessions: 521,
    revenue: 48200,
    commission: 4820,
  },
  {
    city: 'New Town',
    zones: 2,
    sessions: 398,
    revenue: 36800,
    commission: 3680,
  },
  {
    city: 'Durgapur',
    zones: 1,
    sessions: 142,
    revenue: 12400,
    commission: 1240,
  },
]

const vendorGrowth = [
  { month: 'Nov', vendors: 2 },
  { month: 'Dec', vendors: 3 },
  { month: 'Jan', vendors: 5 },
  { month: 'Feb', vendors: 4 },
  { month: 'Mar', vendors: 7 },
  { month: 'Apr', vendors: 6 },
]

// ─── Helpers ───────────────────────────────────────────────

const DATE_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 3 Months', value: '3months' },
  { label: 'Custom', value: 'custom' },
]

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-xl p-4 border border-[#D1D5DC]">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-[#506A84] text-xs font-medium">{label}</p>
        <p className="text-[#1A2332] text-xl font-bold mt-1">{value}</p>
        {sub && (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-[#2E7D32]" />
            <p className="text-[#2E7D32] text-xs">{sub}</p>
          </div>
        )}
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
)

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D1D5DC] rounded-lg p-3 shadow-lg">
        <p className="text-[#1A2332] text-xs font-bold mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 py-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-[#506A84] text-xs capitalize">{entry.name}:</span>
            <span className="text-[#1A2332] text-xs font-semibold">
              ₹{entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D1D5DC] rounded-lg p-3 shadow-lg">
        <p className="text-[#1A2332] text-xs font-bold">{payload[0].name}</p>
        <p className="text-[#506A84] text-xs">{payload[0].value}% of parking visits</p>
      </div>
    )
  }
  return null
}

// ─── Main Page ─────────────────────────────────────────────

const PlatformAnalytics = () => {
  const [dateFilter, setDateFilter] = useState('month')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [cityFilter, setCityFilter] = useState('ALL')

  const cities = useMemo(() => {
    return ['ALL', ...cityBreakdown.map((c) => c.city)]
  }, [])

  const filteredCities = cityFilter === 'ALL'
    ? cityBreakdown
    : cityBreakdown.filter((c) => c.city === cityFilter)

  const totalRevenue = cityBreakdown.reduce((sum, c) => sum + c.revenue, 0)

  return (
    <div className="space-y-5">

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setDateFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                dateFilter === f.value
                  ? 'bg-[#1565C0] text-white'
                  : 'bg-white border border-[#D1D5DC] text-[#506A84] hover:bg-[#F0F4F8]'
              }`}
            >
              {f.label}
            </button>
          ))}

          {/* Custom Date Range — shows only when custom selected */}
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-1.5 bg-white border border-[#D1D5DC] rounded-lg px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#506A84]" />
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="text-xs text-[#1A2332] focus:outline-none bg-transparent"
                />
              </div>
              <span className="text-[#506A84] text-xs font-medium">to</span>
              <div className="flex items-center gap-1.5 bg-white border border-[#D1D5DC] rounded-lg px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#506A84]" />
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="text-xs text-[#1A2332] focus:outline-none bg-transparent"
                />
              </div>
              {customFrom && customTo && (
                <button
                  onClick={() => {
                    // When API ready → refetch with customFrom and customTo
                    console.log('Fetch data from', customFrom, 'to', customTo)
                  }}
                  className="bg-[#1565C0] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0D47A1] transition-colors"
                >
                  Apply
                </button>
              )}
            </div>
          )}
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[#D1D5DC] rounded-lg text-[#1A2332] focus:outline-none focus:border-[#1565C0] bg-white"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === 'ALL' ? 'All Cities' : city}
            </option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Revenue This Month"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          color="bg-[#1565C0]"
          sub="+18.4% from last month"
        />
        <StatCard
          label="Total Parking Visits This Month"
          value="2,616"
          icon={Activity}
          color="bg-[#00BCD4]"
          sub="+11.2% from last month"
        />
        <StatCard
          label="YPark Commission"
          value="₹25,440"
          icon={TrendingUp}
          color="bg-[#2E7D32]"
          sub="+18.4% from last month"
        />
        <StatCard
          label="Active Parking Areas"
          value="14"
          icon={MapPin}
          color="bg-[#F57F17]"
          sub="3 pending approval"
        />
        <StatCard
          label="Total Vendors"
          value="5"
          icon={Users}
          color="bg-[#7B1FA2]"
          sub="+2 this month"
        />
        <StatCard
          label="New Customers This Week"
          value="142"
          icon={UserPlus}
          color="bg-[#C0392B]"
          sub="+24 from last week"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-[#D1D5DC] p-5">
        <div className="mb-4">
          <h2 className="text-[#1A2332] font-bold text-sm">Revenue Trend</h2>
          <p className="text-[#506A84] text-xs mt-0.5">
            Daily revenue breakdown by payment method
          </p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dailyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }}
            />
            <Line
              type="monotone"
              dataKey="upi"
              stroke="#1565C0"
              strokeWidth={2}
              dot={false}
              name="UPI"
            />
            <Line
              type="monotone"
              dataKey="cash"
              stroke="#2E7D32"
              strokeWidth={2}
              dot={false}
              name="Cash"
            />
            <Line
              type="monotone"
              dataKey="online"
              stroke="#00BCD4"
              strokeWidth={2}
              dot={false}
              name="Online"
            />
            <Line
              type="monotone"
              dataKey="subscription"
              stroke="#7B1FA2"
              strokeWidth={2}
              dot={false}
              name="Monthly Pass"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3 — Bar + Pie */}
      <div className="grid grid-cols-2 gap-4">

        {/* Top Parking Areas Bar Chart */}
        <div className="bg-white rounded-xl border border-[#D1D5DC] p-5">
          <div className="mb-4">
            <h2 className="text-[#1A2332] font-bold text-sm">Top Parking Areas by Revenue</h2>
            <p className="text-[#506A84] text-xs mt-0.5">Best performing parking areas this month</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={topZones}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: '#506A84' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#506A84' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  fontSize: '11px',
                  border: '1px solid #D1D5DC',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="#1565C0" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-[#D1D5DC] p-5">
          <div className="mb-4">
            <h2 className="text-[#1A2332] font-bold text-sm">Parking Visits by Vehicle Type</h2>
            <p className="text-[#506A84] text-xs mt-0.5">Distribution across all parking areas</p>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={vehicleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {vehicleDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {vehicleDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <div>
                    <p className="text-[#1A2332] text-xs font-semibold">{item.name}</p>
                    <p className="text-[#506A84] text-xs">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 4 — City Breakdown + Vendor Growth */}
      <div className="grid grid-cols-2 gap-4">

        {/* City Wise Breakdown */}
        <div className="bg-white rounded-xl border border-[#D1D5DC]">
          <div className="px-5 py-4 border-b border-[#D1D5DC]">
            <h2 className="text-[#1A2332] font-bold text-sm">City Wise Breakdown</h2>
            <p className="text-[#506A84] text-xs mt-0.5">Revenue and parking visits per city</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#F0F4F8] border-b border-[#D1D5DC]">
                <th className="text-left px-5 py-2.5 text-[#506A84] text-xs font-semibold">City</th>
                <th className="text-left px-4 py-2.5 text-[#506A84] text-xs font-semibold">Parking Areas</th>
                <th className="text-left px-4 py-2.5 text-[#506A84] text-xs font-semibold">Parking Visits</th>
                <th className="text-left px-4 py-2.5 text-[#506A84] text-xs font-semibold">Revenue</th>
                <th className="text-left px-4 py-2.5 text-[#506A84] text-xs font-semibold">Service Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F8]">
              {filteredCities.map((city) => (
                <tr key={city.city} className="hover:bg-[#F0F4F8]/50">
                  <td className="px-5 py-3">
                    <p className="text-[#1A2332] text-xs font-semibold">{city.city}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#1A2332] text-xs">{city.zones}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#1A2332] text-xs">{city.sessions.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#1565C0] text-xs font-bold">
                      ₹{city.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#2E7D32] text-xs font-bold">
                      ₹{city.commission.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-[#F0F4F8] border-t border-[#D1D5DC]">
                <td className="px-5 py-3">
                  <p className="text-[#1A2332] text-xs font-bold">Total</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[#1A2332] text-xs font-bold">
                    {filteredCities.reduce((s, c) => s + c.zones, 0)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[#1A2332] text-xs font-bold">
                    {filteredCities.reduce((s, c) => s + c.sessions, 0).toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[#1565C0] text-xs font-bold">
                    ₹{filteredCities.reduce((s, c) => s + c.revenue, 0).toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[#2E7D32] text-xs font-bold">
                    ₹{filteredCities.reduce((s, c) => s + c.commission, 0).toLocaleString()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Vendor Growth Chart */}
        <div className="bg-white rounded-xl border border-[#D1D5DC] p-5">
          <div className="mb-4">
            <h2 className="text-[#1A2332] font-bold text-sm">New Vendor Registrations</h2>
            <p className="text-[#506A84] text-xs mt-0.5">Monthly vendor growth</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={vendorGrowth}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#506A84' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#506A84' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [value, 'New Vendors']}
                contentStyle={{
                  fontSize: '11px',
                  border: '1px solid #D1D5DC',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="vendors" fill="#1565C0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}

export default PlatformAnalytics