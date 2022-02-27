import { encryptFile } from './encrypt/EncryptFile'
import { writeFileWithContent, deleteFile } from './upload/Upload';
import { DIR_PUB_KEY } from '../../src/config'

const DIR_UPLOAD = './uploads/'
const EXCRYPT_EXTENSION = '.gpg'

export const UploadAndEncrypt = async (pubKey, fileToEncrypt, targetNewFileEncrypted) => {
    const encryptData = await encryptFile(DIR_PUB_KEY + pubKey, fileToEncrypt);
    const fileUploadPath = DIR_UPLOAD + targetNewFileEncrypted + EXCRYPT_EXTENSION

    writeFileWithContent(fileUploadPath, encryptData)
    deleteFile(fileToEncrypt)

    return {
        name: targetNewFileEncrypted + EXCRYPT_EXTENSION,
        uploadPatch: fileUploadPath,
    }
}