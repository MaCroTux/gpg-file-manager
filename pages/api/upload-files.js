import formidable from 'formidable';
import { UploadAndEncrypt } from "../../src/modules/UploadAndEncrypFile"

const PUB_DEFAULT_KEY = 'yubikey-pub.key'

export const config = {
  api: {
    bodyParser: false
  }
};

const post = (req, res) => {
  try {
    const form = new formidable.IncomingForm(); 
    
    form.parse(req, async (err, fields, files) => {
      const file = files.file.filepath
      const targetFileName = files.file.originalFilename
      const pubKey = fields?.pubKey || PUB_DEFAULT_KEY

      UploadAndEncrypt(pubKey, file, targetFileName)
        .then((response) => {
          return res.status(200).json(response)
        })
        .catch((error) => {
          console.log(error)
          return res.status(500).json({})
        })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({})
  }
}

export default (req, res) => {  
  req.method === "POST"
      ? post(req, res)
      : () => {
          res.status(404).send("Error !");
        }
};