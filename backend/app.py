from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from model import PdfGPT
from postgres_db import PdfGPTPostgresDatabase
import os
load_dotenv()

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_methods=["*"], allow_origins=["*"])

model = PdfGPT(os.environ["GOOGLE_API_KEY"])
db = PdfGPTPostgresDatabase()

class QuestionModel(BaseModel):
    question:str
    chat_id:str
    chat_history:str

@app.post("/upload_file")
async def upload_file(file:UploadFile, chat_id:str):
    try:
        stream = await file.read()
        model.add_binary_pdf(stream,chat_id,file.filename)
        db.insert_file(chat_id, file.filename)
        return {"status":True, "response":"File Uploaded Successfully"}

    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/ask_question")
def ask_question(data:QuestionModel):
    try:
        print(data)
        response = model.ask_question(chat_id=data.chat_id, q=data.question, chat_history_str=data.chat_history)
        print(response)
        db.insert_chat(data.chat_id, data.question, response["result"])
        print("Data Inserted")
        return {"status":True, "response":response["result"]}
    
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/rename_chat_id")
def rename_chat_id(old_chat_id:str, new_chat_id:str):
    try:
        model.rename_chat_id(old_chat_id,new_chat_id)
        db.rename_chat_id(old_chat_id, new_chat_id)
        return {"status":True, "response":"Chat Id renamed successfully"}
    
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.get("/get_all_chat_ids")
def get_all_chats_ids():
    try:
        if(not os.path.exists("./faiss_indexes")):
            return {"status":True, "response":[]}
        array = os.listdir("./faiss_indexes")
        return {"status":True, "response":array}
    
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/get_all_chats")
def get_all_chats(chat_id:str):
    try:
        data = db.list_all_chats(chat_id)
        return {"status":True, "response":data}
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/get_all_files")
def get_all_files(chat_id:str):
    try:
        data = db.list_all_files(chat_id)
        return {"status":True, "response":data}
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/delete_chat")
def delete_chat(chat_id:str):
    try:
        db.delete_chat(chat_id)
        model.delete_chat(chat_id)
        return {"status":True, "response":"Chat deleted"}
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/chat_exists")
def chat_exists(chat_id:str):
    try:
        array = os.listdir("./faiss_indexes")
        if(chat_id in array):
            return {"status":False, "response":True}
        return {"status":False, "response":False}    
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}

@app.post("/new_chat")
def new_chat(chat_id:str):
    try:
        model.create_new_chat(chat_id)
        return {"status":True, "response":"New Chat created"}
    except Exception as e:
        return {"status":False, "response":"Error Occured", "exception":e}
        
        
        
    
        