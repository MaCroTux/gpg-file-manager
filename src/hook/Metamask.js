import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3'

const TEXT_TO_SIGN_METAMASK = 'I register with accounts: '

const Metamask = (metaAccount) => {
    function startApp(provider) {
        // If the provider returned by detectEthereumProvider is not the same as
        // window.ethereum, something is overwriting it, perhaps another wallet.
        if (provider !== window.ethereum) {
          console.error('Do you have multiple wallets installed?');
        }
        // Access the decentralized web!
      }

    const registerMetamaskCredential = () => {
        let connect = async () => {
            try {
                const provider = await detectEthereumProvider();
                console.log(provider);       
                if (provider) {
                    startApp(provider); // Initialize your app
                } else {
                    console.log('Please install MetaMask!');
                }
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
            const provider = await detectEthereumProvider();

            if (provider) {
                startApp(provider); // Initialize your app
            } else {
                alert('Please install MetaMask!')
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
                console.log(accountWithRegister, accounts[0])
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

    return {registerMetamaskCredential, metamaskLoggin}
}

export default Metamask