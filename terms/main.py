from fastapi import FastAPI
from pydantic import BaseModel

from tokens import get_tokens_with_terms
from analysis import analyze
from distance import calc_distance_for_doc


class TokenizeData(BaseModel):
    terms: list
    text: str


class AnalyzeData(BaseModel):
    text: str


class DistanceData(BaseModel):
    block: dict


app = FastAPI()


@app.post("/tokenize")
def post_tokenize(data: TokenizeData):
    return get_tokens_with_terms(data.terms, data.text)


@app.post("/analyze")
def post_analyze(data: AnalyzeData):
    return analyze(data.text)


@app.post("/distance")
def post_distance(data: DistanceData):
    return calc_distance_for_doc(data.block)
