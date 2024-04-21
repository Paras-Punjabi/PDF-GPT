
const Home = () => {
    const data:string[]= [
        "PDF-GPT helps to extract data and answer the questions related to given pdf.",
        "It has chat architecture where we can chat with LLM in different context at the same time.",
        "Uploaded pdf's will be shown at the top of chats.",
    ]
  return<>
  <div className="p-4 sm:ml-64 container justify-center items-center h-full min-h-screen w-[83%] bg-[#121315] text-8xl">
    <div className="text-[#4b4b9a] mx-10 mt-2 mb-2">Hello, Paras</div>
    <div className="text-[#c057ae] mx-10">
    How Can I help you today?
    </div>
    <div className="bg-[#1E1E21] w-[90%] mx-10 mt-10 rounded-2xl text-xl font-mono p-4">
    <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
        {data.map((item,idx)=>{
            return(
        <li key={idx} className="flex items-center space-x-3 rtl:space-x-reverse">
         <svg className="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
         </svg>
        <span>{item}</span>
        </li>
    )})}
        <li className="flex space-x-3 -space-y-2 rtl:space-x-reverse">
        <svg className="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
         </svg>
         <span>Technologies Used:-
            <ul className="ps-5 mt-2 space-y-1 list-disc text-lg list-inside">
                <li>Retrieval Augmented Generation(RAG)</li>
                <li>Langchain framework for working with LLM's</li>
                <li>GoogleGenerativeAI model and embeddings</li>
                <li>FAISS(Facebook AI Similarity Search) as vector database</li>
                <li>PyPDF for extracting data from pdf's</li>
                <li>PostgreSQL(psycopg2) for storing chats</li>
                <li>FastAPI for making python server</li>
                <li>Vite + TS + React for making frontend application</li>
            </ul>
         </span>
        </li>
    </ul>
    </div>
  </div>
  </>
}

export default Home