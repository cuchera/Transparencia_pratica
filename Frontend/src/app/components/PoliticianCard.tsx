import { Link } from "react-router";
import { ScoreIndicator } from "./ScoreIndicator";
import { MapPin, Briefcase } from "lucide-react";

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

interface PoliticianCardProps {
  politician: Politician;
}

export function PoliticianCard({ politician }: PoliticianCardProps) {
  const costPerProductivity =
    politician.score_produtividade > 0
      ? politician.gasto_total / politician.score_produtividade
      : 0;

  return (
    <Link
      to={`/politician/${politician.id}`}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-4">
        <img
          src={politician.uri_foto || "https://via.placeholder.com/80"}
          alt={politician.nome}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{politician.nome}</h3>
          <p className="text-sm text-blue-600">{politician.sigla_partido}</p>

          <div className="flex gap-3 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{politician.sigla_uf}</span>
            </div>

            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>Deputado Federal</span>
            </div>
          </div>
        </div>

        <ScoreIndicator score={politician.score_produtividade} size="sm" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Productivity</p>
          <p className="font-semibold text-gray-900">
            {politician.proposicoes}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Attendance</p>
          <p className="font-semibold text-gray-900">
            {politician.presenca}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Cost/Unit</p>
          <p className="font-semibold text-gray-900">
            R$ {costPerProductivity.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}