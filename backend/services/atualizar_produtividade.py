import json
import os
import requests
from collections import defaultdict

CACHE_PROD = "cache/produtividade.json"
os.makedirs("cache", exist_ok=True)


def baixar_json(url: str):
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    return resp.json()


def normalizar_lista_json(data):
    """
    Alguns arquivos podem vir como lista direta,
    outros como dict com chave 'dados'.
    """
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        if "dados" in data and isinstance(data["dados"], list):
            return data["dados"]
    return []


def contar_proposicoes_por_deputado(ano: int) -> dict:
    """
    Lê o arquivo anual de autores de proposições e conta
    quantas proposições cada deputado possui.
    """
    url = (
        f"https://dadosabertos.camara.leg.br/arquivos/"
        f"proposicoesAutores/json/proposicoesAutores-{ano}.json"
    )

    print(f"📥 Baixando proposições/autores de {ano}...")
    data = baixar_json(url)
    registros = normalizar_lista_json(data)

    contagem = defaultdict(int)
    proposicoes_vistas = set()

    for item in registros:
        id_deputado = item.get("idDeputadoAutor")
        id_proposicao = item.get("idProposicao")

        if not id_deputado or not id_proposicao:
            continue

        chave_unica = (str(id_deputado), str(id_proposicao))

        # Evita contar a mesma proposição duas vezes para o mesmo deputado
        if chave_unica in proposicoes_vistas:
            continue

        proposicoes_vistas.add(chave_unica)
        contagem[str(id_deputado)] += 1

    return dict(contagem)


def contar_dias_presenca_por_deputado(ano: int) -> dict:
    url = (
        f"https://dadosabertos.camara.leg.br/arquivos/"
        f"eventosPresencaDeputados/json/eventosPresencaDeputados-{ano}.json"
    )

    print(f"📥 Baixando presenças de {ano}...")
    data = baixar_json(url)
    registros = normalizar_lista_json(data)

    presencas = defaultdict(set)

    for item in registros:
        id_deputado = item.get("idDeputado")
        data_hora = item.get("dataHoraInicio")

        if not id_deputado or not data_hora:
            continue

        dia = data_hora[:10]
        presencas[str(id_deputado)].add(dia)

    return {id_dep: len(dias) for id_dep, dias in presencas.items()}


def atualizar_produtividade(ano: int = 2026):
    from services.camara_service import listar_deputados_cache

    deputados = listar_deputados_cache()
    produtividade_cache = {}

    print("🔄 Atualizando produtividade...")

    proposicoes_por_dep = contar_proposicoes_por_deputado(ano)
    presencas_por_dep = contar_dias_presenca_por_deputado(ano)

    for d in deputados:
        id_dep = str(d["id"])
        nome = d["nome"]

        proposicoes = proposicoes_por_dep.get(id_dep, 0)
        presenca = presencas_por_dep.get(id_dep, 0)

        produtividade_cache[id_dep] = {
            "proposicoes": proposicoes,
            "presenca": presenca,
            "score": proposicoes + presenca
        }

        print(
            f"✅ {nome} | proposicoes={proposicoes} "
            f"| presenca={presenca} | score={proposicoes + presenca}"
        )

    with open(CACHE_PROD, "w", encoding="utf-8") as f:
        json.dump(produtividade_cache, f, ensure_ascii=False, indent=2)

    print("✅ Produtividade atualizada!")


if __name__ == "__main__":
    atualizar_produtividade(2026)