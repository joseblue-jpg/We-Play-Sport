import multer from 'multer';
const uploadImage = (folder) => {
    const storage = multer.diskStorage({
        destination: `./public/images/${folder}`,
        filename: function (req, file, cb){
            cb(null, "Id-" + Date.now() + "-" + file.originalname);
        }
    });
    const upload = multer({storage: storage}).single("img");
    return upload;
}
export default uploadImage;