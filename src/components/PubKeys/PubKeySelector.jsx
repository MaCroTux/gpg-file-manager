import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import jsonwebtoken from "jsonwebtoken"
import { accountShortFormat } from "../../hook/Metamask"

export const PubKeySelector = ({pubKeyRef, admin}) => {
    const pubKeyDefault = [{pubKey: '', name: 'Select your pub key'}]
    const [list, setList] = useState([])
    const router = useRouter()    

    const getKeyList = async () => {
        const res = await fetch(`${router.basePath}/api/get-pubkey`)
      
        return await res.json()
    }

    const uniqueArray = (list1, list2) => {
        let emptyList = []
        list1.concat(list2)
            .map((item) => JSON.stringify(item))
            .forEach((element) => !emptyList.includes(element) ? emptyList.push(element) : null)

        return emptyList.map((item) => JSON.parse(item))
    }

    useEffect(() => {        
        getKeyList()
            .then((list) => setList(listStatus => uniqueArray(list, listStatus)))
            .catch((error) => {
                console.error(error)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        (admin !== null && admin !== false)
            ?   setList(list => {
                    const listStatus = [...list, {
                        pubKey: 'metamask',
                        name: `Metamask Wallet (${accountShortFormat(jsonwebtoken.decode(admin)?.account)})`
                    }]
                    return uniqueArray(list, listStatus)
                })
            :   null
    }, [admin])

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