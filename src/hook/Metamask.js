import detectEthereumProvider from '@metamask/detect-provider'
import { encrypt } from '@metamask/eth-sig-util'
import MetamaskProvider from '../modules/EthProvider/MetamaskProvider'
import { decode, encode } from '../modules/utils/base64'

const TEXT_TO_SIGN_METAMASK = 'I register with accounts: '

export const Metamask = () => {
    const metamask = new MetamaskProvider()

    async function startApp() {
        const provider = await detectEthereumProvider();
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
          console.error('Do you have multiple wallets installed?');
        } else {
            console.log('Please install MetaMask!');
            return
        }

        return provider
      }

    const registerMetamaskCredential = () => {
        return metamask.getAccount()
    }

    const metamaskLoggin = async (accountWithRegister) => {
        const account = await metamask.getAccount()
        if (accountWithRegister.toUpperCase() !== account.toUpperCase()) {
            console.log(`Metamask accounts ${account} and saved account ${accountWithRegister} allow is mismatch`);
            alert('Metamask accounts and saved account allow is mismatch')
            return
        }

        const textToSign = TEXT_TO_SIGN_METAMASK + account
        return await metamask.sign(textToSign)
    }

    return {registerMetamaskCredential, metamaskLoggin, startApp}
}

export const getPubKey = (metaAccount) => {
    return ethereum
        .request({
            method: 'eth_getEncryptionPublicKey',
            params: [metaAccount], // you must have access to the specified account
        })
        .then((result) => {
            return result;
        })
        .catch((error) => {
            if (error.code === 4001) {
                console.log("We can't encrypt anything without the key.");
            } else {
                conole.error(error);
            }
        });
}

export const encryptedMessageOnBase64 = (encryptionPublicKey, dataToEncode) => {
    const ethUtil = require('ethereumjs-util');
    return ethUtil.bufferToHex(
        Buffer.from(
            JSON.stringify(
                encrypt({
                    publicKey: encryptionPublicKey,
                    data: encode(dataToEncode),
                    version: 'x25519-xsalsa20-poly1305',
                }) 
            ),
            'utf8'
        )
    )
}

export const decryptMessageOnBase64 = (encryptedMessage, metaAccount) => {
    const metamask = new MetamaskProvider()
    return metamask.decryptMessageOnBase64(encryptedMessage, metaAccount)
}

export const accountShortFormat = (metaAccount) => {
    if (typeof metaAccount !== 'string') {
        return null
    }

    return metaAccount.substring(0,5) + 
        '...' + 
        metaAccount.substring(metaAccount.length-3, metaAccount.length)
}