import requests
import json
import os

BASE_URL = "https://dadosabertos.camara.leg.br/api/v2"
CACHE_DEPUTADOS = "cache/deputados.json"

def listar_deputados_cache():
    """Busca todos os deputados da API da Câmara e salva em cache local."""
    os.makedirs("cache", exist_ok=True)

    if os.path.exists(CACHE_DEPUTADOS) and os.path.getsize(CACHE_DEPUTADOS) > 0:
        try:
            with open(CACHE_DEPUTADOS, "r", encoding="utf-8") as f:
                print("📂 Carregando deputados do cache local...")
                return json.load(f)
        except json.JSONDecodeError:
            print("⚠️ Cache corrompido. Recriando cache...")

    deputados = []
    url = f"{BASE_URL}/deputados?itens=100"

    while url:
        print(f"📥 Buscando: {url}")
        try:
            resp = requests.get(url)
            resp.raise_for_status()
        except requests.RequestException as e:
            print(f"❌ Erro na requisição: {e}")
            break

        data = resp.json()
        deputados.extend(data.get("dados", []))
        url = next((l["href"] for l in data.get("links", []) if l["rel"] == "next"), None)

    with open(CACHE_DEPUTADOS, "w", encoding="utf-8") as f:
        json.dump(deputados, f, ensure_ascii=False, indent=2)

    print(f"✅ Total de deputados salvos: {len(deputados)}")
    return deputados
