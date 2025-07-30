export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <div className="text-lg font-medium text-gray-900">Loading...</div>
      </div>
    </div>
  );
}