import { decryptMessageOnBase64 } from "../../hook/Metamask"
import Icon from "../Icon"
import { METAMASK_ENCRYPT_EXT } from '../../../src/config'
import jsonwebtoken from "jsonwebtoken"
import { download } from "../../modules/utils/downloadBlob"
import router from "next/router"

export default function FileItem ({name, size, pubKey, hash, downloadItem, admin, downloadArea, setList}) {
    const fileDownloadArea = (element) => {
        downloadArea.current.style.visibility = ''
        const gpgFile = element.currentTarget.getAttribute('data-download')        
        downloadArea.current.innerText = gpgFile
    }

    const onFileDelete = async (event) => {
        let fileId = event.currentTarget.getAttribute('data-hash')    
        const form = new FormData()
        form.append('fileId', fileId)
        form.append('jwt', admin)
        const res = await fetch(`${router.basePath}/api/delete`, {
          method: 'POST',
          body: form
        })  
        
        setList((items) => {
          return items.filter((item) => item.hash !== fileId)
        })
      }
    
      const onFileDownload = async (event) => {    
        const element = event.currentTarget
        const gpgFile = element.getAttribute('data-download')     
        const fileName = element.getAttribute('data-filename')
    
        if (element.getAttribute('data-type') === 'Metamask') {
            const result = await fetch(gpgFile)
            const metaAccount = jsonwebtoken.decode(admin).account
            const textData = await result.text()
            const fileDecrypt = await decryptMessageOnBase64(textData, metaAccount)
            download(fileName, fileDecrypt)
            return
        }
      }    

    return <li key={name} className="list list-group-item justify-content-between align-items-center">
        <div className="row">
            <div className="col-9">
                <Icon iconName='file-earmark-lock2'>{name}</Icon>
                <small className="d-sm-block d-md-none" style={{fontSize: '.7em', marginLeft: 10, padding: 0}}>
                    ({(size / 1024).toFixed(2)} Kb)
                </small>       
            </div>
            <div className="col-3" style={{textAlign: 'right', margin: 0}}>
                <a href="#"
                    data-download={downloadItem}
                    data-type={pubKey}
                    data-filename={name}
                    type="button" 
                    className="download btn btn-sm btn-success"
                    onClick={pubKey === 'Metamask' ? onFileDownload : fileDownloadArea}
                    style={{margin: 0, height: 32}}
                    >
                        <Icon iconName='cloud-download' iconColor='white' fontSize="1.1rem"></Icon>
                </a>
                {
                    admin ? <>
                        &nbsp; <a href="#"
                        data-hash={hash}
                        type="button" 
                        className="download btn btn-sm btn-danger"
                        onClick={onFileDelete}
                        style={{margin: 0, height: 32}}
                        >
                            <Icon iconName='trash' iconColor='white' fontSize="1.1rem"></Icon>
                    </a> </> : ''
                }
            </div>
        </div>
        <div className="row">
            <div className="col-5 d-none d-sm-none d-md-block" style={{textAlign: 'left'}}>
                <small style={{fontSize: '.7em', margin: 0, padding: 0}}>
                    <Icon iconName='fingerprint' fontSize=".9rem">{hash}</Icon>
                </small>
            </div>
            <div className="col-2 d-none d-sm-none d-md-block" style={{textAlign: 'left'}}>
                <small style={{fontSize: '.7em', margin: 0, padding: 0}}>
                    <Icon iconColor="black" iconName='key'>{pubKey}</Icon>
                </small>
            </div>
            <div className="col-2 d-none d-sm-none d-md-block" style={{textAlign: 'left'}}>
                <small style={{fontSize: '.7em', margin: 0, padding: 0}}>
                    {(size / 1024).toFixed(2)} Kb
                </small>
            </div>
        </div> 
    </li>
}