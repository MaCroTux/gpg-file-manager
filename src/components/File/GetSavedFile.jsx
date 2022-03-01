import { useRouter } from "next/router"
import { useEffect, useRef } from "react"

export default function GetSavedFile({list, setList}) {
    const downloadArea = useRef()
    const router = useRouter()

    useEffect(() => {
        getList()
            .then((data) => setList(data)) 
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const getList = async () => {  
        const res = await fetch(`${router.basePath}/api/get-files`)
        
        return await res.json()
    }

    const fileDownload = (element) => {
        const gpgFile = element.currentTarget.getAttribute('data-download')        
        downloadArea.current.innerText = gpgFile
    }

    return (
        <div className="list-group">
            <div style={{margin: 10}}><code ref={downloadArea}></code></div>
            <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
              File encrypt history
            </a>                 
            <div className='list'>
                {
                list.length > 0
                    ? list.map(({name, download, size, pubKey, hash}) => {
                        return <li key={name} className="list list-group-item justify-content-between align-items-center">
                            <div className="row">
                                <div className="col-sm-9">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <i className="bi bi-file-earmark-lock2" style={{alignItems: 'baseline', marginLeft: 'right', fontSize: '1.3rem', color: 'cornflowerblue'}}></i> {name}
                                            <br />                                            
                                            <small style={{fontSize: '.7em'}}><i className="bi bi-fingerprint" style={{alignItems: 'baseline', marginLeft: 'right', fontSize: '.9rem', color: 'cornflowerblue'}}></i> {hash}</small>
                                        </div>
                                        <div className="col-sm-3" style={{textAlign: 'left'}}>
                                            <i className="bi bi-key-fill" style={{marginLeft: 'right', fontSize: '1.3rem', color: 'cornflowerblue'}}></i> {pubKey}
                                        </div>
                                        <div className="col-sm-3" style={{textAlign: 'left'}}>
                                            <i className="bi bi-usb-drive" style={{marginLeft: 'right', fontSize: '1.3rem', color: 'cornflowerblue'}}></i> {(size / 1024).toFixed(2)} Kb
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-3" style={{textAlign: 'right'}}>
                                    <a href="#"
                                        data-download={download}
                                        type="button" 
                                        className="download btn btn-sm btn-success"
                                        onClick={fileDownload}
                                        style={{margin: 2}}
                                        >
                                        <i className="bi bi-cloud-download" style={{marginLeft: 'right', fontSize: '1.1rem', color: 'white'}}></i>
                                    </a> 
                                </div>
                            </div>
                        </li>
                    })
                    : <div style={{textAlign: 'center'}}>
                        <p>No file upload yet</p>
                    </div>
                }
            </div>
        </div>
    )
}