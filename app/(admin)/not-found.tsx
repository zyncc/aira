import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="relative">
          <svg
            className="w-full h-64"
            viewBox="0 0 1155 678"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M317.954 595.291C176.478 637.241 30.4832 623.449 -67.9668 565.565L-67.9668 678L1224.53 678L1224.53 0C1185.69 81.8795 1122.08 163.824 1029.63 201.173C906.143 250.525 804.969 165.276 619.888 208.489C434.807 251.703 494.135 543.144 317.954 595.291Z"
              fill="url(#paint0_linear)"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="578.284"
                y1="0"
                x2="578.284"
                y2="678"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D1FAE5" />
                <stop offset="1" stopColor="#10B981" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 mr-2 text-red-500" />
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2transition-colors duration-300 ease-in-out"
          >
            <Home className="w-5 h-5 mr-2" />
            Go back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
