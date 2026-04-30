from pydantic import BaseModel
from typing import Dict, List, Optional


class Deputado(BaseModel):
    id: int
    nome: str
    sigla_partido: str
    sigla_uf: str
    uri_foto: str

    gastos_por_categoria: Dict[str, float]
    gasto_total: float = 0.0

    proposicoes: int = 0
    presenca: int = 0
    score_produtividade: int = 0

    escolaridade: Optional[str] = None
    data_nascimento: Optional[str] = None
    municipio_nascimento: Optional[str] = None
    uf_nascimento: Optional[str] = None
    rede_social: List[str] = []
    url_website: Optional[str] = None