export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ borderColor: "#DDD9CE", color: "#AC9C8D" }}
        className="px-4 py-2 text-sm border rounded-lg hover:opacity-70 disabled:opacity-30 transition"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={
            page === currentPage
              ? { backgroundColor: "#610C27", color: "#EFECE9" }
              : { borderColor: "#DDD9CE", color: "#AC9C8D" }
          }
          className={`px-4 py-2 text-sm rounded-lg transition ${
            page === currentPage ? "" : "border hover:opacity-70"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ borderColor: "#DDD9CE", color: "#AC9C8D" }}
        className="px-4 py-2 text-sm border rounded-lg hover:opacity-70 disabled:opacity-30 transition"
      >
        Next
      </button>
    </div>
  );
}