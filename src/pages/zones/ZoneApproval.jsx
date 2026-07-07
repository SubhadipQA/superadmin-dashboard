import Pagination from '@/components/ui/Pagination'
import usePagination from '@/hooks/usePagination'
import { useState } from 'react'
import {
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Navigation,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────
const mockZones = [
  {
    id: 1,
    name: 'Salt Lake Sector V Roadside',
    owner: 'Rajesh Kumar',
    owner_phone: '9831012345',
    owner_email: 'rajesh@example.com',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'Sector V, Salt Lake, Kolkata - 700091',
    zone_type: 'ON_ROAD',
    has_marked_slots: false,
    total_slots: 0,
    payment_required: true,
    booking_enabled: false,
    subscription_enabled: true,
    default_hourly_rate: 20,
    submitted: '25 Apr 2026',
    status: 'PENDING_APPROVAL',
    documents: ['Parking Area License', 'Owner ID Proof'],
  },
  {
    id: 2,
    name: 'South City Mall Basement',
    owner: 'Priya Ventures Pvt Ltd',
    owner_phone: '9830098300',
    owner_email: 'priya@southcity.com',
    city: 'Kolkata',
    state: 'West Bengal',
    address: '375 Prince Anwar Shah Rd, Kolkata - 700068',
    zone_type: 'OFF_ROAD',
    has_marked_slots: true,
    total_slots: 120,
    payment_required: true,
    booking_enabled: true,
    subscription_enabled: true,
    default_hourly_rate: 40,
    submitted: '24 Apr 2026',
    status: 'PENDING_APPROVAL',
    documents: ['Parking Area License', 'Building NOC', 'Owner ID Proof'],
  },
  {
    id: 3,
    name: 'Park Street Parking Bay',
    owner: 'Mohammed Alam',
    owner_phone: '9123456789',
    owner_email: 'alam@example.com',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'Park Street, Kolkata - 700016',
    zone_type: 'OFF_ROAD',
    has_marked_slots: false,
    total_slots: 30,
    payment_required: true,
    booking_enabled: false,
    subscription_enabled: false,
    default_hourly_rate: 30,
    submitted: '23 Apr 2026',
    status: 'APPROVED',
    documents: ['Parking Area License', 'Owner ID Proof'],
  },
  {
    id: 4,
    name: 'New Town Action Area 1',
    owner: 'Sneha Properties',
    owner_phone: '9876543210',
    owner_email: 'sneha@properties.com',
    city: 'Kolkata',
    state: 'West Bengal',
    address: 'Action Area 1, New Town, Kolkata - 700156',
    zone_type: 'OFF_ROAD',
    has_marked_slots: true,
    total_slots: 60,
    payment_required: true,
    booking_enabled: true,
    subscription_enabled: true,
    default_hourly_rate: 35,
    submitted: '22 Apr 2026',
    status: 'REJECTED',
    rejection_reason: 'Documents incomplete. Building NOC missing.',
    documents: ['Parking Area License'],
  },
  {
    id: 5,
    name: 'Howrah Station Road Bay',
    owner: 'Amit Das',
    owner_phone: '9000011111',
    owner_email: 'amit@example.com',
    city: 'Howrah',
    state: 'West Bengal',
    address: 'Station Road, Howrah - 711101',
    zone_type: 'ON_ROAD',
    has_marked_slots: false,
    total_slots: 0,
    payment_required: true,
    booking_enabled: false,
    subscription_enabled: false,
    default_hourly_rate: 15,
    submitted: '21 Apr 2026',
    status: 'PENDING_APPROVAL',
    documents: ['Parking Area License', 'Owner ID Proof'],
  },
]

// ─── Helpers ──────────────────────────────────────────────
const getZoneTypeBadge = (zone_type, has_marked_slots) => {
  if (zone_type === 'ON_ROAD') {
    return {
      label: 'Govt. Authorized',
      className: 'bg-ypark-deep-blue/10 text-ypark-deep-blue border border-ypark-deep-blue/20',
    }
  }
  if (!has_marked_slots) {
    return {
      label: 'Private · No Parking Spaces',
      className: 'bg-ypark-warning/10 text-ypark-warning border border-ypark-warning/20',
    }
  }
  return {
    label: 'Private · With Parking Spaces',
    className: 'bg-ypark-success/10 text-ypark-success border border-ypark-success/20',
  }
}

const statusConfig = {
  PENDING_APPROVAL: {
    label: 'Pending',
    className: 'bg-ypark-warning/10 text-ypark-warning border border-ypark-warning/20',
    icon: Clock,
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-ypark-success/10 text-ypark-success border border-ypark-success/20',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-ypark-danger/10 text-ypark-danger border border-ypark-danger/20',
    icon: XCircle,
  },
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-2.5 border-b border-ypark-light-gray last:border-0">
    <span className="text-ypark-text-muted text-xs font-medium w-36 shrink-0">{label}</span>
    <span className="text-ypark-text text-xs font-semibold text-right">{value}</span>
  </div>
)

const Flag = ({ label, enabled }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-ypark-text-muted text-xs">{label}</span>
    <span className={`text-xs font-bold ${enabled ? 'text-ypark-success' : 'text-ypark-danger'}`}>
      {enabled ? 'Yes' : 'No'}
    </span>
  </div>
)

// ─── Detail Panel ─────────────────────────────────────────
const ZoneDetailPanel = ({ zone, onClose, onApprove, onReject }) => {
  const [rejectMode, setRejectMode] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const typeBadge = getZoneTypeBadge(zone.zone_type, zone.has_marked_slots)
  const status = statusConfig[zone.status]
  //const StatusIcon = status.icon

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-[460px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ypark-black/10 bg-ypark-light-gray">
          <div>
            <h2 className="text-ypark-text font-bold text-sm">Parking Area Details</h2>
            <p className="text-ypark-text-muted text-xs mt-0.5">Review before approving or rejecting</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-ypark-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-ypark-text-muted" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Zone Name + Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-ypark-deep-blue/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-ypark-deep-blue" />
              </div>
              <div>
                <h3 className="text-ypark-text font-bold text-sm leading-snug">{zone.name}</h3>
                <p className="text-ypark-text-muted text-xs mt-0.5">{zone.address}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border shrink-0 ${status.className}`}>
              {status.label}
            </span>
          </div>

          {/* Type + Submitted */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeBadge.className}`}>
              {typeBadge.label}
            </span>
            <div className="flex items-center gap-1 text-ypark-text-muted">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Submitted {zone.submitted}</span>
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-ypark-light-gray rounded-lg p-4">
            <p className="text-ypark-text font-bold text-xs mb-2 uppercase tracking-wide">Owner Details</p>
            <InfoRow label="Name" value={zone.owner} />
            <InfoRow label="Phone" value={zone.owner_phone} />
            <InfoRow label="Email" value={zone.owner_email} />
          </div>

          {/* Zone Info */}
          <div className="bg-ypark-light-gray rounded-lg p-4">
            <p className="text-ypark-text font-bold text-xs mb-2 uppercase tracking-wide">Parking Area Information</p>
            <InfoRow label="City" value={zone.city} />
            <InfoRow label="State" value={zone.state} />
            <InfoRow label="Total Parking Spaces" value={zone.total_slots > 0 ? zone.total_slots : 'Open Parking'} />
            <InfoRow label="Hourly Rate" value={`₹${zone.default_hourly_rate}/hr`} />
          </div>

          {/* Feature Flags */}
          <div className="bg-ypark-light-gray rounded-lg p-4">
            <p className="text-ypark-text font-bold text-xs mb-2 uppercase tracking-wide">Features Enabled</p>
            <Flag label="Advance Booking" enabled={zone.booking_enabled} />
            <Flag label="Monthly Pass" enabled={zone.subscription_enabled} />
            <Flag label="Payment Required" enabled={zone.payment_required} />
            <Flag label="Marked Parking Spaces" enabled={zone.has_marked_slots} />
          </div>

          {/* Documents */}
          <div className="bg-ypark-light-gray rounded-lg p-4">
            <p className="text-ypark-text font-bold text-xs mb-3 uppercase tracking-wide">Documents</p>
            <div className="space-y-2">
              {zone.documents.map((doc) => (
                <button
                  key={doc}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-ypark-black/10 hover:border-ypark-deep-blue transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-ypark-deep-blue/10 flex items-center justify-center">
                      <Eye className="w-3 h-3 text-ypark-deep-blue" />
                    </div>
                    <span className="text-ypark-text text-xs font-medium">{doc}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-ypark-text-muted group-hover:text-ypark-deep-blue" />
                </button>
              ))}
            </div>
          </div>

          {/* Rejection Reason if rejected */}
          {zone.status === 'REJECTED' && zone.rejection_reason && (
            <div className="bg-ypark-danger/5 border border-ypark-danger/20 rounded-lg p-4">
              <p className="text-ypark-danger font-bold text-xs mb-1 uppercase tracking-wide">Rejection Reason</p>
              <p className="text-ypark-danger text-xs">{zone.rejection_reason}</p>
            </div>
          )}

          {/* Reject Input */}
          {rejectMode && (
            <div className="bg-ypark-danger/5 border border-ypark-danger/20 rounded-lg p-4">
              <p className="text-ypark-danger font-bold text-xs mb-2">Reason for Rejection</p>
              <textarea
                className="w-full bg-white border border-ypark-danger/30 rounded-lg px-3 py-2 text-xs text-ypark-text placeholder:text-ypark-text-muted resize-none focus:outline-none focus:border-ypark-danger"
                rows={3}
                placeholder="Explain why this parking area is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

        </div>

        {/* Action Buttons — only for pending */}
        {zone.status === 'PENDING_APPROVAL' && (
          <div className="px-5 py-4 border-t border-ypark-black/10 bg-white space-y-2">
            {!rejectMode ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(zone.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-ypark-success hover:brightness-110 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Parking Area
                </button>
                <button
                  onClick={() => setRejectMode(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-ypark-danger hover:brightness-110 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Parking Area
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (rejectReason.trim()) {
                      onReject(zone.id, rejectReason)
                    }
                  }}
                  className="flex-1 bg-ypark-danger hover:brightness-110 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => { setRejectMode(false); setRejectReason('') }}
                  className="flex-1 bg-ypark-light-gray hover:bg-ypark-black/10 text-ypark-text-muted text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────
const ZoneApproval = () => {
  const [zones, setZones] = useState(mockZones)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [selectedZone, setSelectedZone] = useState(null)

  // Filter logic
  const filtered = zones.filter((z) => {
    const matchSearch =
      z.name.toLowerCase().includes(search.toLowerCase()) ||
      z.owner.toLowerCase().includes(search.toLowerCase()) ||
      z.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || z.status === statusFilter
    const matchType = typeFilter === 'ALL' || z.zone_type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData,
    setCurrentPage,
    resetPage,
  } = usePagination(filtered, 10)

  const handleApprove = (id) => {
    setZones((prev) =>
      prev.map((z) => z.id === id ? { ...z, status: 'APPROVED' } : z)
    )
    setSelectedZone((prev) => prev ? { ...prev, status: 'APPROVED' } : null)
  }

  const handleReject = (id, reason) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === id ? { ...z, status: 'REJECTED', rejection_reason: reason } : z
      )
    )
    setSelectedZone((prev) =>
      prev ? { ...prev, status: 'REJECTED', rejection_reason: reason } : null
    )
  }

  const pendingCount = zones.filter((z) => z.status === 'PENDING_APPROVAL').length

  return (
    <div className="space-y-4">

      {/* Page Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-ypark-text font-bold text-sm">All Parking Areas</span>
          {pendingCount > 0 && (
            <span className="bg-ypark-warning text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
        <span className="text-ypark-text-muted text-xs">{filtered.length} parking areas found</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-ypark-black/10 p-4">
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ypark-text-muted" />
            <input
              type="text"
              placeholder="Search by parking area name, owner, city..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                resetPage()
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-ypark-black/10 rounded-lg text-ypark-text placeholder:text-ypark-text-muted focus:outline-none focus:border-ypark-deep-blue transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              resetPage()
            }}
            className="px-3 py-2 text-sm border border-ypark-black/10 rounded-lg text-ypark-text focus:outline-none focus:border-ypark-deep-blue bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_APPROVAL">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              resetPage()
            }}
            className="px-3 py-2 text-sm border border-ypark-black/10 rounded-lg text-ypark-text focus:outline-none focus:border-ypark-deep-blue bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="ON_ROAD">Govt. Authorized</option>
            <option value="OFF_ROAD">Private</option>
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-ypark-black/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-ypark-light-gray border-b border-ypark-black/10">
              <th className="text-left px-5 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">Parking Area</th>
              <th className="text-left px-4 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">Owner</th>
              <th className="text-left px-4 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">City</th>
              <th className="text-left px-4 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">Submitted</th>
              <th className="text-left px-4 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-ypark-text-muted text-xs font-semibold uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ypark-light-gray">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-ypark-text-muted text-sm">
                  No parking areas found matching your filters
                </td>
              </tr>
            ) : (
              paginatedData.map((zone) => {
                const typeBadge = getZoneTypeBadge(zone.zone_type, zone.has_marked_slots)
                const status = statusConfig[zone.status]
                //const StatusIcon = status.icon
                return (
                  <tr
                    key={zone.id}
                    className="hover:bg-ypark-light-gray/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedZone(zone)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-ypark-deep-blue/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-ypark-deep-blue" />
                        </div>
                        <div>
                          <p className="text-ypark-text text-sm font-semibold leading-none">{zone.name}</p>
                          <p className="text-ypark-text-muted text-xs mt-0.5">{zone.address.substring(0, 35)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-ypark-text text-sm font-medium">{zone.owner}</p>
                      <p className="text-ypark-text-muted text-xs">{zone.owner_phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-ypark-text-muted" />
                        <span className="text-ypark-text text-sm">{zone.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeBadge.className}`}>
                        {typeBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-ypark-text-muted">
                        <Calendar className="w-3 h-3" />
                        <span className="text-xs">{zone.submitted}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 w-fit ${status.className}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedZone(zone) }}
                        className="flex items-center gap-1 text-ypark-deep-blue text-xs font-semibold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-ypark-black/10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
        
      </div>

      {/* Detail Panel */}
      {selectedZone && (
        <ZoneDetailPanel
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

    </div>
  )
}

export default ZoneApproval