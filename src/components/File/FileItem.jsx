import Icon from "../Icon"

export default function FileItem ({name, size, pubKey, hash, download, downloadArea}) {
    const fileDownload = (element) => {
        const gpgFile = element.currentTarget.getAttribute('data-download')        
        downloadArea.current.innerText = gpgFile
    }

    return <li key={name} className="list list-group-item justify-content-between align-items-center">
        <div className="row">
            <div className="col-sm-9">
                <div className="row">
                    <div className="col-sm-6">
                        <Icon iconName='file-earmark-lock2'>{name}</Icon>
                        <br />
                        <small style={{fontSize: '.7em'}}>
                            <Icon iconName='fingerprint' fontSize=".9rem">{hash}</Icon>
                        </small>
                    </div>
                    <div className="col-sm-3" style={{textAlign: 'left'}}>
                        <Icon iconName='key-fill'>{pubKey}</Icon>
                    </div>
                    <div className="col-sm-3" style={{textAlign: 'left'}}>
                        <Icon iconName='usb-drive'>{(size / 1024).toFixed(2)} Kb</Icon>
                    </div>
                </div>
            </div>
            <div className="col-sm-3" style={{textAlign: 'right'}}>
                <a href="#"
                    data-download={download}
                    type="button" 
                    className="download btn btn-sm btn-success"
                    onClick={fileDownload}
                    style={{margin: 2}}
                    >
                        <Icon iconName='cloud-download' iconColor='white' fontSize="1.1rem"></Icon>
                </a> 
            </div>
        </div>
    </li>
}