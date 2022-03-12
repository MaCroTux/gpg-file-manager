import detectEthereumProvider from '@metamask/detect-provider'
import { encrypt } from '@metamask/eth-sig-util'
import { decode, encode } from '../modules/utils/base64'

const TEXT_TO_SIGN_METAMASK = 'I register with accounts: '

export const Metamask = () => {
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
        let connect = async () => {
            try {
                await startApp();            
            } catch (error) {
                console.log(error)
            }

            return ethereum
                .request({ method: 'eth_accounts' })
                .then((accounts) => {                    
                    if (accounts.length === 0) {
                        // MetaMask is locked or the user has not connected any accounts
                        console.log('Please connect to MetaMask.'); 
                        return 
                    }

                    return accounts[0]                                        
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        return ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => connect())
            .catch((error) => {
                if (error.code == -32002) {
                    alert('Connect metamask wallet or unlock')
                }
                console.log(error)
            })
        
    }

    const metamaskLoggin = (accountWithRegister) => {        
        let connect = async (metaAccount) => {        
            try {
                await startApp();            
            } catch (error) {
                console.log(error)
            }

            //let web3 = new Web3(provider);
            const textToSign = TEXT_TO_SIGN_METAMASK + metaAccount

            return ethereum
                .request({ 
                    method: 'personal_sign',
                    "params": [textToSign, metaAccount]
                })
                .then((sing) => ({sing: sing, account: metaAccount}))
                .catch((error) => alert('Metamask accounts mismatch'))
        }

        return ethereum.request({ method: 'eth_requestAccounts' }).
            then((accounts) => {
                if (accountWithRegister !== accounts[0]) {
                    console.log(`Metamask accounts ${accounts[0]} and saved account ${accountWithRegister} allow is mismatch`);
                    alert('Metamask accounts and saved account allow is mismatch')
                    return
                }

                return ethereum
                    .request({ method: 'eth_accounts' })
                    .then((accounts) => connect(accounts[0]).then((result) => result))
                    .catch((error) => console.log(error))   
            });        
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
    return ethereum
        .request({
            method: 'eth_decrypt',
            params: [encryptedMessage, metaAccount],
        })
        .then((decryptedMessage) => decode(decryptedMessage))
        .catch((error) => console.log(error.message));
}

export const accountShortFormat = (metaAccount) => 
    metaAccount.substring(0,5) + 
        '...' + 
        metaAccount.substring(metaAccount.length-3, metaAccount.length)