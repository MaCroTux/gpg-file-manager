import * as openpgp from 'openpgp';

export const encryptFile = async (pubKeyData, fileData) => {
    const publicKey = await openpgp.readKeys(
        { 
            armoredKeys: pubKeyData.toString()
        }
    );
    const message = await openpgp.createMessage(
        { 
            text: fileData.toString()
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