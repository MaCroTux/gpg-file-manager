import fs from 'fs'
import path from 'path'
import { DIR_UPLOAD_FILE, ENCRYPT_EXT, downloadLinkCreator } from '../../src/config'

export const config = {
  api: {
    bodyParser: false
  }
};

const get = async (req, res) => {
  const host = req.headers.host
  const fileFromUploads = fs.readdirSync(path.dirname(`${DIR_UPLOAD_FILE}/*/`))

  const uploadList = fileFromUploads.map((fileName) => {
    console.log(fileName)
    const originFileName = fileName.replace(ENCRYPT_EXT, '')

    return {
      name: fileName,
      download: downloadLinkCreator(host, fileName, originFileName),
    }
  })

  res.status(200).json(uploadList)
};

export default (req, res) => {
  switch(req.method) {
    case "GET":
      get(req, res)
      break;
    default:
      res.status(404).send("Error !");
  }
};
