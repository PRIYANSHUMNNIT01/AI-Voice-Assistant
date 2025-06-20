import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public"); // ✅ fixed "nukk" to "null"
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // ✅ fixed "nukk" to "null"
  },
});

const upload = multer({ storage });
export default upload;
