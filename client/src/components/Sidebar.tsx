import React, {useEffect, useState} from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import NewChatModal from "./NewChatModal"
import RenameModal from "./RenameModal"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Sidebar = ({notify}:{notify:any}) => {
    const {id : chat_id} = useParams();
    const [chatIds, setChatIds] = useState<string[]>([])
    const BASE_API_URL = import.meta.env.VITE_API_URL
    const [renameChatId, setRenameChatId] = useState<string>("")
    const [selectChatId, setSelectChatId] = useState<string>("")
    const [newChatId, setNewChatId] = useState<string>("")
    const [showNewChatModal,setShowNewChatModal] = useState<boolean>(false);
    const [showRenameModal,setShowRenameModal] = useState<boolean>(false);
    const router = useNavigate()

    useEffect(()=>{
        void (async ()=>{
            await load_chats()
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const load_chats = async()=>{
        const data = await fetch(`${BASE_API_URL}/get_all_chat_ids`)
        const resp = await data.json()
        if(resp?.status){
            setChatIds(resp?.response);
        }   
        else{
            console.log("error occured");
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openRenameModel = async(e:any)=>{
        document.getElementById("btn")?.click();
        setShowRenameModal(true);
        setRenameChatId(e?.target?.previousSibling?.children[1]?.innerText as string)
        setSelectChatId(e?.target?.previousSibling?.children[1]?.innerText as string)
    }
    
    const createNewChatId = async()=>{
        if(newChatId === "") return;
        const data = await fetch(`${BASE_API_URL}/new_chat?chat_id=${newChatId}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const resp = await data.json()
        if(resp?.status){
            await load_chats()
            router(`/chat/${newChatId}`);
        }
        console.log(resp);
        setNewChatId("");
    }

    async function renameChat(){
        const data = await fetch(`${BASE_API_URL}/rename_chat_id?old_chat_id=${selectChatId}&new_chat_id=${renameChatId}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const resp = await data.json()
        if(resp?.status){
            await load_chats()
            router(`/chat/${renameChatId}`);
            notify("Chat renamed Successfully!","success")
        }
        else{
            notify("Error occured while renaming chat!","error")
        }
        console.log(resp);
    }

    async function deleteChat(){
        const data = await fetch(`${BASE_API_URL}/delete_chat?chat_id=${selectChatId}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const resp = await data.json()
        if(resp?.status){
            await load_chats()
            router("/")
            notify("Chat deleted Successfully!","success")
        }
        else{
            notify("Error occured while deletin chat!","error")
        }
        console.log(resp);
    }

  return (
    <React.Fragment>

<aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 bg-gray-800">
      <Link to="/" className="flex items-center ps-2.5 mb-5 cursor-pointer">
         <img src="/favicon.jpg" className="h-10 me-3 sm:h-10 rounded-full" alt="PDF GPT Logo" />
         <span className="self-center text-xl font-semibold whitespace-nowrap text-white">PDF-GPT</span>
      </Link>
      <ul className="space-y-2 font-medium">
        <li className="cursor-pointer mb-6">
            <button onClick={()=>setShowNewChatModal(true)} data-modal-target="authentication-modal" data-modal-toggle="authentication-modal"  type="button" className="text-white bg-gray-900 hover:bg-gray-950 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-3 py-2.5 me-2 mb-2 bg-gray-700 hover:bg-gray-500 focus:ring-gray-700 border-gray-700 cursor-pointer text-lg flex justify-between items-center">
                <svg className="w-6 h-6 text-gray-800 text-white mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
                </svg>
                <span className="mx-1">New Chat</span>
            </button>
        </li>
        {
            chatIds && chatIds.map((item,idx)=>{
                return (
                <li className={`cursor-pointer rounded-2xl ${item === chat_id ? "bg-gray-600" : ""}`} key={idx}>
                    <div className="flex justify-between items-center rounded-2xl p-2 text-gray-900 rounded-lg text-white hover:bg-gray-700 group">

                        <Link to={`/chat/${item}`} className="flex">
                            <svg className="w-6 h-6 text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clipRule="evenodd"/>
                            <path fillRule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clipRule="evenodd"/>
                            </svg>
                            <span className="ms-3">{item}</span>
                        </Link>

                        <svg onClick={openRenameModel} className="w-6 h-6 text-gray-800 text-white border border-none hover:bg-gray-500 rounded-full" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M12 6h.01M12 12h.01M12 18h.01"/>
                        </svg>

                    </div>
                </li>
                )
            })
        }
      </ul>
      <div className="cursor-pointer px-2 absolute bottom-4 py-2 bg-[#374151] flex items-center justify-start rounded-2xl w-3/4 hover:scale-110 transition-all text-gray-50">
        <img src="/user.jpg" alt="User Image" className="w-10 h-10 rounded-full items-start" />
        <span className="text-lg mx-2">
            Paras Punjabi
        </span>
        </div>
   </div>
</aside>
<NewChatModal showModal={showNewChatModal} setShowModal={setShowNewChatModal} newChatId={newChatId} setNewChatId={setNewChatId} createNewChatId={createNewChatId}/>

<RenameModal showModal={showRenameModal} setShowModal={setShowRenameModal} renameChatId={renameChatId} setRenameChatId={setRenameChatId} renameChat={renameChat} deleteChat={deleteChat} />
    </React.Fragment>
  )
}

export default Sidebar