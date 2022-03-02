import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

export const PubKeySelector = ({pubKeyRef}) => {
    const pubKeyDefault = [{pubKey: '', name: 'Select your pub key'}]
    const [list, setList] = useState([])
    const router = useRouter()    

    const getKeyList = async () => {
        const res = await fetch(`${router.basePath}/api/get-pubkey`)
      
        return await res.json()
    }

    useEffect(() => {
        getKeyList()
            .then((data) => setList(list => list.concat(data ?? pubKeyDefault))) 
            .catch((error) => {
                console.error(error)
            })
    }, [])    
    
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