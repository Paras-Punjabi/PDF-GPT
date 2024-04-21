
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NewChatModal = ({showModal,setShowModal,renameChatId,setRenameChatId,renameChat, deleteChat}:{showModal:boolean,setShowModal:any, renameChatId:any,setRenameChatId:any,renameChat:any, deleteChat:any}) => {
    return (
      <>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 mx-auto z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-[#374151] text-white" style={{width:"50vw"}}>
                  {/*header*/}
                  <div className="flex items-start justify-between p-3 rounded-t">
                    <h3 className="text-3xl font-semibold">
                    Rename Chat
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                      &#xd7;
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Chat Name</label>
                      <div className="mb-3 pt-0">
                          <input value={renameChatId} autoComplete="off" autoCorrect="off" type="text" name="chat_id" id="renameChatId" onChange={(e)=>setRenameChatId(e.target.value)}className="px-3 py-4 placeholder-blueGray-300 text-blueGray-600 relative bg-[#4B5563] rounded text-base border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                      </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 rounded-b">
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={async() => {await renameChat();setShowModal(false)}}
                    >
                      Rename
                    </button>
                    <button
                      className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={async() => {await deleteChat();setShowModal(false);}}
                    >
                      Delete Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    )
  }
  
  export default NewChatModal