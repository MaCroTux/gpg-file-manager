import fs from 'fs'
import path from 'path'
import { DIR_PUB_KEY } from '../../src/config'

export const config = {
  api: {
    bodyParser: false
  }
};

const get = async (req, res) => {
  let keyList = fs.readdirSync(path.dirname(`${DIR_PUB_KEY}/*/`)).map((fileName) => {
    return {
      name: fileName.replace('-pub.key', '').replace(/^\w/, (c) => c.toUpperCase()),
      pubKey: fileName,
    }    
  })

  res.status(200).json(keyList)
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
