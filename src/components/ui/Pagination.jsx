import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }

    pages.push(1)

    if (currentPage > 3) pages.push('...')

    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('...')

    pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex items-center justify-between px-1 py-2">

      {/* Left — Showing info */}
      <p className="text-[#506A84] text-xs">
        Showing <span className="text-[#1A2332] font-semibold">{start}</span> to{' '}
        <span className="text-[#1A2332] font-semibold">{end}</span> of{' '}
        <span className="text-[#1A2332] font-semibold">{totalItems}</span> results
      </p>

      {/* Right — Page controls */}
      <div className="flex items-center gap-1">

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#D1D5DC] text-[#506A84] hover:bg-[#F0F4F8] hover:text-[#1A2332] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span
              key={`dots-${index}`}
              className="w-8 h-8 flex items-center justify-center text-[#506A84] text-xs"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold border transition-colors ${
                currentPage === page
                  ? 'bg-[#1565C0] text-white border-[#1565C0]'
                  : 'border-[#D1D5DC] text-[#506A84] hover:bg-[#F0F4F8] hover:text-[#1A2332]'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#D1D5DC] text-[#506A84] hover:bg-[#F0F4F8] hover:text-[#1A2332] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  )
}

export default Pagination