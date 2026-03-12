"use client"

import { useState, useRef, useEffect } from "react"

export default function AskAI(){

  const [messages,setMessages] = useState<any[]>([])
  const [question,setQuestion] = useState("")
  const [loading,setLoading] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  const sampleQuestions = [
    "Summarize this document",
    "What are the key points?",
    "Explain the main topic",
    "List important information",
    "What conclusions can be drawn?",
    "Give a short overview"
  ]

  const scrollToBottom = ()=>{
    chatEndRef.current?.scrollIntoView({behavior:"smooth"})
  }

  useEffect(()=>{
    scrollToBottom()
  },[messages])



  /* Typing animation */
  const typeMessage = async (text:string, sources:any[]) => {

    let current = ""

    setMessages(prev=>[
      ...prev,
      {role:"ai",content:"",sources:[]}
    ])

    for(let i=0;i<text.length;i++){

      current += text[i]

      setMessages(prev=>{
        const updated=[...prev]
        updated[updated.length-1]={
          role:"ai",
          content:current,
          sources:[]
        }
        return updated
      })

      await new Promise(r=>setTimeout(r,10))
    }

    setMessages(prev=>{
      const updated=[...prev]
      updated[updated.length-1]={
        role:"ai",
        content:text,
        sources:sources
      }
      return updated
    })

  }



  const askAI = async (q?:string)=>{

    const userQuestion=q || question
    if(!userQuestion || loading) return

    setMessages(prev=>[
      ...prev,
      {role:"user",content:userQuestion}
    ])

    setQuestion("")
    setLoading(true)

    try{

      const res=await fetch("http://127.0.0.1:8000/ask",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          question:userQuestion
        })
      })

      const data=await res.json()

      await typeMessage(data.answer,data.sources || [])

    }catch{

      setMessages(prev=>[
        ...prev,
        {role:"ai",content:"⚠️ Error contacting AI server"}
      ])

    }

    setLoading(false)

  }



  const handleKeyPress=(e:any)=>{
    if(e.key==="Enter"){
      e.preventDefault()
      askAI()
    }
  }



  return(

    <div className="chat-wrapper">

      <div className="chat-box">

        {messages.length===0 && (

          <div className="welcome">

            <h2>💬 Ask about your document</h2>

            <p className="welcome-sub">
              Upload a document and ask anything about it
            </p>

            <div className="suggestions">

              {sampleQuestions.map((q,i)=>(
                <div
                  key={i}
                  className="suggestion-card"
                  onClick={()=>askAI(q)}
                >
                  {q}
                </div>
              ))}

            </div>

          </div>

        )}



        {messages.map((msg,index)=>(

          <div
            key={index}
            className={`message-row ${msg.role}`}
          >

            <div className="avatar">
              {msg.role==="user" ? "🧑" : "🤖"}
            </div>

            <div className="bubble">

              <div>{msg.content}</div>

              {msg.sources && msg.sources.length>0 && (

                <div className="sources">
                  📄 Sources: {msg.sources.join(", ")}
                </div>

              )}

            </div>

          </div>

        ))}



        {loading && (

          <div className="message-row ai">

            <div className="avatar">🤖</div>

            <div className="bubble typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

        <div ref={chatEndRef}></div>

      </div>



      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask anything about the document..."
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button onClick={()=>askAI()}>
          Send
        </button>

      </div>

    </div>

  )
}