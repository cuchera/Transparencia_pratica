import { useState, useMemo, useEffect } from "react";
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

const API_URL = import.meta.env.VITE_API_URL;

interface Politician {
  id: number;
  nome: string;
  sigla_partido: string;
  sigla_uf: string;
  uri_foto: string;
  gasto_total: number;
  proposicoes: number;
  presenca: number;
  score_produtividade: number;
  gastos_por_categoria?: Record<string, number>;
}

export function Analytics() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedParty, setSelectedParty] = useState("Todos");
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/deputados?ano=${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do backend");
        return res.json();
      })
      .then((data: Politician[]) => {
        setPoliticians(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar os dados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedYear]);

  const parties = useMemo(() => {
    const uniqueParties = [...new Set(politicians.map((p) => p.sigla_partido))];
    return ["Todos", ...uniqueParties.sort()];
  }, [politicians]);

  const years = ["2023", "2024", "2025", "2026"];

  const filteredPoliticians = useMemo(() => {
    return politicians.filter((politician) => {
      const matchesParty =
        selectedParty === "Todos" ||
        politician.sigla_partido === selectedParty;

      return matchesParty;
    });
  }, [politicians, selectedParty]);

  const totalExpenses = filteredPoliticians.reduce(
    (sum, p) => sum + p.gasto_total,
    0
  );

  const totalProposals = filteredPoliticians.reduce(
    (sum, p) => sum + p.proposicoes,
    0
  );

  const avgAttendance =
    filteredPoliticians.length > 0
      ? filteredPoliticians.reduce((sum, p) => sum + p.presenca, 0) /
        filteredPoliticians.length
      : 0;

  const avgScore =
    filteredPoliticians.length > 0
      ? filteredPoliticians.reduce((sum, p) => sum + p.score_produtividade, 0) /
        filteredPoliticians.length
      : 0;

  const partyDistribution = Object.values(
    filteredPoliticians.reduce((acc, politician) => {
      const key = politician.sigla_partido;
      if (!acc[key]) {
        acc[key] = { name: key, value: 0 };
      }
      acc[key].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const expensesByState = Object.values(
    filteredPoliticians.reduce((acc, politician) => {
      const key = politician.sigla_uf;
      if (!acc[key]) {
        acc[key] = { state: key, expenses: 0 };
      }
      acc[key].expenses += politician.gasto_total / 1000;
      return acc;
    }, {} as Record<string, { state: string; expenses: number }>)
  ).sort((a, b) => b.expenses - a.expenses);

  const productivityByState = Object.values(
    filteredPoliticians.reduce((acc, politician) => {
      const key = politician.sigla_uf;
      if (!acc[key]) {
        acc[key] = { state: key, productivity: 0 };
      }
      acc[key].productivity += politician.score_produtividade;
      return acc;
    }, {} as Record<string, { state: string; productivity: number }>)
  ).sort((a, b) => b.productivity - a.productivity);

  const topPerformers = [...filteredPoliticians]
    .sort((a, b) => b.score_produtividade - a.score_produtividade)
    .slice(0, 5);

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Dashboard Analítico
          </h1>
          <p className="text-gray-600">
            Visão geral de gastos públicos, produtividade e distribuição partidária
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
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
                Partido
              </label>
              <select
                value={selectedParty}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {parties.map((party) => (
                  <option key={party} value={party}>
                    {party}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Gasto Total</p>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              R$ {(totalExpenses / 1000000).toFixed(2)}M
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
              <TrendingUp className="w-4 h-4" />
              <span>Total agregado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total de Proposições</p>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {totalProposals}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Total agregado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Média de Presença</p>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {avgAttendance.toFixed(1)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Média do recorte</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Média de Score</p>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {avgScore.toFixed(1)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm text-yellow-600">
              <TrendingDown className="w-4 h-4" />
              <span>Média do recorte</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Distribuição por Partido
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
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

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Gasto Público por UF
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
                  name="Gastos (R$ mil)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Score de Produtividade por UF
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
                name="Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Desempenhos
          </h2>
          <div className="space-y-3">
            {topPerformers.map((politician, index) => (
              <div
                key={politician.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                <img
                  src={politician.uri_foto || "https://via.placeholder.com/48"}
                  alt={politician.nome}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {politician.nome}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {politician.sigla_partido} - {politician.sigla_uf}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-900">
                    {politician.score_produtividade}
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