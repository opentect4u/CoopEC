const WdtlsRouter = require('express').Router()
const moment = require('moment');
const multer = require('multer'); 
const path = require("path");
bcrypt = require("bcrypt");
const {db_Select,db_Insert,db_Delete} = require('../modules/MasterModule');
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
    }else if(typeId == 3){
      var uploadDir = path.join(__dirname,'..','uploads/announcement/');
    }else{
      var uploadDir = path.join(__dirname,'..','uploads/downloads/');
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
  var date_ob = moment();
// Format it as YYYY-MM-DD HH:mm:ss
   var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const newFile = {
    filename: req.file.filename,
  };
  var data = req.body
  var table_name = "td_document_upload";
  var fields = `(doc_type,doc_title,document,folder_name,created_at,created_by,created_ip)`;
  var values = `('${data.doc_type}','${data.doc_title.split("'").join("\\'")}','${newFile.filename}','','${formattedDate}','${user.user_id}','${ip}')`;
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
WdtlsRouter.get('/delgallery', async(req, res) => {
  try {
      var data = req.body;
      var id = req.query.id,where=`id = '${id}' `;
      var res_dt = await db_Delete("td_gallery", where);
     res.redirect("/wdtls/gallerylist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error('Error during dashboard rendering:', error);
    res.redirect("/wdtls/gallerylist");
  }
})
  //  ******  Code for Statistic  ******  //
WdtlsRouter.get('/statistic', async(req, res) => {
  try {
    const doclist = await db_Select('*', 'td_statistic', null, null);
    const res_dt = {datas:doclist.msg[0]}
      res.render('websitedtls/statistic',res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
    }
})
WdtlsRouter.post('/update_statistic', async(req, res) => {
  try {
      var data = req.body;
      var user = req.session.user;
      var date_ob = moment();
    // Format it as YYYY-MM-DD HH:mm:ss
       var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
       var values = '';
       const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      var table_name = "td_statistic";
    var fields = `title1 = '${data.title1.split("'").join("\\'")}',num1 = '${data.num1}',title2 = '${data.title2}',num2 = '${data.num2}',
                title3 = '${data.title3}',num3='${data.num3}',modified_by='${user.user_id}',modified_dt='${formattedDate}',
                modified_ip = '${ip}' `;
    var whr = `id = '${data.id}'` ;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);
    res.redirect("/wdtls/statistic");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error('Error during dashboard rendering:', error);
  }
})
   ////     ********  Code start for FAQ      *******   /// 
  WdtlsRouter.get('/faqlist', async(req, res) => {
    try {
        const faqllist = await db_Select('*', 'td_faq', null, null);
        // Prepare data for rendering
        const res_dt = {
          data:faqllist.suc > 0 ? faqllist.msg : '',
        };
        res.render('websitedtls/faq/list',res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('websitedtls/faqlist');
      }
  })
  WdtlsRouter.get('/addfaq', async(req, res) => {
    try {
        res.render('websitedtls/faq/add');
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
      }
  })
  WdtlsRouter.post('/savefaq', async(req, res) => {
    try {
        var data = req.body;
        console.log(req.body)
        var user = req.session.user;
        var date_ob = moment();
        var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      //  var values = '(question,answer,created_at,created_by,created_ip)';
      var values = `('${data.question}','${data.answer}','${formattedDate}','${user.user_id}','${ip}')`
      
        var table_name = "td_faq";
      var fields = data.id > 0 ? `title1 = '${data.title1.split("'").join("\\'")}',num1 = '${data.num1}',title2 = '${data.title2}',num2 = '${data.num2}',
                  title3 = '${data.title3}',num3='${data.num3}',modified_by='${user.user_id}',modified_dt='${formattedDate}',
                  modified_ip = '${ip}' ` :`(question,answer,created_at,created_by,created_ip)`;
      var whr = `id = '${data.id}'` ;
      var flag = data.id > 0 ? 1 : 0;
      var save_data = await db_Insert(table_name, fields, values, whr, flag);
      res.redirect("/wdtls/faqlist");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
    }
  })
  WdtlsRouter.get('/delfaq', async(req, res) => {
    try {
        var data = req.body;
        var id = req.query.id,where=`id = '${id}' `;
        var res_dt = await db_Delete("td_faq", where);
       res.redirect("/wdtls/faqlist");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      res.redirect("/wdtls/faqlist");
    }
  })
    ////     ********  Code End for FAQ      *******   /// 

     ////     ********  Code start for Quiklinks      *******   /// 
  WdtlsRouter.get('/qlinkslist', async(req, res) => {
    try {
        const faqllist = await db_Select('*', 'td_qick_links', null, null);
        // Prepare data for rendering
        const res_dt = {
          data:faqllist.suc > 0 ? faqllist.msg : '',
        };
        res.render('websitedtls/quiklinks/list',res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('websitedtls/qlinkslist');
      }
  })
  WdtlsRouter.get('/addqlinks', async(req, res) => {
    try {
        res.render('websitedtls/quiklinks/add');
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
      }
  })
  WdtlsRouter.post('/saveqlinks', async(req, res) => {
    try {
        var data = req.body;
        console.log(req.body)
        var user = req.session.user;
        var date_ob = moment();
        var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      //  var values = '(question,answer,created_at,created_by,created_ip)';
      var values = `('${data.title}','${data.links}','${formattedDate}','${user.user_id}','${ip}')`
      
        var table_name = "td_qick_links";
      var fields = data.id > 0 ? `title1 = '${data.title.split("'").join("\\'")}',num1 = '${data.num1}',title2 = '${data.title2}',num2 = '${data.num2}',
                  title3 = '${data.title3}',num3='${data.num3}',modified_by='${user.user_id}',modified_dt='${formattedDate}',
                  modified_ip = '${ip}' ` :`(title,links,created_at,created_by,created_ip)`;
      var whr = `id = '${data.id}'` ;
      var flag = data.id > 0 ? 1 : 0;
      var save_data = await db_Insert(table_name, fields, values, whr, flag);
      res.redirect("/wdtls/qlinkslist");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
    }
  })
  WdtlsRouter.get('/delqlinks', async(req, res) => {
    try {
        var data = req.body;
        var id = req.query.id,where=`id = '${id}' `;
        var res_dt = await db_Delete("td_qick_links", where);
       res.redirect("/wdtls/qlinkslist");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      res.redirect("/wdtls/qlinkslist");
    }
  })
    ////     ********  Code End for Quiklinks      *******   /// 

    ////     ********  Code start for User Management      *******   /// 
  WdtlsRouter.get('/userlist', async(req, res) => {
    try {
           var table = `md_user a LEFT JOIN md_range b ON a.range_id = b.range_id `;
        const faqllist = await db_Select('a.*,b.range_name', table, null, null);
        // Prepare data for rendering
        const res_dt = {
          data:faqllist.suc > 0 ? faqllist.msg : '',
        };
        res.render('websitedtls/user/list',res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('websitedtls/faqlist');
      }
  })
  WdtlsRouter.get('/adduser', async(req, res) => {
    try {
      var ranze = await db_Select('*', 'md_range', null, null);
        const res_dt = {
          data:ranze.suc > 0 ? ranze.msg : '',
        };
        res.render('websitedtls/user/add',res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
      }
  })
  WdtlsRouter.post('/saveuser', async(req, res) => {
    var user = req.session.user;
    console.log(user);
    try {
        var data = req.body;
        console.log(req.body)
       
        var date_ob = moment();
        var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        var pass_string = '';
        if(data.id > 0){
          if(data.password.length > 0){
            var pass = bcrypt.hashSync(data.password, 10)  ;
            pass_string = `password = '${pass}',`;
          }
        }else{
          var pass =  bcrypt.hashSync('1234', 10) ;
        }
      var values = `('${data.user_id}','${data.user_name}','${data.user_email}','${data.designation}','${data.user_type}','${pass}','${data.user_status}','${data.range_id}','${formattedDate}','${user.user_id}','${ip}')`
      
        var table_name = "md_user";
      var fields = data.id > 0 ? `user_id = '${data.user_id}',user_name = '${data.user_name.split("'").join("\\'")}',user_email = '${data.user_email}',designation = '${data.designation}',user_type = '${data.user_type}',
                   ${pass_string} user_status='${data.user_status}',range_id='${data.range_id}',modified_by='${user.user_id}',modified_at='${formattedDate}',
                  modified_ip = '${ip}' ` :`(user_id,user_name,user_email,designation,user_type,password,user_status,range_id,created_at,created_by,created_ip)`;
      var whr = `id = '${data.id}'` ;
      var flag = data.id > 0 ? 1 : 0;
      var save_data = await db_Insert(table_name, fields, values, whr, flag);
      res.redirect("/wdtls/userlist");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
    }
  })
  WdtlsRouter.get('/edituser', async(req, res) => {
  
    var id = req.query.id;
    try {
      
      var ranze = await db_Select('*', 'md_range', null, null);
      var userres = await db_Select('*', 'md_user', `id='${id}'`, null);
        const res_dt = {
          data:ranze.suc > 0 ? ranze.msg : '',usersd: userres.suc > 0 ? userres.msg[0] : ''
        };
        res.render('websitedtls/user/edit',res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
      }
  })
  WdtlsRouter.get('/deluser', async(req, res) => {
    try {
        var data = req.body;
        var id = req.query.id,where=`id = '${id}' `;
        var res_dt = await db_Delete("td_faq", where);
       res.redirect("/wdtls/faqlist");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      res.redirect("/wdtls/faqlist");
    }
  })
    ////     ********  Code End for User Management      *******   /// 
module.exports = {WdtlsRouter}