import { encryptFile } from './encrypt/EncryptFile'
import { writeFileWithContent, deleteFile } from './upload/Upload';
import { ENCRYPT_EXT, DIR_UPLOAD_FILE, DIR_PUB_KEY, DB_FILE_NAME, downloadLinkCreator, clearPubKeyRaw } from '../../src/config'
import jsonfile from 'jsonfile'
import crypto from 'crypto'
import { saveDataFileIntoJsonDb } from './upload/JsonDb';

const fs = require('fs');

export const UploadAndEncrypt = async (host, pubKey, fileToEncrypt, targetNewFileEncrypted) => {
    const fileUploadName = targetNewFileEncrypted + ENCRYPT_EXT
    //const md5 = crypto.createHash('md5')      
    const sha1 = crypto.createHash('sha1')    
    const fileHash = sha1.update(fs.readFileSync(fileToEncrypt)).digest('hex')
    const fileSha1Name = DIR_UPLOAD_FILE + fileHash

    try {
        const db = await jsonfile.readFile(DB_FILE_NAME)
        const hashNotAllow = db.map((item) => item.hash)
        
        if (hashNotAllow.find(hash => hash === fileHash) !== undefined) {
            console.log('File already exist');            
            return {
                name: fileUploadName,
                download: downloadLinkCreator(host, targetNewFileEncrypted, fileHash),
                message: `File not upload, already exist (${fileHash})`,
                pubKey: clearPubKeyRaw(pubKey),
                size: fs.statSync(fileSha1Name).size,
                hash: fileHash
            }
        }
    } catch (error) {
        console.log(error)
    }

    const encryptData = await encryptFile(DIR_PUB_KEY + pubKey, fileToEncrypt);
    writeFileWithContent(fileSha1Name, encryptData)
    deleteFile(fileToEncrypt)

    saveDataFileIntoJsonDb(fileUploadName, fileSha1Name, pubKey, fileHash)

    return {
        name: fileUploadName,
        download: downloadLinkCreator(host, targetNewFileEncrypted, fileHash),
        pubKey: clearPubKeyRaw(pubKey),
        size: fs.statSync(fileSha1Name).size,
        hash: fileHash
    }
}
