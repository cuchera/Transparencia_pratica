import json
import os
import requests

BASE_URL = "https://dadosabertos.camara.leg.br/api/v2"
CACHE_GASTOS = "cache/gastos.json"

os.makedirs("cache", exist_ok=True)

def carregar_cache_gastos():
    if os.path.exists(CACHE_GASTOS):
        try:
            with open(CACHE_GASTOS, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Erro ao ler cache: {e}")
    return {}

def cache_existe():
    if not os.path.exists(CACHE_GASTOS):
        return False

    try:
        with open(CACHE_GASTOS, "r", encoding="utf-8") as f:
            data = json.load(f)
        return bool(data)
    except:
        return False

def obter_gastos_por_categoria(id_deputado: int) -> dict:
    """Retorna os gastos do deputado agrupados por categoria."""
    url = f"{BASE_URL}/deputados/{id_deputado}/despesas?itens=100"
    categorias = {}

    while url:
        resp = requests.get(url)
        if resp.status_code != 200:
            print(f"❌ Erro ao buscar despesas do deputado {id_deputado}")
            break

        data = resp.json()

        for despesa in data.get("dados", []):
            tipo = despesa.get("tipoDespesa", "OUTROS")
            valor = float(despesa.get("valorLiquido", 0.0))
            categorias[tipo] = categorias.get(tipo, 0) + valor

        url = next((link["href"] for link in data.get("links", []) if link["rel"] == "next"), None)

    return categorias

def atualizar_todos_os_gastos(forcar: bool = False):
    """Atualiza o cache de gastos por categoria de TODOS os deputados."""
    from services.camara_service import listar_deputados_cache

    # 🔥 NOVO: usa cache se já existir
    if not forcar and cache_existe():
        print("📂 Cache de gastos encontrado. Usando dados salvos.")
        return carregar_cache_gastos()

    deputados = listar_deputados_cache()
    gastos_cache = {}

    print("🔄 Atualizando gastos dos deputados...")

    for d in deputados:
        id_deputado = d["id"]
        nome = d["nome"]
        print(f"📥 Atualizando: {nome} (ID {id_deputado})")

        gastos_por_categoria = obter_gastos_por_categoria(id_deputado)
        gastos_cache[str(id_deputado)] = gastos_por_categoria

    with open(CACHE_GASTOS, "w", encoding="utf-8") as f:
        json.dump(gastos_cache, f, ensure_ascii=False, indent=2)

    print("✅ Cache de gastos atualizado com sucesso!")
    return gastos_cache
