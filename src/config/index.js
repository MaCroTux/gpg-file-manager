const PATH_UPLOAD = 'uploads'

export const DIR_PUB_KEY = './keys/'
export const ENCRYPT_EXT = '.gpg'
export const METAMASK_ENCRYPT_EXT = '.eth'
export const DIR_UPLOAD_FILE = './public/uploads/'
export const DB_FILE_NAME = 'file_db.json'

export function downloadLinkCreator(host, originFileName, fileHash) {
    return `curl http://${host}/${PATH_UPLOAD}/${fileHash} | gpg --decrypt -o ${originFileName}`
}

export function getLink(host, fileHash) {
    return `http://${host}/${PATH_UPLOAD}/${fileHash}`
}

export function clearPubKeyRaw(pubKey) {
    return pubKey.replace('-pub.key', '').replace(/^\w/, (c) => c.toUpperCase())
}