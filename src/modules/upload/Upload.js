import fs from 'fs'

export const writeFileWithContent = (pathFileName, contents) => {    
    return fs.writeFileSync(pathFileName, contents);
}

export const moveFileUpload = async (pathFileName, newPathFileName) => {    
    fs.copyFile(pathFileName, newPathFileName, () => deleteFile(pathFileName));
}

export const  deleteFile = (filepath) => {
    fs.unlinkSync(filepath);
}