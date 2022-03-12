import formidable from 'formidable';
import fs from 'fs';
import { UploadAndEncrypt } from "../../src/modules/UploadAndEncrypFile"
import { clearPubKeyRaw, DIR_UPLOAD_FILE, downloadLinkCreator, METAMASK_ENCRYPT_EXT } from '../../src/config'
import crypto from 'crypto'
import { saveDataFileIntoJsonDb } from '../../src/modules/upload/JsonDb';

const PUB_DEFAULT_KEY = 'yubikey-pub.key'

export const config = {
  api: {
    bodyParser: false
  }
};

const post = (req, res) => {
  const host = req.headers.host
  try {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      const pubKey = fields?.pubKey || PUB_DEFAULT_KEY

      if ((fields.fileEncryt ?? false) && (fields.fileName ?? false)) {
        const data = fields.fileEncryt
        const fileName = fields.fileName
        const fileUploadPath = DIR_UPLOAD_FILE + fileName + METAMASK_ENCRYPT_EXT
        fs.writeFileSync(fileUploadPath, data)
        const sha1 = crypto.createHash('md5')
        const fileHash = sha1.update(data).digest('hex')
        saveDataFileIntoJsonDb(fileName + METAMASK_ENCRYPT_EXT, fileUploadPath, pubKey, fileHash)

        return res.status(200).json({
          name: fileName + METAMASK_ENCRYPT_EXT,
          download: clearPubKeyRaw(pubKey) === 'Metamask' 
            ? getLink(host, fileName) 
            : downloadLinkCreator(host, fileName + METAMASK_ENCRYPT_EXT, fileName),
//          download: downloadLinkCreator(host, fileName + METAMASK_ENCRYPT_EXT, fileName),
          pubKey: clearPubKeyRaw(pubKey),
          size: fs.statSync(fileUploadPath).size,
          hash: fileHash
        })
      } else {
        const file = files.file.filepath
        const targetFileName = files.file.originalFilename

        UploadAndEncrypt(host, pubKey, file, targetFileName)
          .then((response) => {
            return res.status(200).json(response)
          })
          .catch((error) => {
            console.log(error)
            return res.status(500).json({})
          })
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({})
  }
}

const handler = (req, res) => {
  switch(req.method) {
    case "POST":
      post(req, res)
      break;    
    default:
      res.status(404).send("Error !");
  }
};

export default handler