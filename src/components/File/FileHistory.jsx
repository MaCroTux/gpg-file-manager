import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import FileItem from "./FileItem"

export default function FileHistory({list, setList}) {
    const downloadArea = useRef()
    const router = useRouter()

    const getList = async () => {  
        const res = await fetch(`${router.basePath}/api/get-files`)
        
        return await res.json()
    }    

    useEffect(() => {
        getList()
            .then((data) => setList(data)) 
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <div className="list-group">            
            <code style={{margin: '30px 0px 30px 0px', visibility: 'hidden', backgroundColor: '#eee', padding: 10, borderStyle: 'dotted', borderWidth: '2px'}} ref={downloadArea}></code>
            <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
              File encrypt history
            </a>                 
            <div className='list'>
                {
                list.length > 0
                    ? list.map(({name, download, size, pubKey, hash}) => <FileItem key={hash} name={name} download={download} size={size} pubKey={pubKey} hash={hash} downloadArea={downloadArea}/>)
                    : <li className="list list-group-item justify-content-between align-items-center">
                        <div>
                            <div className='spinner'></div>
                        </div>                        
                    </li>
                }
            </div>
        </div>
    )
}