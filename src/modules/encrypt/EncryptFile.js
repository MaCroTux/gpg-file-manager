import fs from "fs";
import * as openpgp from 'openpgp';
import path from 'path'

export const encryptFile = async (pubKeyFilePath, filePath) => {
    const pubKey = fs.readFileSync(path.join(pubKeyFilePath));
    const publicKey = await openpgp.readKeys(
        { 
            armoredKeys: pubKey.toString() 
        }
    );
    const message = await openpgp.createMessage(
        { 
            text: fs.readFileSync(path.join(filePath)).toString()
        }
    )

    let encrypted = await openpgp.encrypt(
        {
            message,
            encryptionKeys: publicKey,
        }
    );

    return encrypted.toString();
}