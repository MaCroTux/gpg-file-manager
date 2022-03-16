import fs from 'fs'

export default class File {    
    constructor (path, nameFile, hash, pubKey) {
        this.path = path
        this.nameFile = nameFile
        this.fileHash = hash
        this.pubKey = pubKey
    }

    getFile (host, pathDownload) {
        return {
            name: this.nameFile,
            download: this._clearPubKeyRaw(this.pubKey) === 'Metamask'
              ? this._getLink(host, pathDownload) 
              : this._downloadLinkCreator(host, pathDownload),
            pubKey: this._clearPubKeyRaw(this.pubKey),
            size: fs.statSync(this.path + this.fileHash).size,
            hash: this.fileHash
        }
    }

    _downloadLinkCreator(host, pathDownload) {
        return `curl http://${host}/${pathDownload}/${this.fileHash} | gpg --decrypt -o ${this.nameFile}`
    }
    
    _getLink(host, pathDownload) {
        return `http://${host}/${pathDownload}/${this.fileHash}`
    }

    _clearPubKeyRaw(pubKey) {
        return pubKey.replace('-pub.key', '').replace(/^\w/, (c) => c.toUpperCase())
    }
}