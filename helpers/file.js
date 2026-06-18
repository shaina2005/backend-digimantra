import Fs, { readFileSync } from "fs";

export const checkIfFileExists = (filePath) => {
    return Fs.existsSync(filePath);
};

export const readFile = (filePath) => {
  if (checkIfFileExists(filePath)) {
    const data = readFileSync(filePath, "utf8");
    if (!data || data.trim() === "") {
      return [];
    }
      return JSON.parse(data);
  }
  return []
};

export const findUserById = (filePath, id) => {
  console.log("id" , id);
  
  const data = readFile(filePath);
  console.log("data" , data);
  const userExists = data.find((user) => user.id === id );
  console.log("userExists" , userExists);

  return userExists;
};

export const findUserByEmail = (filePath , email)=>{
   const data = readFile(filePath);
  const userExists = data.find((user) => user.email === email );

  return userExists;

}
// export const getUserIndex = (filePath , id){

// }
