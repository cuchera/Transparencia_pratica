import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { mockPoliticians } from "../data/mockData";
import { ScoreIndicator } from "../components/ScoreIndicator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { X, Plus } from "lucide-react";

export function Comparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      setSelectedIds(ids.split(","));
    }
  }, [searchParams]);

  const selectedPoliticians = mockPoliticians.filter((p) =>
    selectedIds.includes(p.id)
  );

  const addPolitician = (id: string) => {
    if (!selectedIds.includes(id)) {
      const newIds = [...selectedIds, id];
      setSelectedIds(newIds);
      setSearchParams({ ids: newIds.join(",") });
      setShowAddMenu(false);
    }
  };

  const removePolitician = (id: string) => {
    const newIds = selectedIds.filter((i) => i !== id);
    setSelectedIds(newIds);
    if (newIds.length > 0) {
      setSearchParams({ ids: newIds.join(",") });
    } else {
      setSearchParams({});
    }
  };

  const comparisonData = [
    {
      metric: "Proposals Submitted",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.name, p.proposalsSubmitted])
      ),
    },
    {
      metric: "Proposals Approved",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.name, p.proposalsApproved])
      ),
    },
    {
      metric: "Attendance %",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.name, p.attendance])
      ),
    },
  ];

  const expenseData = [
    {
      metric: "Total Expenses ($k)",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.name, p.expenses / 1000])
      ),
    },
  ];

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Compare Politicians
          </h1>
          <p className="text-gray-600">
            Select politicians to compare their performance metrics
          </p>
        </div>

        {/* Selected Politicians */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Selected Politicians ({selectedPoliticians.length})
            </h2>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Politician
            </button>
          </div>

          {showAddMenu && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Select a politician to add:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockPoliticians
                  .filter((p) => !selectedIds.includes(p.id))
                  .map((politician) => (
                    <button
                      key={politician.id}
                      onClick={() => addPolitician(politician.id)}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors text-left"
                    >
                      <img
                        src={politician.photo}
                        alt={politician.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {politician.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {politician.position} - {politician.state}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {selectedPoliticians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedPoliticians.map((politician) => (
                <div
                  key={politician.id}
                  className="relative p-4 border border-gray-200 rounded-lg"
                >
                  <button
                    onClick={() => removePolitician(politician.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3">
                    <img
                      src={politician.photo}
                      alt={politician.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {politician.name}
                      </h3>
                      <p className="text-sm text-blue-600">{politician.party}</p>
                      <p className="text-sm text-gray-600">
                        {politician.position}
                      </p>
                    </div>
                    <ScoreIndicator score={politician.score} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No politicians selected. Click "Add Politician" to start comparing.
            </div>
          )}
        </div>

        {selectedPoliticians.length >= 2 && (
          <>
            {/* Metrics Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Metric
                      </th>
                      {selectedPoliticians.map((politician) => (
                        <th
                          key={politician.id}
                          className="text-left py-3 px-4 font-semibold text-gray-900"
                        >
                          {politician.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">Overall Score</td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.score}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">
                        Proposals Submitted
                      </td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.proposalsSubmitted}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">
                        Proposals Approved
                      </td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.proposalsApproved}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">Attendance</td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.attendance}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">
                        Years in Office
                      </td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.yearsInOffice}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">
                        Total Expenses
                      </td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            ${politician.expenses.toLocaleString()}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-600">
                        Cost per Productivity Unit
                      </td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            ${politician.costPerProductivity.toLocaleString()}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Comparison Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Comparison
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="metric" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {selectedPoliticians.map((politician, index) => (
                    <Bar
                      key={politician.id}
                      dataKey={politician.name}
                      fill={colors[index % colors.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Comparison Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Expense Comparison
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="metric" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {selectedPoliticians.map((politician, index) => (
                    <Bar
                      key={politician.id}
                      dataKey={politician.name}
                      fill={colors[index % colors.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
