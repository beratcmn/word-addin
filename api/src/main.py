from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel


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


@app.get("/")
async def main():
    return {"message": "Hello World"}


@app.post("/test")
async def test(objects: Object):

    # ? Objeler ile burada istenilen yapılabilir
    # print(objects.nodes[0])
    # for i in objects.nodes:
    # if i["id"] == 872519:
    # break
    #
    # print(i["text"])

    # ? Response
    headers = {"Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Origin": "*"}
    content = {"message": "Hello World"}  # ! EKRANA BASILACAK YER
    return JSONResponse(content=content, headers=headers)

# ? uvicorn main:app --reload
