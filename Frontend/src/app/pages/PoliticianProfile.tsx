import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  FileText,
  Users,
  DollarSign,
  Globe,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  ClipboardList,
  GraduationCap,
  Home,
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
  const [avgProposicoes, setAvgProposicoes] = useState<number | null>(null);
  const [avgPresenca, setAvgPresenca] = useState<number | null>(null);
  const [avgCustoUnidade, setAvgCustoUnidade] = useState<number | null>(null);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [scoreRank, setScoreRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatBirthdate = (birthdate?: string) => {
    if (!birthdate) return "Não informado";
    const date = new Date(birthdate);
    if (Number.isNaN(date.getTime())) return "Não informado";

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return `${date.toLocaleDateString("pt-BR")} (${age} anos)`;
  };

  const getSocialIcon = (url: string) => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
      return <Twitter className="w-5 h-5 text-blue-500" />;
    }
    if (lowerUrl.includes('facebook.com')) {
      return <Facebook className="w-5 h-5 text-blue-600" />;
    }
    if (lowerUrl.includes('instagram.com')) {
      return <Instagram className="w-5 h-5 text-pink-500" />;
    }
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return <Youtube className="w-5 h-5 text-red-500" />;
    }
    if (lowerUrl.includes('linkedin.com')) {
      return <Linkedin className="w-5 h-5 text-blue-700" />;
    }
    if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me')) {
      return <MessageCircle className="w-5 h-5 text-green-500" />;
    }
    
    // Default para outros sites
    return <Globe className="w-5 h-5 text-blue-600" />;
  };

  const getGaugeAngle = (score: number) => {
    const normalized = Math.max(0, Math.min(100, score));
    return normalized * 1.8 - 90;
  };

  const generateSparklinePath = (values: number[], width: number, height: number): string => {
    if (values.length < 2) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || max || 1;
    const pad = 4;
    const points = values.map((v, i) => ({
      x: (i / (values.length - 1)) * width,
      y: height - pad - ((v - min) / range) * (height - pad * 2),
    }));
    return points.reduce((path, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const cpx = (prev.x + pt.x) / 2;
      return `${path} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`;
    }, '');
  };


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
        if (data.length > 0) {
          const avg = data.reduce((sum, p) => sum + p.proposicoes, 0) / data.length;
          setAvgProposicoes(Math.round(avg * 10) / 10);
          const avgP = data.reduce((sum, p) => sum + p.presenca, 0) / data.length;
          setAvgPresenca(Math.round(avgP * 10) / 10);
          const custos = data.filter(p => p.score_produtividade > 0).map(p => p.gasto_total / p.score_produtividade);
          const avgC = custos.reduce((sum, v) => sum + v, 0) / custos.length;
          setAvgCustoUnidade(Math.round(avgC * 100) / 100);
          const avgS = data.reduce((sum, p) => sum + p.score_produtividade, 0) / data.length;
          setAvgScore(Math.round(avgS * 10) / 10);
          const sorted = [...data].sort((a, b) => b.score_produtividade - a.score_produtividade);
          const rank = sorted.findIndex(p => String(p.id) === String(id)) + 1;
          setScoreRank(rank);
        }
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
            Voltar para Tela Inicial
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
            Voltar para Tela Inicial
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

  const sparklineValues = (() => {
    const sorted = [...gastosPorCategoria.map(([, v]) => v)].sort((a, b) => a - b);
    const wave: number[] = [];
    let lo = 0, hi = sorted.length - 1, toggle = true;
    while (lo <= hi) {
      wave.push(toggle ? sorted[lo++] : sorted[hi--]);
      toggle = !toggle;
    }
    return wave;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Tela Inicial
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-4 border-blue-200 bg-white p-1 shadow-lg">
                <img
                  src={politician.uri_foto || "https://via.placeholder.com/128"}
                  alt={politician.nome}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

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
                  <span>
                    <span className="font-medium">Estado:</span> {politician.sigla_uf}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>
                    <span className="font-medium">Local de Nascimento:</span>{" "}
                    {politician.municipio_nascimento || "Não informado"}
                    {politician.uf_nascimento ? ` - ${politician.uf_nascimento}` : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>
                    <span className="font-medium">Cargo:</span> Deputado Federal
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    <span className="font-medium">Data de nascimento:</span>{" "}
                    {formatBirthdate(politician.data_nascimento)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>
                    <span className="font-medium">Escolaridade:</span>{" "}
                    {politician.escolaridade || "Não informado"}
                  </span>
                </div>
            </div>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Proposições</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.proposicoes}
            </p>
            {avgProposicoes !== null && (() => {
              const diff = ((politician.proposicoes - avgProposicoes) / avgProposicoes) * 100;
              const isAbove = diff >= 0;
              return (
                <p className="text-xs text-gray-400 mt-1">
                  Média: {avgProposicoes}{" | "}
                  <span className={isAbove ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {isAbove ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </p>
              );
            })()}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Presença</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {politician.presenca}
            </p>
            {avgPresenca !== null && (() => {
              const diff = ((politician.presenca - avgPresenca) / avgPresenca) * 100;
              const isAbove = diff >= 0;
              return (
                <p className="text-xs text-gray-400 mt-1">
                  Média: {avgPresenca}{" | "}
                  <span className={isAbove ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {isAbove ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </p>
              );
            })()}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Custo por Unidade</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              R${" "}
              {costPerProductivity.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {avgCustoUnidade !== null && (() => {
              const diff = ((costPerProductivity - avgCustoUnidade) / avgCustoUnidade) * 100;
              const isAbove = diff >= 0;
              return (
                <p className="text-xs text-gray-400 mt-1">
                  Média: R$ {avgCustoUnidade.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" | "}
                  <span className={isAbove ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                    {isAbove ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </p>
              );
            })()}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">S</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">Score de Produtividade</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-3xl font-semibold text-gray-900">
                {politician.score_produtividade}
              </p>
              <div className="w-full max-w-[90px]">
                <svg viewBox="0 0 200 115" className="w-full h-full">
                  <path
                    d="M 20 105 A 80 80 0 0 1 60 35.7"
                    fill="none"
                    stroke="#fca5a5"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 35.7 A 80 80 0 0 1 140 35.7"
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 140 35.7 A 80 80 0 0 1 180 105"
                    fill="none"
                    stroke="#86efac"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <line
                    x1="100"
                    y1="105"
                    x2="100"
                    y2="32"
                    stroke="#1e293b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${getGaugeAngle(politician.score_produtividade)} 100 105)`}
                  />
                  <circle cx="100" cy="105" r="7" fill="#1e293b" />
                  <circle cx="100" cy="105" r="3" fill="white" />
                  <text x="14" y="120" textAnchor="middle" fontSize="12" fill="#9ca3af">0</text>
                  <text x="186" y="120" textAnchor="middle" fontSize="12" fill="#9ca3af">100</text>
                </svg>
              </div>
            </div>
            {avgScore !== null && (() => {
              const diff = ((politician.score_produtividade - avgScore) / avgScore) * 100;
              const isAbove = diff >= 0;
              return (
                <p className="text-xs text-gray-400 mt-1">
                  Média: {avgScore}{" | "}
                  <span className={isAbove ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {isAbove ? "+" : ""}{diff.toFixed(1)}%
                  </span>
                </p>
              );
            })()}
            {scoreRank !== null && (
              <p className="text-xs text-gray-400 mt-0.5">#{scoreRank} no ranking</p>
            )}
          </div>
        </div>


        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Gasto Total
          </h2>
          <div className="flex items-end justify-between gap-4">
            <p className="text-3xl font-semibold text-gray-900">
              R${" "}
              {politician.gasto_total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {sparklineValues.length >= 2 && (
              <div className="ml-auto w-[220px]">
                <svg viewBox="0 0 300 54" className="w-full h-16">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${generateSparklinePath(sparklineValues, 300, 50)} L 300 54 L 0 54 Z`}
                    fill="url(#sparkGrad)"
                  />
                  <path
                    d={generateSparklinePath(sparklineValues, 300, 50)}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gastos por Categoria
          </h2>

          {gastosPorCategoria.length > 0 ? (
            <div className="space-y-3">
              {gastosPorCategoria.map(([categoria, valor]) => (
                  <div key={categoria} className="flex items-center gap-4 border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600 flex-1 min-w-0">{categoria}</span>
                    <div className="w-[500px] shrink-0 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(valor / politician.gasto_total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-32 text-right shrink-0">
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
              Redes Sociais e Contatos
            </h2>

            <div className="space-y-3">
              {politician.rede_social.map((rede, index) => (
                <a
                  key={index}
                  href={rede}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {getSocialIcon(rede)}
                  <span className="text-blue-600 hover:text-blue-700 truncate">
                    {rede}
                  </span>
                </a>
              ))}
              
              {politician.url_website && (
                <a
                  href={politician.url_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="text-blue-600 hover:text-blue-700 truncate">
                    {politician.url_website}
                  </span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}