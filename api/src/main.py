from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class TestObject(BaseModel):
    tag: str
    text: str


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
async def test(object: TestObject):
    print({object.tag: object.text})
    return {object.tag: object.text}

# ? uvicorn main:app --reload
