import { useState, useMemo } from "react";
import { mockPoliticians, positions, years } from "../data/mockData";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";

export function Analytics() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");

  const filteredPoliticians = useMemo(() => {
    return mockPoliticians.filter((politician) => {
      const matchesPosition =
        selectedPosition === "All Positions" ||
        politician.position === selectedPosition;
      return matchesPosition;
    });
  }, [selectedPosition]);

  const totalExpenses = filteredPoliticians.reduce(
    (sum, p) => sum + p.expenses,
    0
  );
  const totalProposals = filteredPoliticians.reduce(
    (sum, p) => sum + p.proposalsSubmitted,
    0
  );
  const avgProductivity =
    filteredPoliticians.reduce((sum, p) => sum + p.productivity, 0) /
    filteredPoliticians.length;
  const avgScore =
    filteredPoliticians.reduce((sum, p) => sum + p.score, 0) /
    filteredPoliticians.length;

  const partyDistribution = [
    {
      name: "Democratic Party",
      value: filteredPoliticians.filter((p) => p.party === "Democratic Party")
        .length,
    },
    {
      name: "Republican Party",
      value: filteredPoliticians.filter((p) => p.party === "Republican Party")
        .length,
    },
  ];

  const expensesByState = filteredPoliticians.reduce((acc, politician) => {
    const existing = acc.find((item) => item.state === politician.state);
    if (existing) {
      existing.expenses += politician.expenses / 1000;
    } else {
      acc.push({
        state: politician.state,
        expenses: politician.expenses / 1000,
      });
    }
    return acc;
  }, [] as { state: string; expenses: number }[]);

  const productivityByState = filteredPoliticians.reduce((acc, politician) => {
    const existing = acc.find((item) => item.state === politician.state);
    if (existing) {
      existing.productivity += politician.productivity;
    } else {
      acc.push({
        state: politician.state,
        productivity: politician.productivity,
      });
    }
    return acc;
  }, [] as { state: string; productivity: number }[]);

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Public Spending & Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of political performance and public expenditure data
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              ${(totalExpenses / 1000000).toFixed(2)}M
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
              <TrendingUp className="w-4 h-4" />
              <span>+5.2% from last year</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Proposals</p>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {totalProposals}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12.3% from last year</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Productivity</p>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {avgProductivity.toFixed(1)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8.7% from last year</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Score</p>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {avgScore.toFixed(1)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-yellow-600">
              <TrendingDown className="w-4 h-4" />
              <span>-2.1% from last year</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Party Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Party Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {partyDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Expenses by State */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Public Spending by State
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByState}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="state" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="expenses"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Expenses ($k)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity by State */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Productivity Indicators by State
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={productivityByState}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="state" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 6 }}
                name="Productivity Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performers
          </h2>
          <div className="space-y-3">
            {filteredPoliticians
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((politician, index) => (
                <div
                  key={politician.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <img
                    src={politician.photo}
                    alt={politician.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {politician.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {politician.position} - {politician.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900">
                      {politician.score}
                    </p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
