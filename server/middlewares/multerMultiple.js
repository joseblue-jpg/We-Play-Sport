import multer from 'multer';
import fs from 'fs';

const createFolder = (folder) =>{
  if(!fs.existsSync(folder)){
    fs.mkdirSync(folder, {recursive:true});
  }
}

const uploadImage = () => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb){
        
          createFolder(`./public/images/${file.fieldname}`)
          cb(null, `public/images/${file.fieldname}`)
        },
        
        filename: function (req, file, cb){
            cb(null, "Id-" + Date.now() + "-" + file.originalname);
        }
    });
    const upload = multer({storage:storage}).fields([{name:"user_photo"}, {name:"file"}]);
    return upload;
}
export default uploadImage;