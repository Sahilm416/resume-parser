# api to get client information
from fastapi import FastAPI
from pydantic import BaseModel





class InputModel(BaseModel):
    query: str
    client: str

app = FastAPI()

@app.post('/')
async def test_api(payload: InputModel):
    return {"result": "helloo"}

@app.get('/')
async def home():
    return {"message": "working"}