import { UPLOAD_PATH, DIR_UPLOAD_FILE, DB_FILE_NAME } from '../../src/config'
import jsonfile from 'jsonfile'
import File from '../../src/modules/File'

export const config = {
  api: {
    bodyParser: false
  }
};

const get = async (req, res) => {
  const host = req.headers.host

  const db = jsonfile.readFileSync(DB_FILE_NAME)

  res.status(200).json(db.map(({name, pubKey, hash}) => {
    const file = new File(DIR_UPLOAD_FILE, name, hash, pubKey)

    return file.getFile(host, UPLOAD_PATH)
  }))
};

const handler = (req, res) => {
  switch(req.method) {
    case "GET":
      get(req, res)
      break;
    default:
      res.status(404).send("Error !");
  }
};

export default handler