import json
import os

CACHE_GASTOS = "cache/gastos.json"
CACHE_PROD = "cache/produtividade.json"


def carregar_json(path):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def custo_por_produtividade(id_deputado):

    gastos_cache = carregar_json(CACHE_GASTOS)
    prod_cache = carregar_json(CACHE_PROD)

    gastos = gastos_cache.get(str(id_deputado), {})
    produtividade = prod_cache.get(str(id_deputado), {})

    gasto_total = sum(gastos.values())

    proposicoes = produtividade.get("proposicoes", 0)
    presenca = produtividade.get("presenca", 0)

    # 🔥 índice composto
    score_produtividade = (proposicoes + (presenca * 10))

    if score_produtividade == 0:
        return None

    return {
        "gasto_total": gasto_total,
        "proposicoes": proposicoes,
        "presenca": presenca,
        "custo_por_produtividade": gasto_total / score_produtividade
    }