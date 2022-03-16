import { encryptFile } from './encrypt/EncryptFile'
import { writeFileWithContent, deleteFile } from './upload/Upload';
import { UPLOAD_PATH, ENCRYPT_EXT, DIR_UPLOAD_FILE, DIR_PUB_KEY, DB_FILE_NAME } from '../../src/config'
import jsonfile from 'jsonfile'
import crypto from 'crypto'
import { saveDataFileIntoJsonDb } from './upload/JsonDb';
import File from '../../src/modules/File'

const fs = require('fs');

export const UploadAndEncrypt = async (host, pubKey, fileToEncrypt, targetNewFileEncrypted) => {
    const fileUploadName = targetNewFileEncrypted + ENCRYPT_EXT
    const sha1 = crypto.createHash('sha1')    
    const fileHash = sha1.update(fs.readFileSync(fileToEncrypt)).digest('hex')
    const fileSha1Name = DIR_UPLOAD_FILE + fileHash
    const file = new File(DIR_UPLOAD_FILE, targetNewFileEncrypted, fileHash, pubKey)

    try {
        const db = await jsonfile.readFile(DB_FILE_NAME)
        const hashNotAllow = db.map((item) => item.hash)        

        if (hashNotAllow.find(hash => hash === fileHash) !== undefined) {
            console.log('File already exist');
            return file.getFile(host, UPLOAD_PATH)
        }
    } catch (error) {
        console.log(error)
    }

    const encryptData = await encryptFile(DIR_PUB_KEY + pubKey, fileToEncrypt);
    writeFileWithContent(fileSha1Name, encryptData)
    deleteFile(fileToEncrypt)

    saveDataFileIntoJsonDb(host, file /*fileUploadName, fileSha1Name, pubKey, fileHash*/)
    
    return file.getFile(host, UPLOAD_PATH)
}
