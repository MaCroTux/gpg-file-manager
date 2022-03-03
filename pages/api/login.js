import jsonfile from 'jsonfile'
import formidable from 'formidable'
import Web3 from 'web3';
import jwt from 'jsonwebtoken'

const env = jsonfile.readFileSync('env.json')
const ETH_PROVIDER_HTTP = env.ETH_API_PROVIDER
const SECRET = env.SECRET

const TEXT_TO_SIGN_METAMASK = "I register with accounts: "

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {  
  try {    
    const result = jsonfile.readFileSync('deviceAllow.js')
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      const metaAccount = result.idDevice
      const textToSign = TEXT_TO_SIGN_METAMASK + metaAccount
      const web3 = new Web3(new Web3.providers.HttpProvider(ETH_PROVIDER_HTTP));
      const response = web3.eth.accounts.recover(textToSign, fields.sing)

      if (metaAccount.toUpperCase() === response.toUpperCase()) {
        res.status(200).json({
            result: true,
            account: response,
            jwt: jwt.sign({account: response}, SECRET, { expiresIn: '1h' })
        })
        return 
      } else {
        res.status(200).json({
          result: false,
          account: response,
          jwt: null
        })
        return 
      }
    })    
  } catch (error) {
    console.log(error)
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
