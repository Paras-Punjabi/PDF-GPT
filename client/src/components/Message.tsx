import Markdown from 'react-markdown'
import File from './File'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Message = ({uniKey,message="", type} : {uniKey:any,message:any, type:any}) => {
  return (
    <div key={uniKey} className={`message flex my-1 px-4 py-2 ${type === "human" || type === "file" ? "justify-end  " : "justify-start max-w-[80%]"}`}>
    {type=== 'human' && <div className='text-white p-2 rounded-md border border-gray-700 items-end max-w-[80%]'><Markdown unwrapDisallowed={false} skipHtml={false} >{message}</Markdown></div>}
    {type === 'file' && <div className='text-white p-2 rounded-md border border-gray-700 items-end max-w-[80%]'><File filename={message}/></div>}

        {(type === 'human' || type === "file") && (
          <img src="/user.jpg" alt="Your avatar" className="ml-2 w-8 h-8 rounded-full items-start" />
        )}
        {(type === 'ai' || type === "loading") && (
          <img  src="/bot.jpg" alt="Your avatar" className="mr-2 w-8 h-8 rounded-full" />
        )}
        {type === 'ai' && <div className="p-2  text-white rounded-md border border-gray-700" style={{"lineHeight":1.75}}><Markdown>{message}</Markdown></div>}
        {type === 'loading' && <div className="p-2  text-white rounded-md border border-gray-700" style={{"lineHeight":1.75}}> {message} </div>}
    </div>
  )
}

export default Message