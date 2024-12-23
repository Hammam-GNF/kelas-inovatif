interface AuthErrorProps {
  error: string;
  reset?: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {reset && (
            <button
              onClick={reset}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
