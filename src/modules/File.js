var zlib = require('zlib');
import { decode } from '../../src/modules/utils/base64'

export default class File {    
    constructor (fileName, fileData, fileHash, pubKeyFile) {
        this.fileName = fileName
        this.fileData = fileData
        this.fileHash = fileHash
        this.pubKeyFile = pubKeyFile
        this.size = Buffer.byteLength(fileData)
    }

    static fromRawDb(rawData) {
        return new this(
            rawData.fileName,             
            rawData.data,
            rawData.hash, 
            rawData.pubKeyFile            
        )
    }

    getDataDescompress() {
        return zlib.inflateSync(new Buffer(this.fileData, 'base64'))
    }

    async getRawFileWithDataCompress() {
        return {
            fileName: this.fileName,            
            pubKeyName: this._clearPubKeyRaw(this.pubKeyFile),
            pubKeyFile: this.pubKeyFile,
            size:this.size,            
            hash: this.fileHash,
            data: zlib.deflateSync(this.fileData).toString('base64')
        }
    }

    getFileShowData (host, pathDownload) {
        return {
            name: this.fileName,
            download: this._clearPubKeyRaw(this.pubKeyFile) === 'Metamask'
              ? this._getLink(host, pathDownload) 
              : this._downloadLinkCreator(host, pathDownload),
            pubKey: this._clearPubKeyRaw(this.pubKeyFile),
            size: this.size,
            hash: this.fileHash
        }
    }

    _downloadLinkCreator(host, pathDownload) {
        return `curl 'http://${host}/api/${pathDownload}?f=${this.fileHash}' | gpg --decrypt -o ${this.fileName}`
    }
    
    _getLink(host, pathDownload) {
        return `http://${host}/api/${pathDownload}?f=${this.fileHash}`
    }

    _clearPubKeyRaw(pubKey) {
        return pubKey.replace('-pub.key', '').replace(/^\w/, (c) => c.toUpperCase())
    }
}