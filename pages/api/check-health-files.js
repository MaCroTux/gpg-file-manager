import fs from 'fs'
import path from 'path'
import { DIR_UPLOAD_FILE, ENCRYPT_EXT, DB_FILE_NAME, downloadLinkCreator, clearPubKeyRaw } from '../../src/config'
import jsonfile from 'jsonfile'

export const config = {
  api: {
    bodyParser: false
  }
};

const get = async (req, res) => {
  const db = jsonfile.readFileSync(DB_FILE_NAME).map((item) => item.fileName)
  const fileFromUploads = fs.readdirSync(path.dirname(`${DIR_UPLOAD_FILE}/*/`))

  const dbDiff = db
    .filter(x => !fileFromUploads.includes(x))
    .concat(fileFromUploads.filter(x => !db.includes(x)));

  res.status(200).json(dbDiff)
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
