import React, {useEffect, useRef, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar';
import Message from './Message';
import toast, { Toaster } from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import '../index.css'

const Chat = () => {
  const {id : chat_id} = useParams();
  const navigate = useNavigate()
  const BASE_API_URL = import.meta.env.VITE_API_URL

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chats, setChats] = useState<{message:any, type:string}[]>([])
  const [files, setFiles] = useState<{file:string,chat_id:string}[]>([])
  const chatContainer = useRef<HTMLDivElement>(null)
  const printContainer = useRef<HTMLDivElement>(null)
  const [prompt, setPrompt] = useState<string>("")

  const downloadChat = useReactToPrint({
    content:()=>printContainer.current,
    copyStyles:true,
    documentTitle:chat_id,
    bodyClass:"print",
  })

  const notify = (message:string,type:string) => {
    if(type === "success"){
      toast.success(message,{
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    }
    else if(type === "error"){
      toast.error(message,{
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    }
  }

  const uploadFile = async()=>{
    const input = document.createElement("input")
    input.type="file"
    input.accept = "application/pdf"
    input.click();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input.oninput = async(e:any)=>{
        async function solve(){
            const formData = new FormData();
            formData.append("file",e.target.files[0]);
            const data = await fetch(`${BASE_API_URL}/upload_file?chat_id=${chat_id}`,{
              method:"POST",
              body:formData
            })

            const resp = await data.json()
            if(resp.status){
              // console.log(resp.response);
              await load_files();
            }
            else{
              // console.log(resp)
              throw new Error("Error")
            }
        }
        toast.promise(
          solve(),
         {
           loading: 'File Uploading...',
           success: <b>File Uploaded Successfully</b>,
           error: <b>Error Occured in uploading file</b>,
         },
         {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
       );
      }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleKeyDown(e:any){
    if(e.code === "Enter" && prompt.length !== 0){
      sendMessage();
    }
  }

  // function getChatHistory() : string{
  //     let ch = "";
  //     for(const item of chats){
  //       const type = item.type, msg = item.message;
  //       ch+=`${type} : ${msg}\n`;
  //     }
  //     return ch;
  // }

  async function sendMessage(){
      // const ch = getChatHistory();
      // console.log(ch)
      const question = prompt
      setChats([...chats, {message:prompt, type:"human"}, {message:<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>, type:"loading"}])

      setTimeout(()=>{
        chatContainer.current?.scrollTo({top:chatContainer.current.scrollHeight});
        setPrompt("");
      },100);
      
      const data = await fetch(`${BASE_API_URL}/ask_question`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          question:question,
          chat_id:chat_id,
          chat_history:""
        })
      })
      const resp = await data.json();
      if(resp.status){
        await load_chats();
        chatContainer.current?.scrollTo({top:chatContainer.current.scrollHeight});
      }
  }

  async function load_chats(){
      const data = await fetch(`${BASE_API_URL}/get_all_chats?chat_id=${chat_id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
      });
      const response = await data.json();
      if(response.status){
        const resp = response.response;
        const array = []
        for(const item of resp){
          array.push({message:item.human,type:"human"})
          array.push({message:item.ai,type:"ai"})
        }
        setChats(array);
        // console.log(chats)
      }
      else{
        notify('Error occured while loading chats!',"error")
      }
  }

  async function load_files(){
      const data = await fetch(`${BASE_API_URL}/get_all_files?chat_id=${chat_id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
      });
      const response = await data.json();
      if(response.status){
        // console.log(response["response"]);
        setFiles(response["response"]);
      }
  }

  useEffect(()=>{
    void (async ()=>{
      const data = await fetch(`${BASE_API_URL}/chat_exists?chat_id=${chat_id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
      });
      const resp = await data.json();
      if(!resp.response){
          notify("Chat does not exist\n Moving back to Home Page...","error");
          setTimeout(()=>{
            navigate("/");
          },2000)
      }
      else{
        await load_chats();
        await load_files();
        notify('Chats loaded Successfully!',"success")
        chatContainer.current?.scrollTo({top:chatContainer.current.scrollHeight});
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[chat_id]);

  return (
    <React.Fragment>
        <Sidebar notify={notify}/>
        <Toaster
            position="top-center"
            reverseOrder={false}
          />
        <div className="p-4 sm:ml-64 flex flex-col justify-center items-center h-screen w-[83%] bg-[#121315]">

            <div ref={chatContainer} className="w-[100%] h-[92%] overflow-y-auto">
                {
                  files && files.map((item,idx)=>{
                    return <>
                    <Message key={idx+1} uniKey={idx} message={item?.file} type={"file"}/>
                    </>
                  })
                }
                <div ref={printContainer} className="chats">
                  {
                    chats && chats.map((item,idx)=>{
                      return <>
                      <Message key={idx+1} uniKey={idx} message={item.message} type={item.type}/>
                      </>
                    })
                  }
                </div>
            </div>

        <div className="input flex items-center mx-auto" style={{width:"55vw"}}>
        <label htmlFor="voice-search" className="sr-only">Search</label>
        <div className="flex justify-between items-center w-full">

        <textarea onResize={()=>false} autoComplete='off' value={prompt} onChange={(e)=>setPrompt(e.target.value)}  id="search" className="bg-gray-50 border border-gray-300 text-gray-900  rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-[100%] p-3 pr-6 text-lg  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none mx-5" placeholder="Enter your prompt here..." required onKeyDown={handleKeyDown} cols={2}  />

      <div className='flex w-[15%] items-center justify-between'>
        <button type="button" title='Send Message' onClick={sendMessage} className="inset-y-0 end-0 flex items-center right-2 z-10">
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
          <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
      </svg>
        </button>

        <button title='Upload File' onClick={uploadFile} type="button" className="inset-y-0 end-0 flex items-center -right-7">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd"/>
          </svg>
        </button>
      <button title='Export Chat' onClick={downloadChat} type="button" className="inset-y-0 end-0 flex items-center -right-3">
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd"/>
      </svg>
      </button>
    </div>
            </div>
              </div>
        </div>
    </React.Fragment>
  )
}

export default Chat