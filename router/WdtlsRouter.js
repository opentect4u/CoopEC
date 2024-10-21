const WdtlsRouter = require('express').Router()
const moment = require('moment');
const multer = require('multer'); 
const path = require("path");
const {db_Select,db_Insert} = require('../modules/MasterModule');
WdtlsRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
});

WdtlsRouter.get('/doclist', async(req, res) => {
  try {
      // Extract range_id from session
     
      const doclist = await db_Select('*', 'td_document_upload', null, null);
      // Prepare data for rendering
      const res_dt = {
        data:doclist.suc > 0 ? doclist.msg : '', 
      };
      res.render('websitedtls/document_list',res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('websitedtls/document_list');
    }
})
WdtlsRouter.get('/adddoc', async(req, res) => {
  try {
      // Extract range_id from session
      const soc_id = req.query.id;
      const range_id = req.session.user.range_id;
      const doctyperes = await db_Select('*', 'md_document', null, null);
      // Prepare data for rendering
      var res_dt = {
        doctypelist:doctyperes.suc > 0 ? doctyperes.msg : '',
      };
      // Render the view with data
      res.render('websitedtls/add_doc',res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      
    }
})

// Set up storage and multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const typeId = req.body.doc_type; // Get typeId from the request body
    if(typeId == 1){
      var uploadDir = path.join(__dirname,'..','uploads/notifications/');
    }else if(typeId == 2){
      var uploadDir = path.join(__dirname,'..','uploads/tenders/');
    }else{
      var uploadDir = path.join(__dirname,'..','uploads/announcement/');
    }
    // Create the directory if it doesn't exist
    

    cb(null, uploadDir); // Use the directory based on typeId
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for file name
  }
});

const upload = multer({ storage: storage });

// File upload route
WdtlsRouter.post('/uploaddoc', upload.single('document'), async (req, res) => {
  var user = req.session.user;
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const newFile = {
    filename: req.file.filename,
  };
  var data = req.body
  var table_name = "td_document_upload";
  var fields = `(doc_type,doc_title,document,folder_name)`;
  var values = `('${data.doc_type}','${data.doc_title.split("'").join("\\'")}','${newFile.filename}','uploads/notifications/')`;
  var whr = null;
  var save_data = await db_Insert(table_name, fields, values, whr, 0);
  if(user.user_type == 'S'){
    res.redirect("/wdtls/adddoc");
  }else{
    res.redirect("/wdtls/announcelist");
  }
  
});

WdtlsRouter.get('/announcelist', async(req, res) => {
  try {
      // Extract range_id from session
      var whr = `doc_type = 3 `;
      const doclist = await db_Select('*', 'td_document_upload', whr, null);
      // Prepare data for rendering
      const res_dt = {
        data:doclist.suc > 0 ? doclist.msg : '', 
      };
      res.render('websitedtls/document_list',res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('websitedtls/document_list');
    }
})
WdtlsRouter.get('/addannouncement', async(req, res) => {
  try {
      // Extract range_id from session
      const soc_id = req.query.id;
      const range_id = req.session.user.range_id;
      var whr = `upload_auth = 'A' `;
      const doctyperes = await db_Select('*', 'md_document', whr, null);
      // Prepare data for rendering
      var res_dt = {
        doctypelist:doctyperes.suc > 0 ? doctyperes.msg : '',
      };
      // Render the view with data
      res.render('websitedtls/add_doc',res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      
    }
})



WdtlsRouter.get('/gallerylist', async(req, res) => {
  try {
      // Extract range_id from session
      var whr = `doc_type = 3 `;
      const doclist = await db_Select('*', 'td_gallery', null, null);
      // Prepare data for rendering
      const res_dt = {
        data:doclist.suc > 0 ? doclist.msg : '', 
      };
      res.render('websitedtls/gallery/list',res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('websitedtls/gallerylist');
    }
})
WdtlsRouter.get('/addgallery', async(req, res) => {
  try {
      res.render('websitedtls/gallery/add');
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
    }
})
// Set storage engine



// Set storage engine
const storage_gallery = multer.diskStorage({
  destination: './assets/gallery/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer
const upload_gall = multer({
  storage: storage_gallery,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).single('gall_img'); // 'gall_img' is the name of the input field in the form

// File upload route
WdtlsRouter.post('/uploadgall', upload_gall, async (req, res) => {
  try {
    var user = req.session.user;
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const newFile = {
      filename: req.file.filename,
    };
    var data = req.body;
    var table_name = "td_gallery";
    var fields = `(title, gal_img)`;
    var values = `('${data.title.split("'").join("\\'")}','${newFile.filename}')`;
    
    var save_data = await db_Insert(table_name, fields, values, null, 0);
    
    if (!save_data) {
      return res.status(500).send('Database error: Unable to save the data.');
    }
    
    res.redirect("/wdtls/gallerylist");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = {WdtlsRouter}