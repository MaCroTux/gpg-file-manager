import fs from 'fs'

export const writeFileWithContent = (pathFileName, contents) => {    
    return fs.writeFileSync(pathFileName, contents);
}

export const  deleteFile = (filepath) => {
    fs.unlinkSync(filepath);
}