from modal import Stub, build, enter, method, web_endpoint,Image
from typing import Dict
import os
import modal
application_id_dict={}
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

    if client_id in application_id_dict:
        current_application_id = application_id_dict[client_id]
    else:
        current_application_id = 0
        application_id_dict[client_id] = current_application_id
        
    index = Index(url=URL, token=Token)
    for data in data_list:
        application_id = data.get("applicationId", "")
        content = data.get("content", "")
        information=f"{client_id}{application_id}{content}"
        index.upsert(
            vectors=[
                    (f"{client_id}_{current_application_id}", information, {"clientID": client_id, "applicationId": current_application_id, "content": content}),
                ]
            )
        application_id_dict[client_id] += 1
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
        data=f"{client}{data}"
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

