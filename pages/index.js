import Head from 'next/head'
import UploadGpgFile from '../src/components/FileUpload/GpgFileUpload'
import { useEffect, useState } from 'react'
import GetSavedFile from '../src/components/File/GetSavedFile'

export default function Home() {
  const [list, setList] = useState([])
  const [fileUpload, setFileUpload] = useState(null)

  useEffect(() => {
    if (fileUpload) {
      setList([...list, fileUpload])
    }    
  }, [fileUpload])

  return (
    <div className='container'>
      <Head>
        <title>GPG Encritp file</title>
        <meta name="description" content="Secure storage encrypt using GPG" />
        <link rel="icon" href="/favicon.ico" />
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css"/>
      </Head>

      <main>
        <h1 style={{marginTop: 30}}>GPG Encript file</h1>
        <hr />
        <UploadGpgFile setFileUpload={setFileUpload}/>
        <hr />               
        <GetSavedFile list={list} setList={setList}/>
      </main>

      <footer style={{textAlign: 'center', marginTop: 20}}>
        <span className="badge bg-light text-dark">
          Powered by <a href="https://github.com/MaCroTux">MaCroTux</a>
        </span>        
      </footer>
    </div>
  )
}
