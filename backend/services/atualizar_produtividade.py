import json
import os
import requests

BASE_URL = "https://dadosabertos.camara.leg.br/api/v2"
CACHE_PROD = "cache/produtividade.json"

os.makedirs("cache", exist_ok=True)


def get_proposicoes(id_deputado):
    url = f"{BASE_URL}/proposicoes?idDeputado={id_deputado}"
    total = 0

    while url:
        resp = requests.get(url)
        data = resp.json()

        total += len(data.get("dados", []))

        url = next((l["href"] for l in data.get("links", []) if l["rel"] == "next"), None)

    return total


def get_presenca(id_deputado):
    url = f"{BASE_URL}/deputados/{id_deputado}/presencas"

    total = 0
    presentes = 0

    while url:
        resp = requests.get(url)
        data = resp.json()

        for item in data.get("dados", []):
            for dia in item.get("dias", []):
                total += 1
                if dia.get("presenca") == "Presente":
                    presentes += 1

        url = next((l["href"] for l in data.get("links", []) if l["rel"] == "next"), None)

    return presentes / total if total > 0 else 0


def atualizar_produtividade():
    from services.camara_service import listar_deputados_cache

    deputados = listar_deputados_cache()
    produtividade_cache = {}

    print("🔄 Atualizando produtividade...")

    for d in deputados:
        id_dep = d["id"]
        nome = d["nome"]

        print(f"📥 {nome}")

        proposicoes = get_proposicoes(id_dep)
        presenca = get_presenca(id_dep)

        produtividade_cache[str(id_dep)] = {
            "proposicoes": proposicoes,
            "presenca": presenca
        }

    with open(CACHE_PROD, "w", encoding="utf-8") as f:
        json.dump(produtividade_cache, f, indent=2)

    print("✅ Produtividade atualizada!")