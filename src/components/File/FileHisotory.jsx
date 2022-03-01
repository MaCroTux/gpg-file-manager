import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import FileItem from "./FileItem"

export default function FileHisotory({list, setList}) {
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

    return (
        <div className="list-group">
            <div style={{margin: 10}}><code ref={downloadArea}></code></div>
            <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
              File encrypt history
            </a>                 
            <div className='list'>
                {
                list.length > 0
                    ? list.map(({name, download, size, pubKey, hash}) => <FileItem key={hash} name={name} download={download} size={size} pubKey={pubKey} hash={hash} downloadArea={downloadArea}/>)
                    : <div style={{textAlign: 'center'}}>
                        <p>No file upload yet</p>
                    </div>
                }
            </div>
        </div>
    )
}