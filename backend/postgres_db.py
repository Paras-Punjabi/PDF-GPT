import psycopg2
import pandas as pd

# Schema of Database
class Chats:
    chat_id:str
    human:str
    ai:str

class Files:
    chat_id:str
    file:str    

class PdfGPTPostgresDatabase:
    def __init__(self):
        self.connector = psycopg2.connect(database="pdfgpt",
                        host="localhost",
                        user="postgres",
                        password="password",
                        port="5432")
        self.cursor = self.connector.cursor()
    
    def list_all_files(self, chat_id:str):
        self.cursor.execute(f"select * from files  where chat_id = '{chat_id}' ")
        data = self.cursor.fetchall()
        data = pd.DataFrame(data,columns=["chat_id","file"])
        return data.to_dict("records")

    def list_all_chats(self, chat_id:str):
        self.cursor.execute(f"select * from chats where chat_id = '{chat_id}' ")
        data = self.cursor.fetchall()
        data = pd.DataFrame(data,columns=["chat_id","human","ai","created_time"])
        data.sort_values(by="created_time",ascending=True,inplace=True)
        return data.to_dict("records")

    def insert_chat(self,chat_id:str, human:str ,ai:str):
        human = human.replace("'","''")
        ai = ai.replace("'","''")
        self.cursor.execute(f"insert into chats(chat_id, human, ai) values('{chat_id}', '{human}', '{ai}' ); ")
        self.connector.commit()
        
    def insert_file(self,chat_id:str, file:str):
        self.cursor.execute(f"insert into files(chat_id, file) values('{chat_id}', '{file}' ); ")
        self.connector.commit()
    
    def delete_chat(self, chat_id):
        self.cursor.execute(f"delete from chats where chat_id = '{chat_id}' ")
        self.connector.commit()
        self.cursor.execute(f"delete from files where chat_id = '{chat_id}' ")
        self.connector.commit()

    def rename_chat_id(self, old, new):
        self.cursor.execute(f"update chats set chat_id = '{new}' where chat_id = '{old}' ")
        self.connector.commit()
        self.cursor.execute(f"update files set chat_id = '{new}' where chat_id = '{old}' ")
        self.connector.commit()