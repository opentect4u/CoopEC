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
  res.redirect("/wdtls/adddoc");
});

module.exports = {WdtlsRouter}