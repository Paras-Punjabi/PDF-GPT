
# PDF-GPT

- It is a RAG application where I have used GoogleGenerativeAI LLM model to generate text.
- PDF-GPT helps to extract data and answer the questions related to given pdf.
- It has chat architecture where we can chat with LLM in different context at the same time.
- Whole project is made using OOPS design method.

## Technologies used

- Retrieval Augmented Generation(RAG)
- Langchain framework for working with LLM's
- Tried GooglePalm, GoogleGenerativeAI, OpenAI model and their embeddings
- FAISS(Facebook AI Similarity Search) as vector database
- PyPDF for extracting data from pdf's
- PostgreSQL(psycopg2) for storing chats
- FastAPI for making python server
- Vite + TS + React for making frontend application
- React-Hot-Toast for toast notification
- React-Markdown for showing markdown format of otuput
- React-Router-Dom for making routes for different chats.
- React-To-Print for extracting chats in pdf form.

### Start Application

- Frontend  `npm run dev`
- Backend `uvicorn app:app --reload --port 3000`
- Build Frontend `npm run build`
- Start Frontend after build `npm run preview`
- Frontend Dev URL: <http://localhost:5173>
- Frontend Prod URL: <http://localhost:4173>

### Project Demo Video
[Video Link](https://drive.google.com/file/d/1AZbCOBfJnaCnZz2bR9GeG573alBomlWE/view?usp=sharing)

