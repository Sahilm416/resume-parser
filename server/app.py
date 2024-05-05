from fastapi import FastAPI, HTTPException
from upstash_vector import Index
from typing import Dict
# import os
# from os import getenv
# from dotenv import load_dotenv
# load_dotenv()
app = FastAPI()


# URL = os.getenv("Url")
# Token = os.getenv("Token")



# index = Index(url=URL, token=Token)


@app.get("/")
def home():
    return {"message": "Backend working..."}

# @app.post("/upsert/")
# async def upsert_data(requestData: Dict):
#     try:
#         data_list = requestData["data"]
#         client_id = requestData["client"]
#         for data in data_list:
#             application_id = data.get("applicationId", "")
#             content = data.get("content", "")
#             index.upsert(
#                 vectors=[
#                     (f"{client_id}_{application_id}", content, {"clientID": client_id, "applicationId": application_id, "content": content}),
#                 ]
#             )
#         return {"message": "Data upserted successfully"}
#     except KeyError as e:
#         raise HTTPException(status_code=400, detail=f"Missing required key: {e}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/query/")
# async def query_data(requestData: Dict):
#     try:
#         client=requestData["client"]
#         data = requestData["data"]
#         result = index.query(
#             data=data,
#             top_k=5,
#             include_vectors=False,
#             include_metadata=True
#         )
        
#         info=[]
#         for chunk in result:
#             if chunk.metadata.get("clientID") == client:
#                 temp={"Application_id":chunk.metadata.get("applicationId"),"Score":chunk.score,"Content":chunk.metadata.get("content")}
#             else:
#                 return {"result":"NO data found"}
#             info.append(temp)
#         return {"result":info}
#     except KeyError as e:
#         raise HTTPException(status_code=400, detail=f"Missing required key: {e}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))