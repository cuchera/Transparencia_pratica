import { Link, useLocation } from "react-router";
import { BarChart3, Home, Users, TrendingUp } from "lucide-react";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Transparência Política</h1>
              <p className="text-xs text-gray-500">Governança orientada por dados</p>
            </div>
          </Link>

          <nav className="flex gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/comparison"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/comparison")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Comparação</span>
            </Link>
            <Link
              to="/analytics"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive("/analytics")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Análises</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
