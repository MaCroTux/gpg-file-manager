import formidable from 'formidable';
import { UploadAndEncrypt } from "../../src/modules/UploadAndEncrypFile"

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
      const file = files.file.filepath
      const targetFileName = files.file.originalFilename
      const pubKey = fields?.pubKey || PUB_DEFAULT_KEY

      UploadAndEncrypt(host, pubKey, file, targetFileName)
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