import detectEthereumProvider from "@metamask/detect-provider";

export default class MetamaskProvider {
    account = null

    constructor() {
        this._startApp()
    }

    async _startApp() {
        const provider = await detectEthereumProvider();
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
            console.error('Do you have multiple wallets installed?');
        } else {
            console.log('Please install MetaMask!');
            return
        }
    }

    async getAccount() {
        return ethereum
            .request({ method: 'eth_accounts' })
            .then(async (accounts) => {
                if (accounts.length === 0) {
                    try {
                        const accounts = await this._connectWithMetamask()
                        this.account = accounts[0]
                        console.log('account->', this.account)
                        return this.account
                    } catch (error) {
                        if (error.code == -32002) {
                            alert('Connect metamask wallet or unlock')
                        }
                        console.log(error)
                    }
                    // MetaMask is locked or the user has not connected any accounts
                    console.log('Please connect to MetaMask.');
                    return 
                }

                this.account = accounts[0]
                console.log('account->', this.account)
                return this.account        
            })
            .catch((error) => {
                console.log(error)
            })
    }

    _connectWithMetamask() {
        return ethereum.request({ method: 'eth_requestAccounts' })            
    }

    sign(textToSign) {
        return ethereum
            .request({ 
                method: 'personal_sign',
                "params": [textToSign, this.account]
            })
            .then((sign) => ({sign: sign, account: this.account}))
            .catch((error) => alert('Metamask accounts mismatch'))
    }

      getPubKey(metaAccount) {
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

    decryptMessageOnBase64(encryptedMessage, metaAccount) {
        return ethereum
            .request({
                method: 'eth_decrypt',
                params: [encryptedMessage, metaAccount],
            })
            .then((decryptedMessage) => decode(decryptedMessage))
            .catch((error) => console.log(error.message));
    }

    accountShortFormat (metaAccount) {
        return metaAccount.substring(0,5) + 
            '...' + 
            metaAccount.substring(metaAccount.length-3, metaAccount.length)
    }
}