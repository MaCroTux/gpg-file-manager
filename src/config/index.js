const PATH_UPLOAD = 'uploads'

export const DIR_PUB_KEY = './keys/'
export const ENCRYPT_EXT = '.gpg'
export const DIR_UPLOAD_FILE = './public/uploads/'
export const DB_FILE_NAME = 'file_db.json'

export function downloadLinkCreator(host, fileName, originFileName) {
    return `curl http://${host}/${PATH_UPLOAD}/${fileName} | gpg --decrypt -o ${originFileName}`
}

export function clearPubKeyRaw(pubKey) {
    return pubKey.replace('-pub.key', '').replace(/^\w/, (c) => c.toUpperCase())
}