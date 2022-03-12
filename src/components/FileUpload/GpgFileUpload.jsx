import { useRef, useState } from "react"
import { PubKeySelector } from "../PubKeys/PubKeySelector"
import Icon from "../Icon"
import { getPubKey, encryptedMessageOnBase64 } from "../../hook/Metamask"

export default function UploadGpgFile({setFileUpload, metaAccount, admin}) {
    const pubKey = useRef()
    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
        const i = event.target.files[0];
        setImage(i);
        setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const uploadToServer = async (event) => {
        const selectPubKey = pubKey.current
        const pubKeyValue = selectPubKey.options[selectPubKey.selectedIndex].value
        
        if (pubKeyValue === 'metamask') {
            const fReader = new FileReader()
            fReader.addEventListener('loadend', async () => {
                const itemPubKey = `pubKey_${metaAccount}`
                const storagePubKey = localStorage.getItem(itemPubKey)
                const body = new FormData()      
                let encryptedMessage = ''
                if (storagePubKey) {
                    encryptedMessage = encryptedMessageOnBase64(storagePubKey, fReader.result)           
                } else {                
                    const encryptionPublicKey = await getPubKey(metaAccount)
                    encryptedMessage = encryptedMessageOnBase64(encryptionPublicKey, fReader.result)
                    localStorage.setItem(`pubKey_${metaAccount}`, encryptionPublicKey)                    
                }             
                body.append("pubKey", pubKeyValue)
                body.append("fileEncryt", encryptedMessage)
                body.append("fileName", image.name)
                uploadForm(body)
                    .then((responseJson) => setFileUpload(responseJson))    
                    .catch((error) => alert('Error!'))
            });

            fReader.readAsText(image)

            return
        }

        const body = new FormData()
        body.append("file", image)
        body.append("pubKey", pubKeyValue)
        
        uploadForm(body)
            .then((responseJson) => setFileUpload(responseJson))    
            .catch((error) => alert('Error!'))
    };

    const uploadForm = async (body) => {
        const response = await fetch("/api/upload-files", {
            method: "POST",
            body
        });
        const responseJson = await response.json();
        if (responseJson.message) {
            alert('File already exist')
            return 
        }
        
        return responseJson
    }

    return (
        <>
            <h4>Select file to encrypt</h4>
            <br />
            <div className="form-group">
                <input 
                    type="file" 
                    style={{margin: 5}} 
                    className="form-control" 
                    name="gpgFile"
                    onChange={uploadToClient}
                    placeholder="Select file" />
            </div>
            
            <PubKeySelector pubKeyRef={pubKey} admin={admin}/>
            
            <div style={{textAlign:'right', marginTop:10}}>
                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={uploadToServer}
                ><Icon iconName='upload' iconColor='white'></Icon></button>
            </div>
        </>
    )   
}