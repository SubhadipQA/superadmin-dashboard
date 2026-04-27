import { useState, useMemo } from 'react'

const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
  }, [data, currentPage, itemsPerPage])

  // Reset to page 1 when data changes (filter applied)
  const resetPage = () => setCurrentPage(1)

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData,
    setCurrentPage,
    resetPage,
  }
}

export default usePagination