const express = require('express');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/image/uplodes');
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(12, (err, name)=>{
            const fn = name.toString("hex")+path.extname(file.originalname);
            cb(null, fn);
        })
        
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
