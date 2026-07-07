import Pagination from '@/components/ui/Pagination'
import usePagination from '@/hooks/usePagination'
import { useState } from 'react'
import {
  Calendar,
  Download,
  CheckCircle,
  Banknote,
  Smartphone,
  Globe,
  Clock,
  TrendingUp,
  Wallet,
  AlertCircle,
  MapPin,
  User,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// ─── Mock Data ─────────────────────────────────────────────
// This represents what your API will return
// GET /api/admin/settlements/daily?date=2026-04-25
// Grouped by zone, calculated server side

const mockDailySettlements = [
  {
    zone_id: 1,
    zone_name: 'Salt Lake Sector V Roadside',
    owner_name: 'Rajesh Kumar',
    owner_phone: '9831012345',
    city: 'Kolkata',
    upi_amount: 3000,
    cash_amount: 2000,
    online_amount: 0,
    subscription_amount: 800,
    total_gross: 5800,
    upi_commission: 300,
    cash_commission: 200,
    total_commission: 500,
    carry_forward_amount: 150,
    vendor_payable: 2550,
    total_sessions: 100,
    subscription_users: 4,
    settlement_status: 'PENDING',
    settled_at: null,
  },
  {
    zone_id: 2,
    zone_name: 'South City Mall Basement',
    owner_name: 'Priya Ventures Pvt Ltd',
    owner_phone: '9830098300',
    city: 'Kolkata',
    upi_amount: 8000,
    cash_amount: 1000,
    online_amount: 2000,
    subscription_amount: 2400,
    total_gross: 13400,
    upi_commission: 800,
    cash_commission: 100,
    total_commission: 1340,
    carry_forward_amount: 0,
    vendor_payable: 9660,
    total_sessions: 180,
    subscription_users: 12,
    settlement_status: 'PENDING',
    settled_at: null,
  },
  {
    zone_id: 3,
    zone_name: 'Park Street Parking Bay',
    owner_name: 'Mohammed Alam',
    owner_phone: '9123456789',
    city: 'Kolkata',
    upi_amount: 1500,
    cash_amount: 800,
    online_amount: 0,
    subscription_amount: 800,
    total_gross: 3100,
    upi_commission: 150,
    cash_commission: 80,
    total_commission: 310,
    carry_forward_amount: 80,
    vendor_payable: 1190,
    total_sessions: 42,
    subscription_users: 2,
    settlement_status: 'SETTLED',
    settled_at: '25 Apr 2026, 9:15 PM',
  },
  {
    zone_id: 4,
    zone_name: 'Howrah Station Road Bay',
    owner_name: 'Amit Das',
    owner_phone: '9000011111',
    city: 'Howrah',
    upi_amount: 600,
    cash_amount: 400,
    online_amount: 0,
    subscription_amount: 0,
    total_gross: 1000,
    upi_commission: 60,
    cash_commission: 40,
    total_commission: 100,
    carry_forward_amount: 0,
    vendor_payable: 540,
    total_sessions: 20,
    subscription_users: 0,
    settlement_status: 'PENDING',
    settled_at: null,
  },
]

// ─── Summary Card ──────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-xl p-4 border border-ypark-black/10">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-ypark-text-muted text-xs font-medium">{label}</p>
        <p className="text-ypark-text text-xl font-bold mt-1">{value}</p>
        {sub && <p className="text-ypark-text-muted text-xs mt-0.5">{sub}</p>}
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
)

// ─── Amount Row ────────────────────────────────────────────
const AmountRow = ({ label, value, highlight, dimmed, icon: Icon, iconColor }) => (
  <div className={`flex items-center justify-between py-2 ${dimmed ? 'opacity-60' : ''}`}>
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`w-3.5 h-3.5 ${iconColor}`} />}
      <span className="text-ypark-text-muted text-xs">{label}</span>
    </div>
    <span className={`text-xs font-bold ${highlight || 'text-ypark-text'}`}>
      {value}
    </span>
  </div>
)

// ─── Zone Settlement Card ──────────────────────────────────
const ZoneSettlementCard = ({ zone, onSettle }) => {
  const [confirming, setConfirming] = useState(false)
  const isSettled = zone.settlement_status === 'SETTLED'
  const hasCarryForward = zone.carry_forward_amount > 0

  return (
    <div className={`bg-white rounded-xl border ${isSettled ? 'border-ypark-success/30' : 'border-ypark-black/10'} overflow-hidden`}>

      {/* Card Header */}
      <div className={`px-5 py-4 flex items-start justify-between ${isSettled ? 'bg-ypark-success/5' : 'bg-ypark-light-gray'} border-b border-ypark-black/10`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-ypark-deep-blue/10 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-ypark-deep-blue" />
          </div>
          <div>
            <h3 className="text-ypark-text font-bold text-sm">{zone.zone_name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <User className="w-3 h-3 text-ypark-text-muted" />
              <span className="text-ypark-text-muted text-xs">{zone.owner_name}</span>
              <span className="text-ypark-text-muted text-xs">·</span>
              <span className="text-ypark-text-muted text-xs">{zone.city}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-ypark-text-muted text-xs">{zone.total_sessions} parking visits</span>
              {zone.subscription_users > 0 && (
                <span className="text-purple-600 text-xs">{zone.subscription_users} pass holders</span>
              )}
            </div>
          </div>
        </div>
        {isSettled ? (
          <div className="flex flex-col items-end gap-1">
            <span className="bg-ypark-success/10 text-ypark-success border border-ypark-success/20 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Settled
            </span>
            <span className="text-ypark-text-muted text-xs">{zone.settled_at}</span>
          </div>
        ) : (
          <span className="bg-ypark-warning/10 text-ypark-warning border border-ypark-warning/20 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-x-8">

          {/* Left — Collections */}
          <div>
            <p className="text-ypark-text font-bold text-xs uppercase tracking-wide mb-2">
              Collections
            </p>
            <div className="divide-y divide-ypark-light-gray">
              <AmountRow
                label="UPI Collected"
                value={`₹${zone.upi_amount.toLocaleString()}`}
                icon={Smartphone}
                iconColor="text-ypark-deep-blue"
              />
              <AmountRow
                label="Cash Collected"
                value={`₹${zone.cash_amount.toLocaleString()}`}
                icon={Banknote}
                iconColor="text-ypark-success"
              />
              {zone.online_amount > 0 && (
                <AmountRow
                  label="Online Collected"
                  value={`₹${zone.online_amount.toLocaleString()}`}
                  icon={Globe}
                  iconColor="text-ypark-info"
                />
              )}
              {zone.subscription_amount > 0 && (
                <AmountRow
                  label="Monthly Pass"
                  value={`₹${zone.subscription_amount.toLocaleString()}`}
                  icon={Calendar}
                  iconColor="text-purple-600"
                />
              )}
              <div className="flex items-center justify-between py-2 mt-1">
                <span className="text-ypark-text text-xs font-bold">Total Gross</span>
                <span className="text-ypark-text text-sm font-bold">
                  ₹{zone.total_gross.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Payment Summary Breakdown */}
          <div>
            <p className="text-ypark-text font-bold text-xs uppercase tracking-wide mb-2">
              Payment Summary
            </p>
            <div className="divide-y divide-ypark-light-gray">
              <AmountRow
                label="UPI Service Charge (yours)"
                value={`- ₹${zone.upi_commission.toLocaleString()}`}
                highlight="text-ypark-danger"
              />
              <AmountRow
                label="Cash Service Charge"
                value={`₹${zone.cash_commission.toLocaleString()}`}
                highlight="text-ypark-warning"
              />
              <AmountRow
                label="Cash Service Charge Status"
                value="Carry Forward →"
                highlight="text-ypark-warning"
                dimmed
              />
              {hasCarryForward && (
                <AmountRow
                  label="Yesterday Carry Forward"
                  value={`- ₹${zone.carry_forward_amount.toLocaleString()}`}
                  highlight="text-ypark-danger"
                />
              )}
            </div>

            {/* Final Payable */}
            <div className="mt-3 bg-ypark-deep-blue/5 border border-ypark-deep-blue/20 rounded-lg px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-ypark-deep-blue text-xs font-bold">Transfer To Vendor</span>
                <span className="text-ypark-deep-blue text-base font-bold">
                  ₹{zone.vendor_payable.toLocaleString()}
                </span>
              </div>
              <p className="text-ypark-text-muted text-xs mt-0.5">
                UPI + Online minus service charge
                {hasCarryForward && ` and ₹${zone.carry_forward_amount} carry forward`}
              </p>
            </div>

            {/* Cash Note */}
            <div className="mt-2 bg-ypark-warning/5 border border-ypark-warning/20 rounded-lg px-3 py-2">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-ypark-warning shrink-0 mt-0.5" />
                <p className="text-ypark-warning text-xs">
                  ₹{zone.cash_commission.toLocaleString()} cash service charge will carry forward to tomorrow's payment summary
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer — Action */}
      {!isSettled && (
        <div className="px-5 py-4 border-t border-ypark-black/10 bg-white">
          {!confirming ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ypark-text-muted text-xs">
                  Transfer <span className="text-ypark-deep-blue font-bold">₹{zone.vendor_payable.toLocaleString()}</span> to {zone.owner_name} then mark settled
                </p>
                <p className="text-ypark-text-muted text-xs mt-0.5">
                  Phone: {zone.owner_phone}
                </p>
              </div>
              <button
                onClick={() => setConfirming(true)}
                className="flex items-center gap-2 bg-ypark-success hover:bg-ypark-success/90 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shrink-0"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark as Settled
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-ypark-text text-xs font-semibold">
                Confirm ₹{zone.vendor_payable.toLocaleString()} transferred to {zone.owner_name}?
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSettle(zone.zone_id)}
                  className="bg-ypark-success hover:bg-ypark-success/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Yes, Confirmed
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="bg-ypark-light-gray hover:bg-ypark-black/10 text-ypark-text-muted text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
const ManualSettlement = () => {
  const [settlements, setSettlements] = useState(mockDailySettlements)
  const [selectedDate, setSelectedDate] = useState('2026-04-25')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // ── Calculations ──
  const pending = settlements.filter((s) => s.settlement_status === 'PENDING')
  const totalPendingAmount = pending.reduce((sum, s) => sum + s.vendor_payable, 0)
  const totalCommissionToday = settlements.reduce((sum, s) => sum + s.total_commission, 0)
  const totalGrossToday = settlements.reduce((sum, s) => sum + s.total_gross, 0)
  const totalSessionsToday = settlements.reduce((sum, s) => sum + s.total_sessions, 0)

  // ── Filter ──
  const filtered = settlements.filter((s) => {
    return statusFilter === 'ALL' || s.settlement_status === statusFilter
  })

  // ── Pagination ──
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData,
    setCurrentPage,
    resetPage,
  } = usePagination(filtered, 5)

  // ── Settle Handler ──
  // When API is ready replace this with:
  // POST /api/admin/settlements/settle-zone
  const handleSettle = (zoneId) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.zone_id === zoneId
          ? {
              ...s,
              settlement_status: 'SETTLED',
              settled_at: new Date().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : s
      )
    )
  }

  // ── Excel Export ──
  const handleExport = () => {
    const toExport = filtered.map((s) => ({
      Zone: s.zone_name,
      Owner: s.owner_name,
      Phone: s.owner_phone,
      City: s.city,
      'UPI Collected': s.upi_amount,
      'Cash Collected': s.cash_amount,
      'Online Collected': s.online_amount,
      'Monthly Pass': s.subscription_amount,
      'Total Gross': s.total_gross,
      'UPI Service Charge': s.upi_commission,
      'Cash Service Charge (Carry Forward)': s.cash_commission,
      'Yesterday Carry Forward Deducted': s.carry_forward_amount,
      'Vendor Payable': s.vendor_payable,
      'Total Parking Visits': s.total_sessions,
      'Monthly Pass Users': s.subscription_users,
      Status: s.settlement_status,
      'Settled At': s.settled_at || '—',
    }))
    const ws = XLSX.utils.json_to_sheet(toExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Payment Summary')
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `ypark_payment_summary_${selectedDate}.xlsx`
    )
  }

  return (
    <div className="space-y-5">

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); resetPage() }}
            className="px-3 py-2 text-sm border border-ypark-black/10 rounded-lg text-ypark-text focus:outline-none focus:border-ypark-deep-blue bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); resetPage() }}
            className="px-3 py-2 text-sm border border-ypark-black/10 rounded-lg text-ypark-text focus:outline-none focus:border-ypark-deep-blue bg-white"
          >
            <option value="ALL">All Parking Areas</option>
            <option value="PENDING">Pending Only</option>
            <option value="SETTLED">Settled Only</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-ypark-deep-blue hover:bg-ypark-deep-blue/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <SummaryCard
          label="Total Gross Today"
          value={`₹${totalGrossToday.toLocaleString()}`}
          icon={Wallet}
          color="bg-ypark-deep-blue"
          sub={`${totalSessionsToday} total parking visits`}
        />
        <SummaryCard
          label="YPark Commission"
          value={`₹${totalCommissionToday.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-ypark-success"
          sub="YPark earnings today"
        />
        <SummaryCard
          label="Pending Transfer"
          value={`₹${totalPendingAmount.toLocaleString()}`}
          icon={Clock}
          color="bg-ypark-warning"
          sub={`${pending.length} parking areas pending`}
        />
        <SummaryCard
          label="Parking Areas Settled"
          value={`${settlements.filter((s) => s.settlement_status === 'SETTLED').length} / ${settlements.length}`}
          icon={CheckCircle}
          color="bg-ypark-info"
          sub="Completed today"
        />
      </div>

      {/* Zone Cards */}
      <div className="space-y-4">
        {paginatedData.map((zone) => (
          <ZoneSettlementCard
            key={zone.zone_id}
            zone={zone}
            onSettle={handleSettle}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl border border-ypark-black/10 px-5 py-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

    </div>
  )
}

export default ManualSettlement