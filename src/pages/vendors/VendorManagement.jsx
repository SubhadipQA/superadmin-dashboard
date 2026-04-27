import Pagination from '@/components/ui/Pagination'
import usePagination from '@/hooks/usePagination'
import { useState } from 'react'
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Eye,
  Clock,
  X,
  Navigation,
  ShieldCheck,
  ShieldX,
  Ban,
  CircleCheck,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────
const mockVendors = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9831012345',
    city: 'Kolkata',
    state: 'West Bengal',
    business_name: 'Rajesh Parking Services',
    business_type: 'INDIVIDUAL',
    gst_number: '19ABCDE1234F1Z5',
    kyc_status: 'VERIFIED',
    account_status: 'ACTIVE',
    zones_count: 2,
    joined: '10 Jan 2026',
    zones: [
      { name: 'Salt Lake Sector V Roadside', status: 'APPROVED', type: 'ON_ROAD' },
      { name: 'Bidhannagar Station Road', status: 'PENDING_APPROVAL', type: 'ON_ROAD' },
    ],
    bank_holder_name: 'Rajesh Kumar',
    bank_account_number: '****4521',
    bank_ifsc: 'SBIN0001234',
  },
  {
    id: 2,
    name: 'Priya Ventures Pvt Ltd',
    email: 'priya@southcity.com',
    phone: '9830098300',
    city: 'Kolkata',
    state: 'West Bengal',
    business_name: 'Priya Ventures Pvt Ltd',
    business_type: 'PRIVATE',
    gst_number: '19XYZAB5678G2Z1',
    kyc_status: 'VERIFIED',
    account_status: 'ACTIVE',
    zones_count: 3,
    joined: '05 Feb 2026',
    zones: [
      { name: 'South City Mall Basement', status: 'APPROVED', type: 'OFF_ROAD' },
      { name: 'Acropolis Mall Parking', status: 'APPROVED', type: 'OFF_ROAD' },
      { name: 'Gariahat Road Bay', status: 'PENDING_APPROVAL', type: 'ON_ROAD' },
    ],
    bank_holder_name: 'Priya Ventures Pvt Ltd',
    bank_account_number: '****7823',
    bank_ifsc: 'HDFC0002345',
  },
  {
    id: 3,
    name: 'Mohammed Alam',
    email: 'alam@example.com',
    phone: '9123456789',
    city: 'Kolkata',
    state: 'West Bengal',
    business_name: 'Alam Parking',
    business_type: 'INDIVIDUAL',
    gst_number: null,
    kyc_status: 'PENDING',
    account_status: 'ACTIVE',
    zones_count: 1,
    joined: '18 Feb 2026',
    zones: [
      { name: 'Park Street Parking Bay', status: 'APPROVED', type: 'OFF_ROAD' },
    ],
    bank_holder_name: 'Mohammed Alam',
    bank_account_number: '****3312',
    bank_ifsc: 'PUNB0001122',
  },
  {
    id: 4,
    name: 'Sneha Properties',
    email: 'sneha@properties.com',
    phone: '9876543210',
    city: 'Kolkata',
    state: 'West Bengal',
    business_name: 'Sneha Properties Pvt Ltd',
    business_type: 'PRIVATE',
    gst_number: '19SNHAB9012H3Z4',
    kyc_status: 'REJECTED',
    account_status: 'SUSPENDED',
    zones_count: 1,
    joined: '01 Mar 2026',
    zones: [
      { name: 'New Town Action Area 1', status: 'REJECTED', type: 'OFF_ROAD' },
    ],
    bank_holder_name: 'Sneha Properties Pvt Ltd',
    bank_account_number: '****6644',
    bank_ifsc: 'ICIC0003456',
  },
  {
    id: 5,
    name: 'Amit Das',
    email: 'amit@example.com',
    phone: '9000011111',
    city: 'Howrah',
    state: 'West Bengal',
    business_name: 'Das Parking Solutions',
    business_type: 'INDIVIDUAL',
    gst_number: null,
    kyc_status: 'PENDING',
    account_status: 'ACTIVE',
    zones_count: 1,
    joined: '15 Mar 2026',
    zones: [
      { name: 'Howrah Station Road Bay', status: 'PENDING_APPROVAL', type: 'ON_ROAD' },
    ],
    bank_holder_name: 'Amit Das',
    bank_account_number: '****9981',
    bank_ifsc: 'UBIN0004567',
  },
]

// ─── Helpers ──────────────────────────────────────────────
const kycConfig = {
  VERIFIED: {
    label: 'Verified',
    className: 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20',
    icon: ShieldCheck,
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-[#F57F17]/10 text-[#F57F17] border border-[#F57F17]/20',
    icon: Clock,
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20',
    icon: ShieldX,
  },
}

const accountConfig = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20',
  },
  SUSPENDED: {
    label: 'Suspended',
    className: 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20',
  },
  INACTIVE: {
    label: 'Inactive',
    className: 'bg-[#506A84]/10 text-[#506A84] border border-[#506A84]/20',
  },
}

const zoneStatusConfig = {
  APPROVED: 'text-[#2E7D32]',
  PENDING_APPROVAL: 'text-[#F57F17]',
  REJECTED: 'text-[#C0392B]',
}

const parkingAreaTypeLabel = {
  ON_ROAD: 'Govt. Authorized',
  OFF_ROAD: 'Private',
}

const businessTypeLabel = {
  INDIVIDUAL: 'Individual',
  PRIVATE: 'Private Company',
  GOVERNMENT: 'Government',
  SOCIETY: 'Society',
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start py-2.5 border-b border-[#F0F4F8] last:border-0">
    <span className="text-[#506A84] text-xs font-medium w-36 shrink-0">{label}</span>
    <span className="text-[#1A2332] text-xs font-semibold text-right">{value || '—'}</span>
  </div>
)

// ─── Detail Panel ─────────────────────────────────────────
const VendorDetailPanel = ({ vendor, onClose, onToggleStatus }) => {
  const [confirmMode, setConfirmMode] = useState(false)
  const kyc = kycConfig[vendor.kyc_status]
  const KycIcon = kyc.icon
  const account = accountConfig[vendor.account_status]
  const isSuspended = vendor.account_status === 'SUSPENDED'

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[460px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D1D5DC] bg-[#F0F4F8]">
          <div>
            <h2 className="text-[#1A2332] font-bold text-sm">Vendor Details</h2>
            <p className="text-[#506A84] text-xs mt-0.5">Full profile and parking area information</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#D1D5DC] transition-colors"
          >
            <X className="w-4 h-4 text-[#506A84]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Vendor Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1565C0] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {vendor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-[#1A2332] font-bold text-sm">{vendor.name}</h3>
                <p className="text-[#506A84] text-xs">{vendor.business_name}</p>
                <p className="text-[#506A84] text-xs">{vendor.city}, {vendor.state}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border shrink-0 ${account.className}`}>
              {account.label}
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#506A84]">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-xs">{vendor.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#506A84]">
              <Mail className="w-3.5 h-3.5" />
              <span className="text-xs">{vendor.email}</span>
            </div>
          </div>

          {/* KYC Status */}
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${kyc.className}`}>
            <KycIcon className="w-4 h-4" />
            <div>
              <p className="text-xs font-bold">KYC {kyc.label}</p>
              <p className="text-xs opacity-80">
                {vendor.kyc_status === 'VERIFIED'
                  ? 'All documents verified successfully'
                  : vendor.kyc_status === 'PENDING'
                  ? 'Documents submitted, awaiting review'
                  : 'Documents rejected, re-submission required'}
              </p>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-[#F0F4F8] rounded-lg p-4">
            <p className="text-[#1A2332] font-bold text-xs mb-2 uppercase tracking-wide">Business Details</p>
            <InfoRow label="Business Type" value={businessTypeLabel[vendor.business_type]} />
            <InfoRow label="GST Number" value={vendor.gst_number} />
            <InfoRow label="Member Since" value={vendor.joined} />
          </div>

          {/* Bank Info */}
          <div className="bg-[#F0F4F8] rounded-lg p-4">
            <p className="text-[#1A2332] font-bold text-xs mb-2 uppercase tracking-wide">Bank Details</p>
            <InfoRow label="Account Holder" value={vendor.bank_holder_name} />
            <InfoRow label="Account Number" value={vendor.bank_account_number} />
            <InfoRow label="IFSC Code" value={vendor.bank_ifsc} />
          </div>

          {/* Parking Areas */}
          <div className="bg-[#F0F4F8] rounded-lg p-4">
            <p className="text-[#1A2332] font-bold text-xs mb-3 uppercase tracking-wide">
              Their Parking Areas ({vendor.zones_count})
            </p>
            <div className="space-y-2">
              {vendor.zones.map((zone) => (
                <div
                  key={zone.name}
                  className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-[#D1D5DC]"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#1565C0]" />
                    <span className="text-[#1A2332] text-xs font-medium">{zone.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#506A84] text-xs">{parkingAreaTypeLabel[zone.type] || zone.type}</span>
                    <span className={`text-xs font-bold ${zoneStatusConfig[zone.status]}`}>
                      {zone.status === 'PENDING_APPROVAL' ? 'Pending' : zone.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Mode */}
          {confirmMode && (
            <div className={`rounded-lg p-4 border ${isSuspended ? 'bg-[#2E7D32]/5 border-[#2E7D32]/20' : 'bg-[#C0392B]/5 border-[#C0392B]/20'}`}>
              <p className={`text-xs font-bold mb-1 ${isSuspended ? 'text-[#2E7D32]' : 'text-[#C0392B]'}`}>
                {isSuspended ? 'Activate this vendor account?' : 'Suspend this vendor account?'}
              </p>
              <p className={`text-xs ${isSuspended ? 'text-[#2E7D32]' : 'text-[#C0392B]'}`}>
                {isSuspended
                  ? 'Vendor will regain full access to the platform.'
                  : 'Vendor will lose access. Their parking areas will become inactive.'}
              </p>
            </div>
          )}

        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-[#D1D5DC] bg-white space-y-2">
          {!confirmMode ? (
            <button
              onClick={() => setConfirmMode(true)}
              className={`w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                isSuspended
                  ? 'bg-[#2E7D32] hover:bg-[#1B5E20]'
                  : 'bg-[#C0392B] hover:bg-[#922B21]'
              }`}
            >
              {isSuspended ? <CircleCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
              {isSuspended ? 'Activate Account' : 'Suspend Account'}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { onToggleStatus(vendor.id); setConfirmMode(false) }}
                className={`flex-1 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                  isSuspended ? 'bg-[#2E7D32] hover:bg-[#1B5E20]' : 'bg-[#C0392B] hover:bg-[#922B21]'
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmMode(false)}
                className="flex-1 bg-[#F0F4F8] hover:bg-[#D1D5DC] text-[#506A84] text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────
const VendorManagement = () => {
  const [vendors, setVendors] = useState(mockVendors)
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedVendor, setSelectedVendor] = useState(null)

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      v.city.toLowerCase().includes(search.toLowerCase()) ||
      v.business_name.toLowerCase().includes(search.toLowerCase())
    const matchKyc = kycFilter === 'ALL' || v.kyc_status === kycFilter
    const matchStatus = statusFilter === 'ALL' || v.account_status === statusFilter
    return matchSearch && matchKyc && matchStatus
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

  const handleToggleStatus = (id) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, account_status: v.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : v
      )
    )
    setSelectedVendor((prev) =>
      prev
        ? { ...prev, account_status: prev.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
        : null
    )
  }

  return (
    <div className="space-y-4">

      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#1A2332] font-bold text-sm">All Vendors</span>
          <span className="bg-[#1565C0] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {vendors.length} total
          </span>
        </div>
        <span className="text-[#506A84] text-xs">{filtered.length} vendors found</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#D1D5DC] p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAEAE]" />
            <input
              type="text"
              placeholder="Search by name, phone, city, business name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                resetPage()
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#D1D5DC] rounded-lg text-[#1A2332] placeholder:text-[#AEAEAE] focus:outline-none focus:border-[#1565C0] transition-colors"
            />
          </div>
          <select
            value={kycFilter}
            onChange={(e) => {
              setKycFilter(e.target.value)
              resetPage()
            }}
            className="px-3 py-2 text-sm border border-[#D1D5DC] rounded-lg text-[#1A2332] focus:outline-none focus:border-[#1565C0] bg-white"
          >
            <option value="ALL">All KYC</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              resetPage()
            }}
            className="px-3 py-2 text-sm border border-[#D1D5DC] rounded-lg text-[#1A2332] focus:outline-none focus:border-[#1565C0] bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#D1D5DC] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F4F8] border-b border-[#D1D5DC]">
              <th className="text-left px-5 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">Vendor</th>
              <th className="text-left px-4 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">Phone</th>
              <th className="text-left px-4 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">City</th>
              <th className="text-left px-4 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">Parking Areas</th>
              <th className="text-left px-4 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">KYC</th>
              <th className="text-left px-4 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-[#506A84] text-xs font-semibold uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F8]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#506A84] text-sm">
                  No vendors found matching your filters
                </td>
              </tr>
            ) : (
              paginatedData.map((vendor) => {
                const kyc = kycConfig[vendor.kyc_status]
                const KycIcon = kyc.icon
                const account = accountConfig[vendor.account_status]
                return (
                  <tr
                    key={vendor.id}
                    className="hover:bg-[#F0F4F8]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[#1A2332] text-sm font-semibold leading-none">{vendor.name}</p>
                          <p className="text-[#506A84] text-xs mt-0.5">{vendor.business_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#506A84]" />
                        <span className="text-[#1A2332] text-sm">{vendor.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-[#506A84]" />
                        <span className="text-[#1A2332] text-sm">{vendor.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1565C0]" />
                        <span className="text-[#1A2332] text-sm font-semibold">{vendor.zones_count}</span>
                        <span className="text-[#506A84] text-xs">parking areas</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 w-fit ${kyc.className}`}>
                        <KycIcon className="w-3 h-3" />
                        {kyc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${account.className}`}>
                        {account.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor) }}
                        className="flex items-center gap-1 text-[#1565C0] text-xs font-semibold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        <div className="px-5 py-3 border-t border-[#D1D5DC]">
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
      {selectedVendor && (
        <VendorDetailPanel
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onToggleStatus={handleToggleStatus}
        />
      )}

    </div>
  )
}

export default VendorManagement