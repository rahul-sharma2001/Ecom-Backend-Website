const express = require('express');
const router = express.Router();
const multer =  require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const imageUpload =  require('../controllers/imageUpload.js')

const storage = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null,'public/assests/images');
    },
    filename:(req,file,cb)=>{
        cb(null ,uuidv4()+ path.extname(file.originalname));
    }
  })

const upload = multer({storage: storage})
router.post('/',upload.array('images',5),imageUpload);
router.get('/',(req,res)=>{
    res.send('upload image');
})

module.exports = router;