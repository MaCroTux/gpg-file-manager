import Head from 'next/head'
import UploadGpgFile from '../src/components/FileUpload/GpgFileUpload'
import { useEffect, useRef, useState} from 'react'
import FileHistory from '../src/components/File/FileHistory'
import { useRouter } from 'next/router'
import Icon from '../src/components/Icon'
import { render } from 'react-dom'
import Navbar from '../src/components/Nav/Navbar'

export default function Home() {
  const [list, setList] = useState([])
  const [fileUpload, setFileUpload] = useState(null)
  const [admin, setAdmin] = useState(false)
  const router = useRouter()
  const alertMessage = useRef()

  const checkHealth = async () => {  
    const res = await fetch(`${router.basePath}/api/check-health-files`)
    
    return res.json()
  }

  useEffect(() => {
    checkHealth()
      .then((data) => {
        if (data.length > 0) {
          render(<Icon iconColor='orange'>Some file have problems</Icon>, alertMessage.current)
        }
        console.log('File health OK!')
      })
      .catch((error) => {
          console.error(error)
      })
    setAdmin(localStorage.getItem('jwt') || false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (fileUpload) {
      setList((list) => list.concat([fileUpload]))
    }    
  }, [fileUpload])

  const onFileDelete = async (event) => {
    let fileId = event.currentTarget.getAttribute('data-hash')    
    const form = new FormData()
    form.append('fileId', fileId)
    form.append('jwt', admin)
    const res = await fetch(`${router.basePath}/api/delete`, {
      method: 'POST',
      body: form
    })  
    
    setList((items) => {
      return items.filter((item) => item.hash !== fileId)
    })

  }

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

      <main style={{marginTop: 20}}>
        <Navbar setAdmin={setAdmin}/>
        <h1 style={{marginTop: 10}}>
          <Icon iconName='file-earmark-lock2' fontSize=''>GPG Encript file</Icon>
          <div>
            <p style={{fontSize: '1.1rem', textAlign: 'right', color: 'orange'}} ref={alertMessage}></p>
          </div>
        </h1>
        <hr />
        <UploadGpgFile setFileUpload={setFileUpload}/>
        <hr />               
        <FileHistory list={list} setList={setList} admin={admin} onFileDelete={onFileDelete}/>
      </main>

      <footer style={{textAlign: 'center', marginTop: 20}}>
        <span className="badge bg-light text-dark">
          Powered by <a href="https://github.com/MaCroTux">MaCroTux</a>
        </span>        
      </footer>
    </div>
  )
}
