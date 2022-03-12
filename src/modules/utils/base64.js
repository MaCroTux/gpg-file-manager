export const encode = (data) => {
    return Buffer.from(data).toString('base64')
}

export const decode = (base64) => {
    return Buffer.from(base64, 'base64').toString()
}