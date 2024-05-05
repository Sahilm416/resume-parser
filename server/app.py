# api to get client information
from fastapi import FastAPI
from pydantic import BaseModel
from model import startModel  # Correct import




class InputModel(BaseModel):
    query: str
    url: str

app = FastAPI()

@app.post('/')
async def test_api(payload: InputModel):
    res = await startModel(payload.url, payload.query)
    return {"result": res}

@app.get('/')
async def home():
    return {"message": "working"}