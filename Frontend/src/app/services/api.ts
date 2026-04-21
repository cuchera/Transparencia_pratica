const API_URL = import.meta.env.VITE_API_URL;

export async function buscarDeputados(ano = 2025) {
  const response = await fetch(`${API_URL}/deputados?ano=${ano}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar deputados");
  }

  return response.json();
}