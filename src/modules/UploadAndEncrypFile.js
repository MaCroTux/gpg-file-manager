import { encryptFile } from './encrypt/EncryptFile'
import { writeFileWithContent, deleteFile } from './upload/Upload';
import { ENCRYPT_EXT, DIR_UPLOAD_FILE, DIR_PUB_KEY, DB_FILE_NAME, downloadLinkCreator, clearPubKeyRaw } from '../../src/config'
import jsonfile from 'jsonfile'
import crypto from 'crypto'

const fs = require('fs');

export const UploadAndEncrypt = async (host, pubKey, fileToEncrypt, targetNewFileEncrypted) => {
    const fileUploadName = targetNewFileEncrypted + ENCRYPT_EXT
    const fileUploadPath = DIR_UPLOAD_FILE + fileUploadName

    const sha1 = crypto.createHash('md5')    
    const fileHash = sha1.update(fs.readFileSync(fileToEncrypt)).digest('hex')

    try {
        const db = await jsonfile.readFile(DB_FILE_NAME)
        const hashNotAllow = db.map((item) => item.hash)
        
        if (hashNotAllow.find(hash => hash === fileHash) !== undefined) {
            console.log('File already exist');            
            return {
                name: fileUploadName,
                download: downloadLinkCreator(host, fileUploadName, targetNewFileEncrypted),
                message: `File not upload, already exist (${fileHash})`,
                pubKey: clearPubKeyRaw(pubKey),
                size: fs.statSync(fileUploadPath).size,
            }
        }
    } catch (error) {
        console.log(error)
    }

    const encryptData = await encryptFile(DIR_PUB_KEY + pubKey, fileToEncrypt);
    writeFileWithContent(fileUploadPath, encryptData)
    deleteFile(fileToEncrypt)

    saveDataFileIntoJsonDb(fileUploadName, fileUploadPath, pubKey, fileHash)

    return {
        name: fileUploadName,
        download: downloadLinkCreator(host, fileUploadName, targetNewFileEncrypted),
        pubKey: clearPubKeyRaw(pubKey),
        size: fs.statSync(fileUploadPath).size,
        hash: fileHash
    }
}

const saveDataFileIntoJsonDb = async (fileUploadName, fileUploadPath, pubKey, fileHash) => {
    jsonfile.readFile(DB_FILE_NAME)
        .then((db) => {                        
            jsonfile.writeFile(DB_FILE_NAME, db.concat({
                fileName: fileUploadName,
                path: fileUploadPath,
                pubKey: pubKey,
                size: fs.statSync(fileUploadPath).size,
                hash: fileHash
            }))
        }).catch(() => jsonfile.writeFile(DB_FILE_NAME, [{
            fileName: fileUploadName,
            path: fileUploadPath,
            pubKey: pubKey,
            size: fs.statSync(fileUploadPath).size,
            hash: fileHash
        }]))
}