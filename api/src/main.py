from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


class Objects(BaseModel):
    nodes: list = []
    relations: list = []


app = FastAPI()

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
async def test(objects: Objects):
    print(objects)
    # return {object.tag: object.text}
    return None

# ? uvicorn main:app --reload
