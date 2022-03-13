import { ENCRYPT_EXT, DB_FILE_NAME, downloadLinkCreator, clearPubKeyRaw, getLink } from '../../src/config'
import jsonfile from 'jsonfile'

export const config = {
  api: {
    bodyParser: false
  }
};

const get = async (req, res) => {
  const host = req.headers.host

  const db = jsonfile.readFileSync(DB_FILE_NAME)

  res.status(200).json(db.map(({fileName, pubKey, size, hash}) => {
    return {
      name: fileName,
      pubKey: clearPubKeyRaw(pubKey),
      size,
      download: clearPubKeyRaw(pubKey) === 'Metamask' 
        ? getLink(host, fileName) 
        : downloadLinkCreator(host, fileName.replace(ENCRYPT_EXT, ''), hash),
      hash
    }
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