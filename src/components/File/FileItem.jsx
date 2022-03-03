import Icon from "../Icon"

export default function FileItem ({name, size, pubKey, hash, download, downloadArea, admin, onFileDelete}) {
    const fileDownload = (element) => {
        downloadArea.current.style.visibility = ''
        const gpgFile = element.currentTarget.getAttribute('data-download')        
        downloadArea.current.innerText = gpgFile
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
                    data-download={download}
                    type="button" 
                    className="download btn btn-sm btn-success"
                    onClick={fileDownload}
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