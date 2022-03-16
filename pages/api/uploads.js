import { DB_FILE_NAME } from '../../src/config'
import jsonfile from 'jsonfile'
import File from '../../src/modules/File'

export const config = {
  api: {
    bodyParser: false
  }
};

const get = async (req, res) => {
  const hash = req.query.f  
  const db = jsonfile.readFileSync(DB_FILE_NAME)
  const element = db.find((item) => item.hash === hash)  
  const file = File.fromRawDb(element)
  const data = file.getDataDescompress()

  res.setHeader('Content-Description', 'File Transfer')
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', 'attachment; filename=' + data.fileName)
  
  res.status(200).send(data.toString())
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