import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(process.cwd() + "/uploads"));
//   },

//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     console.log("unioquename", uniqueName);

//     cb(null, uniqueName);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg files are allowed"), false);
  }
};
const upload = multer({
  storage,
  limits: {
    files: 5,
    fileSize : 1024*1024*5,
  },
  fileFilter,
});

export default upload;
