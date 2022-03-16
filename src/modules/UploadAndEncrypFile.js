import { encryptFile } from './encrypt/EncryptFile'
import { UPLOAD_PATH, DIR_PUB_KEY, DB_FILE_NAME } from '../../src/config'
import jsonfile from 'jsonfile'
import crypto from 'crypto'
import { saveDataFileIntoJsonDb } from './upload/JsonDb';
import File from '../../src/modules/File'

const fs = require('fs');

export const UploadAndEncrypt = async (host, pubKey, filePath, fileName) => {
    const sha1 = crypto.createHash('sha1')
    const fileData = fs.readFileSync(filePath)
    const pubKeyData = fs.readFileSync(DIR_PUB_KEY + pubKey)
    const fileHash = sha1.update(fileData).digest('hex')    

    try {
        const db = await jsonfile.readFile(DB_FILE_NAME)
        const hashNotAllow = db.map((item) => item.hash)        

        if (hashNotAllow.find(hash => hash === fileHash) !== undefined) {
            console.log('File already exist');
            return file.getFileShowData(host, UPLOAD_PATH)
        }
    } catch (error) {
        console.log(error)
    }

    const encryptData = await encryptFile(pubKeyData, fileData);    
    const file = new File(fileName, encryptData, fileHash, pubKey)

    saveDataFileIntoJsonDb(file)
    
    return file.getFileShowData(host, UPLOAD_PATH)
}
