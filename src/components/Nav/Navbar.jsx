import { Children } from "react/cjs/react.production.min";

export default function Navbar ({children}) {

    return <ul className="nav justify-content-end">
        <li className="nav-item">
            {
                children.map(({active = false, text = '?', fnOnClick = null}) => {
                    return <a 
                        key={text}
                        className="nav-link {active ? 'active' : ''}" 
                        aria-current="page" 
                        onClick={fnOnClick}
                        href="#">{text}</a>
                })
            }            
        </li>          
    </ul>
}