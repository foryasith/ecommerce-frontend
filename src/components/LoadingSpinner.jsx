export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        style={{ borderColor: "#DDD9CE", borderTopColor: "#610C27" }}
        className="w-10 h-10 rounded-full border-4 animate-spin"
      />
      <p style={{ color: "#AC9C8D" }} className="text-sm">
        {message}
      </p>
    </div>
  );
}