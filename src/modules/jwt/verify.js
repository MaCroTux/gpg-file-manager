import jsonfile from 'jsonfile';
import jwt from 'jsonwebtoken'

export default function verify(token) {
    const {SECRET} = jsonfile.readFileSync('env.json')
    try {
        jwt.verify(token, SECRET)
        return true;
    } catch {
        return false;
    }
}