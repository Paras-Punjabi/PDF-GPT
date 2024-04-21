import os
import dotenv
import shutil
from pypdf import PdfReader
from io import BytesIO
from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.document_loaders.pdf import PyPDFLoader
from langchain_core.runnables import RunnablePassthrough

dotenv.load_dotenv()

class BinaryPDFRecursiveSplitter:
    def __init__(self,separators=["\n\n", "\n", ".", " "], chunk_size=1200, chunk_overlap=200):
        self.splitter = RecursiveCharacterTextSplitter(separators=separators,chunk_size=chunk_size,chunk_overlap=chunk_overlap)
        
    def split_pdf(self,stream):
        self.stream = BytesIO(stream)
        self.reader = PdfReader(self.stream)
        n = len(self.reader.pages)
        s = ""
        for i in range(n):
            text = self.reader.pages[i].extract_text()
            s+=text
        return self.splitter.split_text(s)

class PdfGPT:
    def __init__(self,api_key):
        self.llm = None
        self.embedding = None    
        self.sample_vectordb = None
        self.prompt = None
        self.create_llm_model(api_key)
        
    def create_llm_model(self, google_api_key=os.environ["GOOGLE_API_KEY"]):
        self.llm = GoogleGenerativeAI(model="gemini-pro",google_api_key=google_api_key, temperature=0.5)
        self.embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=google_api_key)
        
        self.sample_vectordb = FAISS.from_texts(texts=["Your name is PdfGPT. You are an AI assistant of pdf's. You are developed by Paras Punjabi. You can help users to extract data from pdf's and help them by answering some questions related to that pdf. You are supposed to answer related to data you have provided. You are not supposed to provide blank answers. If you don't know just say I don't know and justify your answer with generic reason, don't make things up or throw an unknown error. If user greets you by formal hello or by telling their name, greet as well. History of chat will be provided with the question only, if not assume there is not chat history between you two. Understand that chat history which is between you and the client and answer according to that chat and data you have been trained. Try to answer the questions in markdown format"], embedding=self.embedding)
        
        base_prompt = '''Your name is PdfGPT. You are an AI assistant of pdf's. You can help users to extract data from pdf's and help them by answering some questions related to that pdf. You are supposed to answer related to data you have provided. You are not supposed to provide blank answers. If you don't know just say I don't know and justify your answer with generic reason, don't make things up or throw an unknown error. If user greets you by formal hello or by telling their name, greet as well. History of chat will be provided with the question only, if not assume there is not chat history between you two. Understand that chat history which is between you and the client and answer according to that chat and data you have been trained. Try to answer the questions in markdown format.
        This is the context {context} 
        This is the question : {question}
        Provide only answer, don't use any prefixes.
        '''
        
        self.prompt = PromptTemplate(template=base_prompt, input_variables=["context", "question"])
    
    def add_binary_pdf(self,stream,chat_id, filename):
        vectordb = self.load_vectordb_from_local(chat_id)
        splitter = BinaryPDFRecursiveSplitter()
        docs = splitter.split_pdf(stream)
        
        vectordb.add_texts([f"The pdf file name is {filename} and content of pdf is below"])
        vectordb.add_texts(docs)
        self.save_vectordb(vectordb,chat_id)
            
    def add_pdf(self,pdf_path, chat_id):
        vectordb = self.load_vectordb_from_local(chat_id)
        filename = os.path.basename(pdf_path)
        loader = PyPDFLoader(file_path=pdf_path,extract_images=True)
        data = loader.load()
        splitter = RecursiveCharacterTextSplitter(separators=["\n\n", "\n", ".", " "], chunk_size=1200, chunk_overlap=200)
        docs = splitter.split_documents(data)
        
        vectordb.add_texts([f"The pdf file name is {filename} and content of pdf is below"])
        vectordb.add_documents(docs)
        
        self.save_vectordb(vectordb, chat_id)
    
    def save_vectordb(self, vectordb, chat_id):
        vectordb.save_local(folder_path=f"./faiss_indexes/{chat_id}")
    
    def load_vectordb_from_local(self,chat_id):
        if(os.path.exists(f"./faiss_indexes/{chat_id}") == False):
            self.save_vectordb(self.sample_vectordb, chat_id)
            return self.load_vectordb_from_local(chat_id)
        
        vectordb = FAISS.load_local(folder_path=f"./faiss_indexes/{chat_id}", embeddings=self.embedding, allow_dangerous_deserialization=True)
        return vectordb
    
    def rename_chat_id(self, old_chat_id, new_chat_id):
        os.rename(f"./faiss_indexes/{old_chat_id}", f"./faiss_indexes/{new_chat_id}")
    
    def create_new_chat(self,chat_id:str):
        self.load_vectordb_from_local(chat_id)
    
    def delete_chat(self, chat_id:str):
        if(os.path.exists(f"./faiss_indexes/{chat_id}") == False):
            return
        shutil.rmtree(f"./faiss_indexes/{chat_id}")
    
    def ask_question(self,chat_id, q,chat_history_str=""):
        try:
            vectordb = self.load_vectordb_from_local(chat_id)
            
            chain = (
                {"context":vectordb.as_retriever(), "question": RunnablePassthrough()} 
                | self.prompt 
                | self.llm
                )
            
            if(len(chat_history_str) != 0):
                q = q + f"\nThis is the history : {chat_history_str}"
            
            return {"result":chain.invoke(q), "status":True}
        
        except Exception as e:
            print(e)
            return {"result":"Sorry, I don't know","status":False,"exception":e}
