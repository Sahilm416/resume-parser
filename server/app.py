from modal import Stub, build, enter, method, web_endpoint,Image
from typing import Dict
import os
import modal

image = Image.debian_slim().pip_install(
    "upstash_vector"

)
stub = Stub(name="resume-parser", image=image)

@stub.function(secrets=[modal.Secret.from_name("Url"), modal.Secret.from_name("Token")],timeout=1000)
@web_endpoint(label="upsert",method="POST")
def upsert_data(requestData: Dict):
    from upstash_vector import Index
    data_list = requestData["data"]
    client_id = requestData["client"]
        
    URL = os.environ["Url"] 
    Token = os.environ["Token"] 
        
    index = Index(url=URL, token=Token)
    for data in data_list:
        application_id = data.get("applicationId", "")
        content = data.get("content", "")
        index.upsert(
            vectors=[
                    (f"{client_id}_{application_id}", content, {"clientID": client_id, "applicationId": application_id, "content": content}),
                ]
            )
        return {"message": "Data upserted successfully"}

@stub.function()
@web_endpoint(label="match",method="POST")
def start_match(requestData: Dict):
    client=requestData["client"]
    data = requestData["data"]
    return (Model.query_data.remote(client,data))
    
    
@stub.cls(secrets=[modal.Secret.from_name("Url"), modal.Secret.from_name("Token")])
class Model:
    @build()
    @enter()
    def start_model(self):
        from upstash_vector import Index
        URL = os.environ["Url"] 
        Token = os.environ["Token"] 
        self.index = Index(url=URL, token=Token)

    @method()
    def query_data(self,client:str,data:str):
        result = self.index.query(
            data=data,
            top_k=5,
            include_vectors=False,
            include_metadata=True
        )
        
        info=[]
        for chunk in result:
            if chunk.metadata.get("clientID") == client:
                temp={"Application_id":chunk.metadata.get("applicationId"),"Score":chunk.score,"Content":chunk.metadata.get("content")}
            info.append(temp)
        if not info:
            return {"result":"NO data found"}
            
        return {"result":info}