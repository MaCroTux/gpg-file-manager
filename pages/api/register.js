import jsonfile from 'jsonfile'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {  
  try {
    const result = jsonfile.readFileSync('deviceAllow.js')
    res.status(400).json({status: 400, message: 'Device already registered'})
  } catch (error) {
    if (error.code === 'ENOENT') {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const idDevice = fields.idDevice
        const name = fields.name
        const displayName = fields.displayName
        const siteName = fields.siteName
        jsonfile.writeFileSync('deviceAllow.js', {
          idDevice,
          name,
          displayName
        })
    
        res.status(200).json({status: 200, message: 'Device register'})
      })
    }
  }
};

const get = async (req, res) => {
  try {
    const result = jsonfile.readFileSync('deviceAllow.js')
    res.status(200).json({idDevice: result.idDevice})
  } catch (error) {
    res.status(400).json({status: 400, message: 'Device unkonw'})
  }
};

const handler = (req, res) => {
  switch(req.method) {
    case "POST":
      post(req, res)
      break;
    case "GET":
      get(req, res)
      break;
    default:
      res.status(404).json({error: 404, message: 'Page not found'});
  }
};

export default handler
