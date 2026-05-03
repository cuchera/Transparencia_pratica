import requests
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

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

        print("⚡ Buscando detalhes dos deputados em paralelo...")

        deputados_completos = []

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(enriquecer_deputado, d) for d in deputados]

            for future in as_completed(futures):
                deputados_completos.append(future.result())

        deputados = deputados_completos

    with open(CACHE_DEPUTADOS, "w", encoding="utf-8") as f:
        json.dump(deputados, f, ensure_ascii=False, indent=2)

    print(f"✅ Total de deputados salvos: {len(deputados)}")
    return deputados

def obter_detalhes_deputado(id_deputado: int) -> dict:
    url = f"{BASE_URL}/deputados/{id_deputado}"

    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json().get("dados", {})

        return {
            "escolaridade": data.get("escolaridade"),
            "data_nascimento": data.get("dataNascimento"),
            "municipio_nascimento": data.get("municipioNascimento"),
            "uf_nascimento": data.get("ufNascimento"),
            "rede_social": data.get("redeSocial", []),
            "url_website": data.get("urlWebsite"),
        }
    

    except Exception as e:
        print(f"⚠️ Erro ao buscar detalhes {id_deputado}: {e}")
        return {}

def enriquecer_deputado(d):
    id_deputado = d["id"]
    detalhes = obter_detalhes_deputado(id_deputado)
    d.update(detalhes)

    print(d["nome"], d.get("escolaridade"), d.get("rede_social"))

    return d