import { Button } from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = ''
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Calculate range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add range
    rangeWithDots.push(...range);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label="Pagination"
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="flex items-center"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`dots-${index}`}
                className="flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              disabled={isLoading}
              className={`w-8 h-8 p-0 ${
                isCurrentPage
                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:border-indigo-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="flex items-center"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </nav>
  );
}

// Usage info component for developers
export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300">
      Showing{' '}
      <span className="font-medium">{startItem}</span>
      {' '}to{' '}
      <span className="font-medium">{endItem}</span>
      {' '}of{' '}
      <span className="font-medium">{totalItems}</span>
      {' '}results
    </div>
  );
} 