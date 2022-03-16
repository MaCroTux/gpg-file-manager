import jsonfile from "jsonfile"
import { DB_FILE_NAME } from "../../config"

export const saveDataFileIntoJsonDb = async (file) => {
    const fileData = await file.getRawFileWithDataCompress()

    jsonfile.readFile(DB_FILE_NAME)
        .then(db => jsonfile.writeFile(DB_FILE_NAME, db.concat(fileData)))
        .catch(() => jsonfile.writeFile(DB_FILE_NAME, [fileData]))
}