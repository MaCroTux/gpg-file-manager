import Head from 'next/head'
import UploadGpgFile from '../src/components/FileUpload/GpgFileUpload'
import { useEffect, useRef, useState} from 'react'
import FileHisotory from '../src/components/File/FileHisotory'
import { useRouter } from 'next/router'
import Icon from '../src/components/Icon'
import { render } from 'react-dom'

export default function Home() {
  const [list, setList] = useState([])
  const [fileUpload, setFileUpload] = useState(null)
  const router = useRouter()
  const alertMessage = useRef()

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
  }, [])

  const checkHealth = async () => {  
    const res = await fetch(`${router.basePath}/api/check-health-files`)
    
    return await res.json()
  }

  useEffect(() => {
    if (fileUpload) {
      setList((list) => list.concat([fileUpload]))
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
        <h1 style={{marginTop: 30}}>
          <Icon iconName='file-earmark-lock2' fontSize=''>GPG Encript file</Icon>
          <div>
            <p style={{fontSize: '1.1rem', textAlign: 'right', color: 'orange'}} ref={alertMessage}></p>
          </div>
        </h1>
        <hr />
        <UploadGpgFile setFileUpload={setFileUpload}/>
        <hr />               
        <FileHisotory list={list} setList={setList}/>
      </main>

      <footer style={{textAlign: 'center', marginTop: 20}}>
        <span className="badge bg-light text-dark">
          Powered by <a href="https://github.com/MaCroTux">MaCroTux</a>
        </span>        
      </footer>
    </div>
  )
}
