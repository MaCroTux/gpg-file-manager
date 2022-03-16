const PATH_UPLOAD = 'uploads'

export const DIR_PUB_KEY = './keys/'
export const DB_FILE_NAME = 'file_db.json'
export const UPLOAD_PATH = PATH_UPLOAD

export function clearPubKeyRaw(pubKey) {
    return pubKey.replace('-pub.key', '').replace(/^\w/, (c) => c.toUpperCase())
}