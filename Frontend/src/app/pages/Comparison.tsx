import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
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

export function Comparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      setSelectedIds(ids.split(","));
    } else {
      setSelectedIds([]);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/deputados`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar dados do backend");
        }
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
  }, []);

  const selectedPoliticians = useMemo(() => {
    return politicians.filter((p) => selectedIds.includes(String(p.id)));
  }, [politicians, selectedIds]);

  const availablePoliticians = useMemo(() => {
    return politicians.filter((p) => !selectedIds.includes(String(p.id)));
  }, [politicians, selectedIds]);

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
      metric: "Proposições",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.nome, p.proposicoes])
      ),
    },
    {
      metric: "Presença",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.nome, p.presenca])
      ),
    },
    {
      metric: "Score",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.nome, p.score_produtividade])
      ),
    },
  ];

  const expenseData = [
    {
      metric: "Gasto Total (R$ mil)",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [p.nome, p.gasto_total / 1000])
      ),
    },
  ];

  const costData = [
    {
      metric: "Custo por Unidade",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [
          p.nome,
          p.score_produtividade > 0
            ? p.gasto_total / p.score_produtividade
            : 0,
        ])
      ),
    },
  ];

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando comparação...</p>
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
            Comparar Políticos
          </h1>
          <p className="text-gray-600">
            Selecione políticos para comparar produtividade, presença e gastos
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Políticos Selecionados ({selectedPoliticians.length})
            </h2>

            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Político
            </button>
          </div>

          {showAddMenu && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Selecione um político para adicionar:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-auto">
                {availablePoliticians.map((politician) => (
                  <button
                    key={politician.id}
                    onClick={() => addPolitician(String(politician.id))}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors text-left"
                  >
                    <img
                      src={politician.uri_foto || "https://via.placeholder.com/48"}
                      alt={politician.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {politician.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        {politician.sigla_partido} - {politician.sigla_uf}
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
                    onClick={() => removePolitician(String(politician.id))}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-3">
                    <img
                      src={politician.uri_foto || "https://via.placeholder.com/64"}
                      alt={politician.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {politician.nome}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {politician.sigla_partido}
                      </p>
                      <p className="text-sm text-gray-600">
                        {politician.sigla_uf}
                      </p>
                    </div>

                    <ScoreIndicator
                      score={politician.score_produtividade}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum político selecionado. Clique em "Adicionar Político" para começar.
            </div>
          )}
        </div>

        {selectedPoliticians.length >= 2 && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Métricas de Comparação
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Métrica
                      </th>
                      {selectedPoliticians.map((politician) => (
                        <th
                          key={politician.id}
                          className="text-left py-3 px-4 font-semibold text-gray-900"
                        >
                          {politician.nome}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">Score</td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.score_produtividade}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">Proposições</td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.proposicoes}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">Presença</td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            {politician.presenca}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-600">Gasto Total</td>
                      {selectedPoliticians.map((politician) => (
                        <td key={politician.id} className="py-3 px-4">
                          <span className="font-semibold text-gray-900">
                            R${" "}
                            {politician.gasto_total.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 px-4 text-gray-600">
                        Custo por Unidade
                      </td>
                      {selectedPoliticians.map((politician) => {
                        const costPerProductivity =
                          politician.score_produtividade > 0
                            ? politician.gasto_total / politician.score_produtividade
                            : 0;

                        return (
                          <td key={politician.id} className="py-3 px-4">
                            <span className="font-semibold text-gray-900">
                              R${" "}
                              {costPerProductivity.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comparação de Desempenho
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
                      dataKey={politician.nome}
                      fill={colors[index % colors.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comparação de Gastos
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
                      dataKey={politician.nome}
                      fill={colors[index % colors.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comparação de Custo por Produtividade
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costData}>
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
                      dataKey={politician.nome}
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