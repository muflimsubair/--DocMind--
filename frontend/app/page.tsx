"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home(){

  const [status,setStatus] = useState("")
  const router = useRouter()

  const uploadFiles = async (e:any)=>{

    const files = e.target.files
    if(!files.length) return

    setStatus("Uploading documents...")

    try{

      for(let file of files){

        const formData = new FormData()
        formData.append("file",file)

        await fetch("http://127.0.0.1:8000/upload",{
          method:"POST",
          body:formData
        })

      }

      setStatus("✅ Documents uploaded successfully")

    }catch{

      setStatus("❌ Upload failed")

    }

  }

  return(

    <div className="upload-wrapper">

      <div className="upload-card">

        <h2>AI Document Assistant</h2>

        <p className="subtitle">
          Upload your PDFs and ask questions instantly
        </p>

        <div className="upload-area">

          <div className="upload-icon">📄</div>

          <p>Drag & drop your PDFs</p>

          <span>or click below to select files</span>

          <input
            type="file"
            multiple
            className="file-input"
            onChange={uploadFiles}
          />

        </div>

        <p className="status">{status}</p>

        <button
          className="primary-btn"
          onClick={()=>router.push("/ask")}
        >
          Go to AI Chat →
        </button>

        <div className="powered">
          Powered by FastAPI • FAISS • Ollama
        </div>

      </div>

    </div>

  )
}