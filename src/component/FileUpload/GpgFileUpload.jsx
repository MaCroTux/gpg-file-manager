export default function UploadGpgFile() {
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
                    placeholder="Select file" />
            </div>
            
            <select 
                className="form-select"                 
                aria-label="Select key pub" 
                style={{margin: 5}}>
                {
                    [{pubKey: '', name: 'Select your pub key'}].map(
                        ({pubKey, name}) => <option value={pubKey}>{name}</option>)
                }
            </select>
            
            <div style={{textAlign:'right', marginTop:10}}>
                <button
                    className="btn btn-primary"
                    type="submit"                    
                >Send to server</button>
            </div>
        </>
    )   
}