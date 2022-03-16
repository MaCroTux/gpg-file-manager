import Head from 'next/head'
import UploadGpgFile from '../src/components/FileUpload/GpgFileUpload'
import { useEffect, useRef, useState} from 'react'
import FileHistory from '../src/components/File/FileHistory'
import Icon from '../src/components/Icon'
import Navbar from '../src/components/Nav/Navbar'
import jsonwebtoken from 'jsonwebtoken'

export default function Home() {
  const [list, setList] = useState([])
  const [fileUpload, setFileUpload] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [metaAccount, setMetaAccount] = useState('')
  const alertMessage = useRef()

  useEffect(() => {    
    let jwt = localStorage.getItem('jwt') || false

    if (jwt && (jsonwebtoken.decode(jwt)?.exp < (new Date()).getTime())) {
      jwt = false
      localStorage.setItem('jwt', '')
      localStorage.setItem('account', null)
      setAdmin(jwt)
      setMetaAccount('')
    }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <main style={{marginTop: 20}}>
        <Navbar setAdmin={setAdmin} setMetaAccount={setMetaAccount} metaAccount={metaAccount}/>
        <h1 style={{marginTop: 10}}>
          <Icon iconName='file-earmark-lock2' fontSize=''>GPG Encript file</Icon>
          <div>
            <p style={{fontSize: '1.1rem', textAlign: 'right', color: 'orange'}} ref={alertMessage}></p>
          </div>
        </h1>
        <hr />
        <UploadGpgFile setFileUpload={setFileUpload} metaAccount={metaAccount} admin={admin}/>
        <hr />               
        <FileHistory list={list} setList={setList} admin={admin}/>
      </main>

      <footer style={{textAlign: 'center', marginTop: 20}}>
        <span className="badge bg-light text-dark">
          Powered by <a href="https://github.com/MaCroTux">MaCroTux</a>
        </span>        
      </footer>
    </div>
  )
}
