import Image from 'next/image';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { accountShortFormat, Metamask } from '../../hook/Metamask';

export default function Navbar ({setAdmin, metaAccount, setMetaAccount}) {
    const router = useRouter()
    const [login, setLogin] = useState(false)
    const {registerMetamaskCredential, metamaskLoggin} = Metamask(
        metaAccount, 
        setMetaAccount    
    )
    const fnOnClickLogin = async () => {
        const result = await fetch(`${router.basePath}/api/register`)
        if (result.status == '200') {
            const data = await result.json()

            metamaskLoggin(data.idDevice)
                .then((data) => {
                    if (!data?.sign) {
                        return 
                    }
                    let form = new FormData()
                    form.append('sing', data.sign)
                    fetch(`${router.basePath}/api/login`, {
                        method: 'POST',
                        body: form
                    })
                    .then((result) => result.json())
                    .then((result) => {
                        console.log(result.jwt)
                        localStorage.setItem('jwt', result.jwt)
                        localStorage.setItem('account', result.account)
                        setLogin(result.jwt)
                        setMetaAccount(result.account)
                        setAdmin(result.jwt)
                    })                    
                })            
        }        
    }

    const fnOnClickExit = async () => {
        localStorage.setItem('jwt', '')
        setLogin(false)
        setMetaAccount('')
        setAdmin(false) 
    }

    useEffect(() => {
        const jwt = localStorage.getItem('jwt')
        if (jwt) {
            setLogin(jwt)
            setAdmin(true)
        }
        const account = localStorage.getItem('account')
        if (account) {
            setMetaAccount(account)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fnOnClickRegister = () => {
        registerMetamaskCredential()
            .then(async (account) => {
                let form = new FormData()
                form.append('idDevice', account)
                form.append('name', 'Metamask')
                form.append('displayName', accountShortFormat(account))
                const result = await fetch(`${router.basePath}/api/register`, {
                    method: 'POST',
                    body: form
                })
                if (result.status == 400) {
                    setLogin(false)
                    alert('Device already registered')
                    return
                }

                if (result.status == 200) {
                    alert('Device registered')
                    setMetaAccount(account)
                    return
                }
            })
    }

    return <>    
        <ul className="nav justify-content-end nav-pills">
            {
                login 
                ? <>
                    <li className="nav-item">
                        <div className="nav-link" >
                            Login <strong>{accountShortFormat(metaAccount)}</strong>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link" 
                            aria-current="page" 
                            onClick={fnOnClickExit}
                            href="#">Exit</a>
                    </li>
                </>
                : <>
                    <li className="nav-item">
                        <a 
                            className="nav-link active" 
                            aria-current="page" 
                            onClick={fnOnClickLogin}
                            href="#"><Image style={{verticalAlign: 'middle'}} src="https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png" width={20} height={20} alt="Metamask" /> <span>Login with Metamask</span></a>
                    </li>            
                    <li className="nav-item">
                        <a 
                            className="nav-link {active ? 'active' : ''}" 
                            aria-current="page" 
                            onClick={fnOnClickRegister}
                            href="#">Register</a>
                    </li>
                </>
            }
        </ul>
    </>
}