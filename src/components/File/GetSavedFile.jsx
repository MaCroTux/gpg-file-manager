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
                    ? list.map(({name, download}) => {
                        return <li key={name} className="list list-group-item d-flex justify-content-between align-items-center">
                            {name}
                            <a href="#"
                                data-download={download}
                                type="button" 
                                className="download btn btn-sm btn-success"
                                onClick={fileDownload}
                                style={{margin: 2}}
                                >
                                Download
                            </a> 
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