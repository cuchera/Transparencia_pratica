import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ScoreIndicator } from "../components/ScoreIndicator";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  FileText,
  Users,
  DollarSign,
} from "lucide-react";

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
  escolaridade?: string;
  data_nascimento?: string;
  municipio_nascimento?: string;
  uf_nascimento?: string;
  rede_social?: string[];
  url_website?: string;
}

export function PoliticianProfile() {
  const { id } = useParams();
  const [politician, setPolitician] = useState<Politician | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

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
        const found = data.find((p) => String(p.id) === String(id));
        setPolitician(found || null);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar o perfil.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Erro ao carregar perfil
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  if (!politician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Político não encontrado
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  const costPerProductivity =
    politician.score_produtividade > 0
      ? politician.gasto_total / politician.score_produtividade
      : 0;

  const gastosPorCategoria = Object.entries(
    politician.gastos_por_categoria || {}
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={politician.uri_foto || "https://via.placeholder.com/128"}
              alt={politician.nome}
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                {politician.nome}
              </h1>
              <p className="text-xl text-blue-600 mb-4">
                {politician.sigla_partido}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{politician.sigla_uf}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Deputado Federal</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>Escolaridade:</span>
                  <span>{politician.escolaridade || "Não informado"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Nascimento:</span>
                  <span>
                    {politician.municipio_nascimento || "Não informado"}
                    {politician.uf_nascimento ? ` - ${politician.uf_nascimento}` : ""}
                  </span>
                </div>

              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <ScoreIndicator
                score={politician.score_produtividade}
                size="lg"
              />
              <p className="text-sm text-gray-600">Score de Produtividade</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Proposições</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.proposicoes}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Presença</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.presenca}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.score_produtividade}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Custo por Unidade</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              R${" "}
              {costPerProductivity.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gasto Total
          </h2>
          <p className="text-3xl font-semibold text-gray-900">
            R${" "}
            {politician.gasto_total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gastos por Categoria
          </h2>

          {gastosPorCategoria.length > 0 ? (
            <div className="space-y-3">
              {gastosPorCategoria.map(([categoria, valor]) => (
                <div
                  key={categoria}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <span className="text-sm text-gray-700">{categoria}</span>
                  <span className="font-medium text-gray-900">
                    R${" "}
                    {valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Sem dados de gastos por categoria.</p>
          )}
        </div>
        {politician.rede_social && politician.rede_social.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Redes Sociais
            </h2>

            <div className="flex flex-wrap gap-3">
              {politician.rede_social.map((rede, index) => (
                <a
                  key={index}
                  href={rede}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Rede {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
        {politician.url_website && (
          <a
            href={politician.url_website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Site oficial
          </a>
        )}
      </div>
    </div>
  );
}