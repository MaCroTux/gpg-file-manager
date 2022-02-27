import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

export const PubKeySelector = ({pubKeyRef}) => {
    const [list, setList] = useState([{pubKey: '', name: 'Select your pub key'}])
    const router = useRouter()    

    useEffect(() => {
        getKeyList()
            .then((data) => setList([...list, ...data])) 
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const getKeyList = async () => {
        const res = await fetch(`${router.basePath}/api/get-pubkey`)
      
        return await res.json()
    }
    
    return (
        <select 
            className="form-select"
            aria-label="Select key pub"
            ref={pubKeyRef}
            style={{margin: 5}}>
            {
                list.map(
                    ({pubKey, name}) => <option key={pubKey} value={pubKey}>{name}</option>)
            }
        </select>
    )
}