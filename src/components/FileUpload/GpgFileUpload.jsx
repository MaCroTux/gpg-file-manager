import { useRef, useState } from "react";
import { PubKeySelector } from "../PubKeys/PubKeySelector";

export default function UploadGpgFile({setFileUpload}) {
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
        const body = new FormData()

        body.append("file", image)
        body.append("pubKey", pubKeyValue)
        
        const response = await fetch("/api/upload-files", {
            method: "POST",
            body
        });

        setFileUpload(await response.json())
    };

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
            
            <PubKeySelector pubKeyRef={pubKey}/>
            
            <div style={{textAlign:'right', marginTop:10}}>
                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={uploadToServer}
                >Send to server</button>
            </div>
        </>
    )   
}