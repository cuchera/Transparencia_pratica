from pydantic import BaseModel
from typing import Dict

class Deputado(BaseModel):
    id: int
    nome: str
    sigla_partido: str
    sigla_uf: str
    uri_foto: str
    gastos_por_categoria: Dict[str, float]