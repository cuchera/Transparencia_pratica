from fastapi import FastAPI, Query
from typing import Optional
from models.deputado import Deputado
from services.camara_service import listar_deputados_cache
from apscheduler.schedulers.background import BackgroundScheduler
from services.atualizar_gastos import atualizar_todos_os_gastos
from services.atualizar_produtividade import atualizar_produtividade
from services.metricas import custo_por_produtividade
import json, os

app = FastAPI(title="API Transparência Parlamentar")

CACHE_GASTOS = "cache/gastos.json"

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(atualizar_todos_os_gastos, "interval", hours=24)
    scheduler.add_job(atualizar_produtividade, "interval", hours=24)
    scheduler.start()
    print("⏱️ Scheduler iniciado! Atualização automática habilitada.")


@app.on_event("startup")
def startup_event():
    print("🚀 API iniciada!")

    listar_deputados_cache()
    atualizar_todos_os_gastos()
    atualizar_produtividade()
    
    start_scheduler()

@app.get("/deputados", response_model=list[Deputado])
def get_deputados(
    nome: Optional[str] = Query(None),
    ordenar_por_gastos: bool = Query(False),
    limite: int = Query(999)
):
    deputados_data = listar_deputados_cache()

    if os.path.exists(CACHE_GASTOS) and os.path.getsize(CACHE_GASTOS) > 0:
        with open(CACHE_GASTOS, "r", encoding="utf-8") as f:
            gastos_cache = json.load(f)
    else:
        gastos_cache = {}

    deputados = []

    for d in deputados_data:
        if nome and nome.lower() not in d["nome"].lower():
            continue

        categorias = gastos_cache.get(str(d["id"]), {})
        gastos_rounded = {k: round(float(v), 2) for k, v in categorias.items()}

        deputados.append(
            Deputado(
                id=d["id"],
                nome=d["nome"],
                sigla_partido=d["siglaPartido"],
                sigla_uf=d["siglaUf"],
                uri_foto=d["urlFoto"],
                gastos_por_categoria=gastos_rounded
            )
        )

    if ordenar_por_gastos:
        deputados.sort(
            key=lambda x: sum(x.gastos_por_categoria.values()),
            reverse=True
        )

    return deputados[:limite]

@app.get("/deputado/{id}/metricas")
def metricas(id: int):
    return custo_por_produtividade(id)