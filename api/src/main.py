from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware


class Node(BaseModel):
    tag: str
    text: str
    id: int
    parents: list = []  # ? id list
    children: list = []  # ? id list


class Relation(BaseModel):
    a: int  # ? id
    b: int  # ? id
    relation: str


class Object(BaseModel):
    nodes: list = []
    relations: list = []
    documentText: str = ""

    def findNode(self, id):
        for i in self.nodes:
            if i["id"] == id:
                return i


app = FastAPI()

origins = ["*"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.add_middleware(HTTPSRedirectMiddleware)


@app.get("/")
async def main():
    return {"message": "Hello World"}


#! Asıl çalılacak yer
@app.post("/recommendation")
async def recommend(objects: Object):

    # ? Objeler ile burada istenilen yapılabilir
    # print(objects.nodes[0])
    # for i in objects.nodes:
    # if i["id"] == 872519:
    # break
    #
    # print(i["text"])

    # ? Response
    headers = {"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*"}

    # name1 = ""
    # name2 = ""

    # for i in objects.nodes:
    #     if i["id"] == objects.relations[0]["a"]:
    #         name1 = i["text"]
    #         break

    # for i in objects.nodes:
    #     if i["id"] == objects.relations[0]["b"]:
    #         name2 = i["text"]
    #         break

    name1 = objects.findNode(objects.relations[0]["a"])["text"]
    name2 = objects.findNode(objects.relations[0]["b"])["text"]

    # text = objects.relations[0]["a"] + "--- " + objects.relations[0]["relation"] + " ---" + objects.relations[0]["b"]
    text = name1 + " --- " + objects.relations[0]["relation"] + " --- " + \
        name2 + "<br>" + objects.nodes[0]["tag"] + " " + objects.nodes[0]["text"] + "<br>" + objects.documentText[0:10]
    content = {"recommendation": str(text)}  # ! EKRANA BASILACAK YER

    return JSONResponse(content=content, headers=headers)


#! Girdi yapılan yer
@app.post("/connect")
async def connect(objects: Object):

    with open("recommendation.txt", "w") as f:
        f.write(str(objects.documentText))
        f.close()

    # ? Objeler ile burada istenilen yapılabilir
    # print(objects.nodes[0])
    # for i in objects.nodes:
    # if i["id"] == 872519:
    # break
    #
    # print(i["text"])

    # ? uvicorn main:app --reload
