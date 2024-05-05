from fastapi import FastAPI, HTTPException
from upstash_vector import Index
from typing import Dict
import os
from os import getenv
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()


URL = os.getenv("Url")
Token = os.getenv("Token")



index = Index(url=URL, token=Token)

@app.post("/upsert/")
async def upsert_data(requestData: Dict):
    try:
        data = requestData["data"]  
        clientId = requestData["client"]
        applicationId = data.get("applicationId", "")
        content = data.get("content", "")
        index.upsert(
            vectors=[
                ("id1", content, {"clientID": clientId, "applicationId": applicationId, "content": content}),
            ]
        )
        return {"message": "Data upserted successfully"}
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required key: {e}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data format: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query/")
async def query_data(requestData: Dict):
    try:
        data = requestData["data"]
        result = index.query(
            data=data,
            top_k=5,
            include_vectors=False,
            include_metadata=True
        )
        content = result[0]
        content = content.metadata.get('content')
        return {"content": content}
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required key: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
