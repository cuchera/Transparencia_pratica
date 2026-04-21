import { useState, useMemo, useEffect } from "react";
import { FilterBar } from "../components/FilterBar";
import { PoliticianCard } from "../components/PoliticianCard";
import { states, parties, positions, years } from "../data/mockData";

const API_URL = import.meta.env.VITE_API_URL;

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedParty, setSelectedParty] = useState("All Parties");
  const [selectedPosition, setSelectedPosition] = useState("All Positions");
  const [selectedYear, setSelectedYear] = useState("2025");

  const [politicians, setPoliticians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/deputados?ano=${selectedYear}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar dados do backend");
        }
        return res.json();
      })
      .then((data) => {
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

  const filteredPoliticians = useMemo(() => {
    return politicians.filter((politician) => {
      const matchesSearch = politician.nome
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesState =
        selectedState === "All States" ||
        politician.sigla_uf === selectedState;

      const matchesParty =
        selectedParty === "All Parties" ||
        politician.sigla_partido === selectedParty;

      const matchesPosition =
        selectedPosition === "All Positions" ||
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
            Political Representatives
          </h1>
          <p className="text-gray-600">
            Search and analyze public officials based on transparency and
            performance data
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
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            states={states}
            parties={parties}
            positions={positions}
            years={years}
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
            <p className="text-gray-500">Loading data...</p>
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
              No politicians found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}