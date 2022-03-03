import formidable from 'formidable';
import verify from '../../src/modules/jwt/verify'
import fs from 'fs'
import {DB_FILE_NAME} from '../../src/config'
import jsonfile from 'jsonfile';

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (!verify(fields.jwt)) {
      res.status(400).json({message: 'Token incorrect'})
      return
    }
    
    const db = jsonfile.readFileSync(DB_FILE_NAME)
    const fileToDelete = db.filter((item) => {
      return item.hash === fields.fileId
    })
    
    fs.unlinkSync(fileToDelete[0].path)

    jsonfile.writeFileSync(DB_FILE_NAME, db.filter((item) => {
      return item.hash !== fields.fileId
    }))

    res.status(200).json({})
  })
  
};

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