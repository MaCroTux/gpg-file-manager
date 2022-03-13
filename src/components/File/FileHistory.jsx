import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import FileItem from "./FileItem"

export default function FileHistory({list, setList, admin}) {
    const downloadArea = useRef()
    const spinner = useRef()
    const router = useRouter()

    const getList = async () => {
        if (spinner.current) {
            spinner.current.style.display = ''   
        }        
        const res = await fetch(`${router.basePath}/api/get-files`)
        
        return await res.json()
    }    

    useEffect(() => {        
        getList().then((data) => {
            setList(data)
            if (spinner.current) {
                spinner.current.style.display = 'none'
            }
        })                
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="list-group">            
            <code style={{margin: '30px 0px 30px 0px', visibility: 'hidden', backgroundColor: '#eee', padding: 10, borderStyle: 'dotted', borderWidth: '2px'}} ref={downloadArea}></code>
            <a href="#" 
                className="list-group-item list-group-item-action active" 
                aria-current="true">
              File encrypt history
            </a>                 
            <div className='list'>
                {
                list.length > 0
                    ? list.map(({name, download, size, pubKey, hash}) => <FileItem 
                        key={hash} 
                        name={name} 
                        downloadItem={download} 
                        size={size} 
                        pubKey={pubKey} 
                        hash={hash} 
                        downloadArea={downloadArea} 
                        admin={admin}
                        setList={setList}/>)
                    : <li className="list list-group-item justify-content-between align-items-center">
                        <div>
                            <div className='spinner'style={{display: 'none'}} ref={spinner}></div>
                        </div>                        
                    </li>
                }
            </div>
        </div>
    )
}