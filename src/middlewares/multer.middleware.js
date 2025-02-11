// Import multer package for handling multipart/form-data
import multer from 'multer'

// Configure storage settings for uploaded files
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    // Define how files should be named when saved
    filename: function (req, file, cb) {
     
      cb(null, file.originalname)
    }
  })
  
// Create and export multer middleware instance with defined storage configuration
export const upload = multer({ storage, })  