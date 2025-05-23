const WdtlsRouter = require("express").Router();
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const pdfParse = require("pdf-parse");
// mime = require("mime-types");

//bcrypt = require("bcrypt");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {
  db_Select,
  db_Insert,
  db_Delete,
  SendNotification,
} = require("../modules/MasterModule");
const { chkUserIputFunc } = require("../middleware/chekUserInputMiddleware");
WdtlsRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});
async function fetchIpData() {
  try {
    // Define the data (e.g., auth_key)
    const data = {
      auth_key: "synergic#@*12",
    };
    // Define the config for the axios request
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://ip.opentech4u.co.in/", // Replace this with the actual URL you're requesting
      headers: {
        "Content-Type": "application/json",
      },
      params: data, // For GET requests, pass data as query params
    };

    // Send the request using axios
    const response = await axios(config);
    console.log("test data");
    console.log(response.data);
    // Return the response data if the request is successful
    return {
      status: 1,
      ipdata: response.data.remote_address_ip,
    };
  } catch (error) {
    // In case of an error, return a failure response
    return {
      status: 0,
      ipdata: "",
    };
  }
}

WdtlsRouter.get("/doclist", async (req, res) => {
  try {
    // Extract range_id from session

    const doclist = await db_Select(
      "a.*,b.doc_type as doc_type_name",
      "td_document_upload a,md_document b",
      `a.doc_type = b.doc_type_id`,
      null,
    );
    // Prepare data for rendering
    const res_dt = {
      data: doclist.suc > 0 ? doclist.msg : "",
    };
    res.render("websitedtls/doc/document_list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/doc/document_list");
  }
});
WdtlsRouter.get("/adddoc", async (req, res) => {
  try {
    // Extract range_id from session
    const soc_id = req.query.id;
    const range_id = req.session.user.range_id;
    const doctyperes = await db_Select("*", "md_document", null, null);
    // Prepare data for rendering
    var res_dt = {
      doctypelist: doctyperes.suc > 0 ? doctyperes.msg : "",
    };
    const rootDirectory = path.join(__dirname, '..', 'uploads');
    console.log(rootDirectory);
    // Render the view with data
    res.render("websitedtls/doc/add_doc", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});

WdtlsRouter.get("/doclist_for_approve", async (req, res) => {
  try {
    // Extract range_id from session
    const doclist = await db_Select(
      "a.*,b.doc_type as doc_type_name",
      "td_document_upload a,md_document b",
      `a.doc_type = b.doc_type_id`,
      null,
    );
    // Prepare data for rendering
    const res_dt = {
      data: doclist.suc > 0 ? doclist.msg : "",
    };
    res.render("websitedtls/doc/document_list_for_approve", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/doc/document_list");
  }
});
WdtlsRouter.get("/doc_for_approve", async (req, res) => {
  try {
    // Extract range_id from session
    var id = req.query.id;
    var whr = `id=${id}`;
    const doclist = await db_Select("*", "td_document_upload", whr, null);
    // Prepare data for rendering
    const res_dt = {
      data: doclist.suc > 0 ? doclist.msg[0] : "",
    };
    res.render("websitedtls/doc/document_for_approve", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/doc/document_list");
  }
});
WdtlsRouter.get("/doc_for_view", async (req, res) => {
  try {
    // Extract range_id from session
    var id = req.query.id;
    var whr = `id=${id}`;
    const doclist = await db_Select("*", "td_document_upload", whr, null);
    // Prepare data for rendering
    const res_dt = {
      data: doclist.suc > 0 ? doclist.msg[0] : "",
    };
    res.render("websitedtls/doc/document_for_view", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/doc/document_list");
  }
});
WdtlsRouter.get("/deldock", async (req, res) => {
  try {
    var data = req.body;
    var id = req.query.id,
      doc_type = req.query.doc_type;
    var where = `id = '${id}' `;
    const filename = req.query.file;
    if (doc_type == 1) {
      var filePath = path.join(__dirname, "uploads/notifications/", filename);
    } else if (doc_type == 2) {
      var filePath = path.join(__dirname, "uploads/tenders/", filename);
    } else if (doc_type == 3) {
      var filePath = path.join(__dirname, "uploads/announcement/", filename);
    } else {
      var filePath = path.join(__dirname, "uploads/downloads/", filename);
    }
    console.log(doc_type);
    fs.unlink(filePath, (err) => {
      // if (err) {
      //     console.error('Error deleting file:', err);
      //     return res.status(500).send('Error deleting file');
      // }
      // res.redirect('/');
    });
    var res_dt = await db_Delete("td_document_upload", where);
    res.redirect("/wdtls/doclist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("/wdtls/doclist");
  }
});

WdtlsRouter.post("/approve_document", async (req, res) => {
  try {
    // Extract range_id from session
    var user_id = req.session.user.user_id;
    var date_ob = moment();
    // Format it as YYYY-MM-DD HH:mm:ss
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    //   ********   Code For Getting Ip   *********   //
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    var ip = '';
    //   ********   Code For Getting Ip   *********  //
    var data = req.body;
    var table_name = "td_document_upload";
    var values = null;

    var fields = `status='A',approved_by='${user_id}',
      approved_at = '${formattedDate}',approved_ip='${ip}' `;
    var whr = `id = '${data.doc_id}'`;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);

    req.flash("success_msg", "Update successful!");
    res.redirect("/wdtls/doclist_for_approve");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("wdtls/doclist_for_approve", res_dt);
  }
});


// const storages = multer.memoryStorage({
//   destination: (req, file, cb) => {
//     const typeId = req.body.doc_type; // Get typeId from the request body
//     let uploadDir;
//     // Based on doc_type, set the upload directory path
//     if (typeId == 1) {
//       uploadDir = path.join(__dirname, "..", "uploads/notifications/");
//     } else if (typeId == 2) {
//       uploadDir = path.join(__dirname, "..", "uploads/tenders/");
//     } else if (typeId == 3) {
//       uploadDir = path.join(__dirname, "..", "uploads/announcement/");
//     } else {
//       uploadDir = path.join(__dirname, "..", "uploads/downloads/");
//     }

//     // Create the directory if it doesn't exist
//     cb(null, uploadDir);
//   },
 
//   filename: (req, file, cb) => {
//     const newFilename = Date.now() + path.extname(file.originalname);
//     console.log('hhhhhhhhh Filename');
//     console.log('Generated Filename:', newFilename); // Log generated filename
//     console.log('hhhhhhhhh Filename');
//     cb(null, newFilename);
//   }
// });

const storages = multer.memoryStorage();

// Multer upload setup with memory storage
const upload_pdf = multer({ storage: storages });

// Custom middleware to check for malicious content in the file buffer
const checkForMaliciousContent = async (req, res, next) => {
  const file = req.file;
    
  if (!file) {
    return next();
  }

  if (hasMultipleExtensions(file.originalname)) {
    return res.status(400).send('Suspicious file name detected (multiple extensions)');
  }

  const fileTypes = /pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    // Check for PDF header (%PDF)
    const pdfHeader = file.buffer.toString('utf8', 0, 4); // Read first 4 bytes for PDF header
    if (pdfHeader !== '%PDF') {
      return res.status(400).send('Invalid PDF file');
    }
    // Check for forbidden patterns in file content (malicious content)
    // const forbiddenPatterns = [
    //   /<\?php/i,        // PHP opening tag
    //   /<script>/i,      // Script tags
    //   /eval\(/i,        // eval() function
    //   /base64_decode/i  // base64_decode function
    // ];
    // console.log('File Buffer')
    // console.log(file.buffer.toString('utf8'));
    // console.log('File Buffer')
    // for (const pattern of forbiddenPatterns) {
    //   if (pattern.test(file.buffer.toString('utf8'))) {
    //     return res.status(400).send('Malicious content detected');
    //   }
    // }

    var content = await pdfParse(file.buffer)
    const forbiddenPatterns = [/<\?php/i, /<script>/i, /eval\(/i, /base64_decode/i];
    var chk_mal_content =  forbiddenPatterns.some(pattern => pattern.test(content.text.trim()));

    if(chk_mal_content){
      return res.status(400).send('Malicious content detected.');
    }
    next()
  } else {
    return res.status(400).send('Only PDF files are allowed');
  }

  // next(); // Proceed to the next middleware (your upload route)
};



WdtlsRouter.post("/uploaddoc", upload_pdf.single("document"), checkForMaliciousContent, async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const user = req.session.user;
  const range_id_ = req.session.user.range_id;
  const cheuserinput = await chkUserIputFunc(req.body);

  if (cheuserinput > 0) {
    const date_ob = moment();
    const formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");

    // Get client IP address
    // const ipresult = await fetchIpData();
    // const ip = ipresult.ipdata;
    const ip = '';
    const rootDirectory = path.join(__dirname, '..');
      const typeId = req.body.doc_type;  // Assuming doc_type is coming from the body
      let uploadDir;
      if (typeId == 1) {
        uploadDir = path.join(rootDirectory, 'uploads/notifications/');
      } else if (typeId == 2) {
        uploadDir = path.join(rootDirectory, 'uploads/tenders/');
      } else if (typeId == 3) {
        uploadDir = path.join(rootDirectory, 'uploads/announcement/');
      } else {
        uploadDir = path.join(rootDirectory, 'uploads/downloads/');
      }
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    const newFilename = Date.now() + path.extname(req.file.originalname);
    const filePath = path.join(uploadDir, newFilename);

    console.log(filePath);
    fs.writeFile(filePath, req.file.buffer, (err) => {
      if (err) {
        console.error('Error saving file:', err); // Log the actual error message to the console
        return res.status(500).send('Error saving the file.');
      }
      console.log('File saved successfully!');
      // Optionally respond with success (you can uncomment the response if needed)
      // res.send('File uploaded successfully with filename: ' + newFilename);
    });
    
   
    const data = req.body;
    const table_name = "td_document_upload";
    const fields = `(doc_type, doc_title, document, folder_name, created_at, created_by, created_ip)`;
    const values = `('${data.doc_type}', '${data.doc_title.split("'").join("\\'")}', '${newFilename}', '', '${formattedDate}', '${user.user_id}', '${ip}')`;

    const sa_data = await db_Insert(table_name, fields, values, null, 0);
    const message = `Document uploaded by ${user.user_id}.`;

    const noti_fields = `(type, message, wrk_releated_id, user_type, view_status, range_id, created_by, created_at, created_ip)`;
    const noti_values = `('D', '${message}', '${sa_data.lastId.insertId}', 'S', '1', '${range_id_}', '${user.user_id}', '${formattedDate}', '${ip}')`;

    const res_dt = await db_Insert("td_notification", noti_fields, noti_values, null, false);

    if (res_dt && res_dt.suc > 0) {
      const notification_dtls = await SendNotification();
      req.io.emit("notification", { message: notification_dtls.msg });
    }

    if (user.user_type == "S") {
      res.redirect("/wdtls/adddoc");
    } else {
      res.redirect("/wdtls/announcelist");
    }
  } else {
    if (user.user_type == "S") {
      res.redirect("/wdtls/adddoc");
    } else {
      res.redirect("/wdtls/announcelist");
    }
  }
});

WdtlsRouter.get("/announcelist", async (req, res) => {
  try {
    // Extract range_id from session
    var whr = `doc_type = 3 `;
    const doclist = await db_Select("*", "td_document_upload", whr, null);
    // Prepare data for rendering
    const res_dt = {
      data: doclist.suc > 0 ? doclist.msg : "",
    };
    res.render("websitedtls/doc/document_list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/doc/document_list");
  }
});
WdtlsRouter.get("/addannouncement", async (req, res) => {
  try {
    // Extract range_id from session
    const soc_id = req.query.id;
    const range_id = req.session.user.range_id;
    var whr = `upload_auth = 'A' `;
    const doctyperes = await db_Select("*", "md_document", whr, null);
    // Prepare data for rendering
    var res_dt = {
      doctypelist: doctyperes.suc > 0 ? doctyperes.msg : "",
    };
    // Render the view with data
    res.render("websitedtls/add_doc", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});

WdtlsRouter.get("/gallerylist", async (req, res) => {
  try {
    // Extract range_id from session
    var whr = `doc_type = 3 `;
    const doclist = await db_Select("*", "td_gallery", null, null);
    // Prepare data for rendering
    const res_dt = {
      data: doclist.suc > 0 ? doclist.msg : "",
    };
    res.render("websitedtls/gallery/list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/gallerylist");
  }
});
WdtlsRouter.get("/addgallery", async (req, res) => {
  try {
    res.render("websitedtls/gallery/add");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
// Set storage engine

// Set storage engine
const storage_gallery = multer.memoryStorage({
  destination: "./assets/gallery/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});
const hasMultipleExtensions = (filename) => {
  const extCount = filename.split('.').length - 1;
  return extCount > 1; // If more than one dot, it's suspicious
};

// Initialize multer
const upload_gall = multer({
  storage: multer.memoryStorage(),
}).single("gall_img"); // 'gall_img' is the name of the input field in the form
const checkForMaliciousContentforimage = (req, res, next) => {
  const file = req.file;

  // If no file exists, skip the validation
  if (!file) {
    return next();
  }

  // Check if filename has multiple extensions (suspicious file)
  if (hasMultipleExtensions(file.originalname)) {
    return res.status(400).send('Suspicious file name detected (multiple extensions)');
  }

  // Define forbidden patterns for all file types (image, pdf, etc.)
  const forbiddenPatterns = [
    /<\?php/i,        // PHP opening tag
    /<script>/i,      // Script tags
    /eval\(/i,        // eval() function
    /base64_decode/i, // base64_decode function
    /<iframe>/i,      // Malicious iframe
    /<object>/i,      // Object injection
  ];

  // Check for forbidden patterns in the content of the file (malicious content)
  // For images (JPEG/PNG), content is binary and will not have human-readable content
  try {
    // For non-image files, we will try to read the buffer as a string.
    const content = file.buffer.toString("utf8");

    // Check forbidden patterns in content
    if (forbiddenPatterns.some(pattern => pattern.test(content))) {
      return res.status(400).send('Malicious content detected');
    }
  } catch (err) {
    // If we cannot read the file as text (e.g., it's a binary file like image), we skip the content check.
    console.log('Non-text file, skipping content check:', file.originalname);
  }

  // Continue to the next middleware if no malicious content was detected
  return next();
};
// File upload route
WdtlsRouter.post("/uploadgall", upload_gall, checkForMaliciousContentforimage, async (req, res) => {
  try {
    var user = req.session.user;
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    var date_ob = moment();
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    var ip = '';
    const rootDirectory = path.join(__dirname, '..');
    const typeId = req.body.doc_type;  // Assuming doc_type is coming from the body
    let uploadDir;
      uploadDir = path.join(rootDirectory, 'assets/gallery/');
  
    console.log(rootDirectory);
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const newFilename = Date.now() + path.extname(req.file.originalname);
    const filePath = path.join(uploadDir, newFilename);
    console.log(filePath);
    fs.writeFile(filePath, req.file.buffer, (err) => {
      if (err) {
        console.error('Error saving file:', err); // Log the actual error message to the console
        return res.status(500).send('Error saving the file.');
      }
      console.log('File saved successfully!');
      // Optionally respond with success (you can uncomment the response if needed)
      // res.send('File uploaded successfully with filename: ' + newFilename);
    });
    var data = req.body;
    var table_name = "td_gallery";
    var fields = `(title, gal_img,sl_no,created_at,created_by,created_ip)`;
    var values = `('${data.title.split("'").join("\\'")}','${newFilename}',0,'${formattedDate}','${user.user_id}','${ip}')`;
    var save_data = await db_Insert(table_name, fields, values, null, 0);
    var range_id_ = req.session.user.range_id;
    var message = `Image  Uploaded by ${user.user_id}.`;
    var noti_fields = `(type,message,wrk_releated_id,user_type,view_status,range_id,created_by,created_at,created_ip)`;
    var noti_values = `('G','${message}','${save_data.lastId.insertId}','S','1','${range_id_}','${user.user_id}','${formattedDate}','${ip}')`;
    var res_dt = await db_Insert(
      "td_notification",
      noti_fields,
      noti_values,
      null,
      false,
    );
    if (res_dt) {
      if (res_dt.suc > 0) {
        console.log("Event is emmititng");
        var notification_dtls = await SendNotification();
        req.io.emit("notification", { message: notification_dtls.msg });
      }
    }

    if (!save_data) {
      return res.status(500).send("Database error: Unable to save the data.");
    }

    res.redirect("/wdtls/gallerylist");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
WdtlsRouter.get("/delgallery", async (req, res) => {
  try {
    var data = req.body;
    var id = req.query.id,
      where = `id = '${id}' `;
    var res_dt = await db_Delete("td_gallery", where);
    res.redirect("/wdtls/gallerylist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("/wdtls/gallerylist");
  }
});
//  ******  Code for Statistic  ******  //
WdtlsRouter.get("/statistic", async (req, res) => {
  try {
    const doclist = await db_Select("*", "td_statistic", null, null);
    const res_dt = { datas: doclist.msg[0] };
    res.render("websitedtls/statistic", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.post("/update_statistic", async (req, res) => {
  try {
    var data = req.body;
    var user = req.session.user;
    var date_ob = moment();
    // Format it as YYYY-MM-DD HH:mm:ss
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    var values = "";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    var table_name = "td_statistic";
    var fields = `title1 = '${data.title1.split("'").join("\\'")}',num1 = '${data.num1}',title2 = '${data.title2}',num2 = '${data.num2}',
                title3 = '${data.title3}',num3='${data.num3}',modified_by='${user.user_id}',modified_dt='${formattedDate}',
                modified_ip = '${ip}' `;
    var whr = `id = '${data.id}'`;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);
    res.redirect("/wdtls/statistic");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
////     ********  Code start for FAQ      *******   ///
WdtlsRouter.get("/faqlist", async (req, res) => {
  try {
    const faqllist = await db_Select("*", "td_faq", null, null);
    // Prepare data for rendering
    const res_dt = {
      data: faqllist.suc > 0 ? faqllist.msg : "",
    };
    res.render("websitedtls/faq/list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/faqlist");
  }
});
WdtlsRouter.get("/addfaq", async (req, res) => {
  try {
    res.render("websitedtls/faq/add");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.post("/savefaq", async (req, res) => {
  try {
    var data = req.body;
    var range_id_ = req.session.user.range_id;
    var user = req.session.user;
    var date_ob = moment();
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    var ip = '';
    //  var values = '(question,answer,created_at,created_by,created_ip)';
    var values = `('${data.question}','${data.answer}','${formattedDate}','${user.user_id}','${ip}')`;

    var table_name = "td_faq";
    var fields =
      data.id > 0
        ? `title1 = '${data.title1.split("'").join("\\'")}',num1 = '${data.num1}',title2 = '${data.title2}',num2 = '${data.num2}',
                  title3 = '${data.title3}',num3='${data.num3}',modified_by='${user.user_id}',modified_dt='${formattedDate}',
                  modified_ip = '${ip}' `
        : `(question,answer,created_at,created_by,created_ip)`;
    var whr = `id = '${data.id}'`;
    var flag = data.id > 0 ? 1 : 0;
    var sa_data = await db_Insert(table_name, fields, values, whr, flag);
    var message = `FAQ  Added by ${user.user_id}.`;
    var noti_fields = `(type,message,wrk_releated_id,user_type,view_status,range_id,created_by,created_at,created_ip)`;
    var noti_values = `('F','${message}','${sa_data.lastId.insertId}','S','1','${range_id_}','${user.user_id}','${formattedDate}','${ip}')`;
    var res_dt = await db_Insert(
      "td_notification",
      noti_fields,
      noti_values,
      null,
      false,
    );
    if (res_dt) {
      if (sa_data.suc > 0) {
        console.log("Event is emmititng");
        var notification_dtls = await SendNotification();
        req.io.emit("notification", { message: notification_dtls.msg });
      }
    }
    res.redirect("/wdtls/faqlist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.get("/delfaq", async (req, res) => {
  try {
    var data = req.body;
    var id = req.query.id,
      where = `id = '${id}' `;
    var res_dt = await db_Delete("td_faq", where);
    res.redirect("/wdtls/faqlist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("/wdtls/faqlist");
  }
});
////     ********  Code End for FAQ      *******   ///

////     ********  Code start for Quiklinks      *******   ///
WdtlsRouter.get("/qlinkslist", async (req, res) => {
  try {
    const faqllist = await db_Select("*", "td_qick_links", null, null);
    // Prepare data for rendering
    const res_dt = {
      data: faqllist.suc > 0 ? faqllist.msg : "",
    };
    res.render("websitedtls/quiklinks/list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/qlinkslist");
  }
});
WdtlsRouter.get("/addqlinks", async (req, res) => {
  try {
    res.render("websitedtls/quiklinks/add");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.post("/saveqlinks", async (req, res) => {
  try {
    var data = req.body;
    console.log(req.body);
    var user = req.session.user;
    var date_ob = moment();
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    var ip = '';
    var values = `('${data.title}','${data.links}','${formattedDate}','${user.user_id}','${ip}')`;

    var table_name = "td_qick_links";
    var fields =
      data.id > 0
        ? `title1 = '${data.title.split("'").join("\\'")}',num1 = '${data.num1}',title2 = '${data.title2}',num2 = '${data.num2}',
                  title3 = '${data.title3}',num3='${data.num3}',modified_by='${user.user_id}',modified_dt='${formattedDate}',
                  modified_ip = '${ip}' `
        : `(title,links,created_at,created_by,created_ip)`;
    var whr = `id = '${data.id}'`;
    var flag = data.id > 0 ? 1 : 0;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);
    res.redirect("/wdtls/qlinkslist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.get("/delqlinks", async (req, res) => {
  try {
    var data = req.body;
    var id = req.query.id,
      where = `id = '${id}' `;
    var res_dt = await db_Delete("td_qick_links", where);
    res.redirect("/wdtls/qlinkslist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("/wdtls/qlinkslist");
  }
});
////     ********  Code End for Quiklinks      *******   ///

////     ********  Code start for User Management      *******   ///
WdtlsRouter.get("/userlist", async (req, res) => {
  try {
    const range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    if(req.session.user.user_type == 'S'){
         var select = `a.*,b.range_name,c.controlling_authority_type_name`;
         var table = `md_user a LEFT JOIN md_range b ON a.range_id = b.range_id LEFT JOIN md_controlling_authority_type c ON a.cntr_auth_type =c.controlling_authority_type_id`;
    }else{
    
      if(cntr_auth_type == 1){
        var select = `a.*,b.range_name,c.controlling_authority_type_name`;
        if (req.session.user.user_type == 'M') {
          var table = `md_user a JOIN md_range b ON a.range_id = b.range_id JOIN md_controlling_authority_type c ON a.cntr_auth_type =c.controlling_authority_type_id WHERE a.range_id='${range_id}' AND a.cntr_auth_type='${cntr_auth_type}' AND user_type in('M','U','E')`;
        } else {
          var table = `md_user a LEFT JOIN md_range b ON a.range_id = b.range_id LEFT JOIN md_controlling_authority_type c ON a.cntr_auth_type =c.controlling_authority_type_id AND a.cntr_auth_type='${cntr_auth_type}' AND user_type in('M','U','A','E')`;
        }
      }else{
        if(req.session.user.user_type == 'M'){
          var select = `a.*,b.dist_name as range_name,c.controlling_authority_type_name`;
          var table = `md_user a JOIN md_district b ON a.range_id = b.dist_code JOIN md_controlling_authority_type c ON a.cntr_auth_type =c.controlling_authority_type_id AND a.range_id='${range_id}' AND a.cntr_auth_type='${cntr_auth_type}' AND user_type in('M','U','E') `;
        }else{
          var select = `a.*,b.dist_name as range_name,c.controlling_authority_type_name`;
          var table = `md_user a JOIN md_district b ON a.range_id = b.dist_code JOIN md_controlling_authority_type c ON a.cntr_auth_type =c.controlling_authority_type_id AND a.cntr_auth_type='${cntr_auth_type}' AND user_type in('M','U','A','E') `;
        }
      }
    }
    
    const userlist = await db_Select(select, table, null, null);
    // Prepare data for rendering
    const res_dt = {
      data: userlist.suc > 0 ? userlist.msg : "",
    };
    res.render("websitedtls/user/list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("websitedtls/faqlist");
  }
});
WdtlsRouter.get("/adduser", async (req, res) => {
  try {
    var cntr_auth_type = req.session.user.cntr_auth_type;
    var user_type = cntr_auth_type > 1 ? 'District' : 'Range';
    var range_dist_id = req.session.user.range_id;
    var ranze = await db_Select("*", "md_range", null, null);
    var distlist = await db_Select("*", "md_district", null, null);
    var cnt_type = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    const res_dt = {
      data: ranze.suc > 0 ? ranze.msg : "",user_ty:user_type,range_dist:range_dist_id,
      distl:distlist.suc > 0 ? distlist.msg : "",
      cnt_type: cnt_type.suc > 0 ? cnt_type.msg : "",cntr_auth_type:cntr_auth_type
    };
    res.render("websitedtls/user/add", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});

WdtlsRouter.post("/saveuser", async (req, res) => {
  try {
    var data = req.body;
    var user = req.session.user;
    var date_ob = moment();
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    //const userIp = req.clientIp; // This will work
    var ip = req.clientIp;
    var pass_string = "";
    if (data.id > 0) {
      if (data.password.length > 0) {
        var pass = bcrypt.hashSync(data.password, 10);
        pass_string = `password = '${pass}',`;
      }
    } else {
      var pass = bcrypt.hashSync("1234", 10);
    }
    var values = `('${data.user_id}','${data.user_name}','${data.user_email}','${data.user_mobile ?data.user_mobile : 0}','${data.designation}','${data.user_type}','${pass}','A','${data.cntr_auth_type}','${data.range_id}','${formattedDate}','${user.user_id}','${ip}')`;

    var table_name = "md_user";
    var fields =
      data.id > 0
        ? `user_name = '${data.user_name.split("'").join("\\'")}',user_email = '${data.user_email}',user_mobile = '${data.user_mobile ? data.user_mobile : 0}',designation = '${data.designation}',user_type = '${data.user_type}', ${pass_string} user_status='${data.user_status}',cntr_auth_type='${data.cntr_auth_type}',range_id='${data.range_id}',modified_by='${user.user_id}',modified_at='${formattedDate}',modified_ip = '${ip}' `
        : `(user_id,user_name,user_email,user_mobile,designation,user_type,password,user_status,cntr_auth_type,range_id,created_at,created_by,created_ip)`;
    var whr = `id = '${data.id}'`;
    var flag = data.id > 0 ? 1 : 0;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);
    res.redirect("/wdtls/userlist");
  } catch (error) {
    // Log the error and send an appropriate response
    res.redirect("/wdtls/userlist");
    //console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.get("/edituser", async (req, res) => {
  var id = req.query.id;
  try {
    var cntr_auth_type = req.session.user.cntr_auth_type;
    var user_type = cntr_auth_type > 1 ? 'District' : 'Range';
    var range_dist_id = req.session.user.range_id;
    var cnt_type = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    var ranze = await db_Select("*", "md_range", null, null);
    var userres = await db_Select("*", "md_user", `id='${id}'`, null);
    var distlist = await db_Select("*", "md_district", null, null);
    const res_dt = {
      data: ranze.suc > 0 ? ranze.msg : "",user_ty:user_type,range_dist:range_dist_id,
      usersd: userres.suc > 0 ? userres.msg[0] : "",distl:distlist.suc > 0 ? distlist.msg : "",
      cnt_type: cnt_type.suc > 0 ? cnt_type.msg : "",cntr_auth_type:cntr_auth_type
    };
    res.render("websitedtls/user/edit", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.get("/deluser", async (req, res) => {
  try {
    var id = req.query.id,
      where = `modified_by = '${id}' OR created_by = '${id}' `;
    var wrk_dtl = await db_Select("*", "md_society", where, null);

    if (wrk_dtl.msg.length == 0) {
      var res_dt = await db_Delete("md_user", `user_id = '${id}' `);
      req.flash("success_msg", "Deleted successful!");
    } else {
      req.flash(
        "error_msg",
        "Since the user has entered some data,so it cannot be deleted.",
      );
    }

    res.redirect("/wdtls/userlist");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("/wdtls/faqlist");
  }
});
////     ********  Code End for User Management      *******   ///

WdtlsRouter.get("/changepass", async (req, res) => {
  try {
    var user = req.session.user;
    const res_dt = {
      user_id: user.user_id,
    };
    res.render("websitedtls/user/change_password", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
WdtlsRouter.post("/changepass", async (req, res) => {
  try {
    var user = req.session.user;
    var data = req.body,
      result;
      if(data.old_pass != data.pass){
    var select = "*",
      table_name = "md_user",
      whr = `user_id='${user.user_id}' AND user_status='A'`,
      order = null;
    var res_dt = await db_Select(select, table_name, whr, order);

    if (res_dt.msg.length > 0) {
      const hasLowercase = /[a-z]/.test(data.pass);
      const hasUppercase = /[A-Z]/.test(data.pass);
      const hasNumber = /[0-9]/.test(data.pass);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.pass);
      const hasMinLength = data.pass.length >= 8;
      if (hasLowercase && hasUppercase && hasNumber && hasSpecialChar && hasMinLength) {
        if (await bcrypt.compare(data.old_pass, res_dt.msg[0].password)) {
          var pass = bcrypt.hashSync(data.pass, 10);

          var date_ob = moment();
          var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
          // var ipresult = await fetchIpData();
          // var ip = ipresult.ipdata;
          var ip = '';
          var values = null;
          var table_name = "md_user";
          var fields = `password = '${pass}',modified_at='${formattedDate}',modified_by='${user.user_id}',modified_ip='${ip}'`;
          var whr = `user_id = '${user.user_id}'`;
          var save_data = await db_Insert(table_name, fields, values, whr, 1);
          req.flash("success_msg", "Update successful!");
          res.redirect("/logout");
        } else {
          result = {
            suc: 0,
            msg: "Please check your userid or password",
            dt: res_dt,
          };
          req.flash("error_msg", "Old Password Is Wrong!");
          res.redirect("/wdtls/changepass");
        }
      }else{
        req.flash("error_msg", "Password does not meet the requirements");
        res.redirect("/wdtls/changepass");
      }
    } else {
      result = { suc: 0, msg: "No data found", dt: res_dt };
      res.redirect("/wdtls/changepass");
    }
     }else{
        req.flash("error_msg", "Old Password And New Password is Same!");
        res.redirect("/wdtls/changepass");
     }
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});

module.exports = { WdtlsRouter };