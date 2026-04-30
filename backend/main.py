from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from models.deputado import Deputado
from services.camara_service import listar_deputados_cache
from apscheduler.schedulers.background import BackgroundScheduler
from services.atualizar_gastos import atualizar_todos_os_gastos
from services.atualizar_produtividade import atualizar_produtividade
from services.metricas import custo_por_produtividade
import json, os

app = FastAPI(title="API Transparência Parlamentar")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE_GASTOS = "cache/gastos.json"
CACHE_PROD = "cache/produtividade.json"

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
    
    if os.path.exists(CACHE_PROD) and os.path.getsize(CACHE_PROD) > 0:
        with open(CACHE_PROD, "r", encoding="utf-8") as f:
            produtividade_cache = json.load(f)
    else:
        produtividade_cache = {}

    deputados = []

    for d in deputados_data:
        if nome and nome.lower() not in d["nome"].lower():
            continue

        categorias = gastos_cache.get(str(d["id"]), {})
        gastos_rounded = {k: round(float(v), 2) for k, v in categorias.items()}
        gasto_total = round(sum(gastos_rounded.values()), 2)

        produtividade = produtividade_cache.get(str(d["id"]), {})

        deputados.append(
            Deputado(
                id=d["id"],
                nome=d["nome"],
                sigla_partido=d["siglaPartido"],
                sigla_uf=d["siglaUf"],
                uri_foto=d["urlFoto"],
                gastos_por_categoria=gastos_rounded,
                gasto_total=gasto_total,
                proposicoes=produtividade.get("proposicoes", 0),
                presenca=produtividade.get("presenca", 0),
                score_produtividade=produtividade.get("score", 0),
                escolaridade=d.get("escolaridade"),
                data_nascimento=d.get("data_nascimento"),
                municipio_nascimento=d.get("municipio_nascimento"),
                uf_nascimento=d.get("uf_nascimento"),
                rede_social=d.get("rede_social", []),
                url_website=d.get("url_website"),
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