import Fs, { readFileSync } from "fs"

export const readFile = (filePath)=>{
    const data = JSON.parse(readFileSync(filePath , "utf8"));

    return data
    
}

export const userExists =(filePath , email)=>{
    const data = readFile(filePath);
    const userExists = data.find(user => user.email === email ? user : false)

    return userExists;
}