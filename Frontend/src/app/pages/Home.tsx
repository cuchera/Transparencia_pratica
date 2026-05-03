import { useState, useMemo, useEffect } from "react";
import { FilterBar } from "../components/FilterBar";
import { PoliticianCard } from "../components/PoliticianCard";
import { states, parties, positions } from "../data/mockData";

const API_URL = import.meta.env.VITE_API_URL;

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  const [politicians, setPoliticians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('API_URL:', API_URL);
    const url = `${API_URL}/deputados`;
    console.log('Fetch URL:', url);
    setLoading(true);
    setError("");

    fetch(url)
      .then((res) => {
        console.log('Fetch response status:', res.status);
        console.log('Response ok:', res.ok);
        if (!res.ok) {
          throw new Error(`Erro ao buscar dados do backend: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Data loaded:', data.length);
        setPoliticians(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError("Não foi possível carregar os dados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const filteredPoliticians = useMemo(() => {
    return politicians.filter((politician) => {
      const matchesSearch = politician.nome
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesState =
        selectedState === "" ||
        politician.sigla_uf === selectedState;

      const matchesParty =
        selectedParty === "" ||
        politician.sigla_partido === selectedParty;

      const matchesPosition =
        selectedPosition === "" ||
        selectedPosition === "Deputado Federal";

      return matchesSearch &&
      matchesState &&
      matchesParty &&
      matchesPosition;
    });
  }, [politicians, searchQuery, selectedState, selectedParty, selectedPosition,]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Representantes Políticos
          </h1>
          <p className="text-gray-600">
            Pesquisar e analisar funcionários públicos com base em dados de transparência e desempenho.
          </p>
        </div>

        <div className="mb-6">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedParty={selectedParty}
            setSelectedParty={setSelectedParty}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            states={states}
            parties={parties}
            positions={positions}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredPoliticians.length} result
            {filteredPoliticians.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading && (
          <div className="py-8">
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        )}

        {error && (
          <div className="py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPoliticians.map((politician) => (
              <PoliticianCard key={politician.id} politician={politician} />
            ))}
          </div>
        )}

        {!loading && !error && filteredPoliticians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Nenhum político encontrado que corresponda aos seus critérios.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}