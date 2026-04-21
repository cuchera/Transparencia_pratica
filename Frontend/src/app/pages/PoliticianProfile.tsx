import { useParams, Link } from "react-router";
import { mockPoliticians } from "../data/mockData";
import { ScoreIndicator } from "../components/ScoreIndicator";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  CheckCircle,
  Users,
  DollarSign,
} from "lucide-react";

export function PoliticianProfile() {
  const { id } = useParams();
  const politician = mockPoliticians.find((p) => p.id === id);

  if (!politician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Politician Not Found
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={politician.photo}
              alt={politician.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {politician.name}
              </h1>
              <p className="text-xl text-blue-600 mb-4">{politician.party}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{politician.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>{politician.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{politician.yearsInOffice} years in office</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ScoreIndicator score={politician.score} size="lg" />
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Proposals Submitted</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.proposalsSubmitted}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Proposals Approved</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.proposalsApproved}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.attendance}%
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Cost per Productivity Unit</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              ${politician.costPerProductivity.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Expenses Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Expenses (2025)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={politician.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Productivity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Productivity (2025)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={politician.monthlyProductivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="proposals"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Political Career Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Political Career Timeline
          </h2>
          <div className="space-y-4">
            {politician.career.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {event.year}
                  </div>
                  {index < politician.career.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-gray-900">
                    {event.position}
                  </h3>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Button */}
        <div className="flex justify-center">
          <Link
            to={`/comparison?ids=${politician.id}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Compare with Other Politicians
          </Link>
        </div>
      </div>
    </div>
  );
}
