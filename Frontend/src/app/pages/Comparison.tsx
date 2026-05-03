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

  const getCellClass = (value: number, values: number[], higherIsBetter: boolean) => {
    if (values.length < 2) return "";
    const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
    const worst = higherIsBetter ? Math.min(...values) : Math.max(...values);
    if (value === best) return "text-green-600 font-bold";
    if (value === worst) return "text-red-500";
    return "";
  };

  const getRank = (value: number, values: number[], higherIsBetter: boolean) => {
    const sorted = [...values].sort((a, b) => (higherIsBetter ? b - a : a - b));
    return sorted.indexOf(value) + 1;
  };

  const comparisonData = [
    {
      metric: "Proposições",
      ...Object.fromEntries(selectedPoliticians.map((p) => [p.nome, p.proposicoes])),
    },
    {
      metric: "Presença",
      ...Object.fromEntries(selectedPoliticians.map((p) => [p.nome, p.presenca])),
    },
    {
      metric: "Score",
      ...Object.fromEntries(selectedPoliticians.map((p) => [p.nome, p.score_produtividade])),
    },
  ];

  const expenseData = [
    {
      metric: "Gasto Total (R$ mil)",
      ...Object.fromEntries(selectedPoliticians.map((p) => [p.nome, p.gasto_total / 1000])),
    },
  ];

  const costData = [
    {
      metric: "Custo por Unidade",
      ...Object.fromEntries(
        selectedPoliticians.map((p) => [
          p.nome,
          p.score_produtividade > 0 ? p.gasto_total / p.score_produtividade : 0,
        ])
      ),
    },
  ];

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const tableMetrics = [
    {
      label: "Score",
      values: selectedPoliticians.map((p) => p.score_produtividade),
      format: (v: number) => v.toString(),
      higherIsBetter: true,
    },
    {
      label: "Proposições",
      values: selectedPoliticians.map((p) => p.proposicoes),
      format: (v: number) => v.toString(),
      higherIsBetter: true,
    },
    {
      label: "Presença",
      values: selectedPoliticians.map((p) => p.presenca),
      format: (v: number) => v.toString(),
      higherIsBetter: true,
    },
    {
      label: "Gasto Total",
      values: selectedPoliticians.map((p) => p.gasto_total),
      format: (v: number) =>
        `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      higherIsBetter: false,
    },
    {
      label: "Custo por Unidade",
      values: selectedPoliticians.map((p) =>
        p.score_produtividade > 0 ? p.gasto_total / p.score_produtividade : 0
      ),
      format: (v: number) =>
        `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      higherIsBetter: false,
    },
  ];

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
                      <p className="font-medium text-gray-900">{politician.nome}</p>
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
              {selectedPoliticians.map((politician, index) => (
                <div
                  key={politician.id}
                  className="relative p-4 border rounded-lg overflow-hidden"
                  style={{ borderColor: colors[index % colors.length] + "50" }}
                >
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <button
                    onClick={() => removePolitician(String(politician.id))}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3 pl-2">
                    <img
                      src={politician.uri_foto || "https://via.placeholder.com/64"}
                      alt={politician.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{politician.nome}</h3>
                      <p className="text-sm text-blue-600">{politician.sigla_partido}</p>
                      <p className="text-sm text-gray-600">{politician.sigla_uf}</p>
                    </div>
                    <ScoreIndicator score={politician.score_produtividade} size="sm" />
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
            {/* Tabela com destaque e ranking */}
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
                      {selectedPoliticians.map((politician, index) => (
                        <th key={politician.id} className="text-left py-3 px-4 font-semibold text-gray-900">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            {politician.nome}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableMetrics.map(({ label, values, format, higherIsBetter }) => (
                      <tr key={label} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-600">{label}</td>
                        {values.map((value, index) => (
                          <td key={index} className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold text-gray-900 ${getCellClass(value, values, higherIsBetter)}`}>
                                {format(value)}
                              </span>
                              <span className="text-xs text-gray-400">
                                #{getRank(value, values, higherIsBetter)}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                <span className="text-green-600 font-semibold">Verde</span> = melhor ·{" "}
                <span className="text-red-500 font-semibold">Vermelho</span> = pior ·{" "}
                # = posição no ranking entre os selecionados
              </p>
            </div>

            {/* Comparação de Desempenho */}
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

            {/* Comparação de Gastos */}
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

            {/* Comparação de Custo por Produtividade */}
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
