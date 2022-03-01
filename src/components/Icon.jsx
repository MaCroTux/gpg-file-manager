export default function Icon ({iconName, iconAling = 'right', fontSize = '1.3rem', iconColor = 'cornflowerblue', children}) {
    const iconClassName = 'bi bi-' + iconName

    return <>
        <i className={iconClassName} style={{marginLeft: iconAling, fontSize: fontSize, color: iconColor}}></i> {children}
    </>
}