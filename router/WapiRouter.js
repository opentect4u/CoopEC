const express = require("express");
const axios = require('axios');
const os = require('os');
const path = require("path");
const {db_Select,db_Insert} = require('../modules/MasterModule');
WapiRouter = express.Router();

var moment = require('moment');

  //   ****    Get District list   ***  //
  WapiRouter.post('/distlist', async(req, res) => {
    var select = "*",
    table_name = "md_district",
    where = null,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });

  //   ****    Get Range list using District id   ***  //
  WapiRouter.post('/rangelist', async(req, res) => {
    var data = req.body;
    var select = "range_id,range_name",
    table_name = "md_range",
    where = `dist_id='${data.dist_id}' `,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });

  //   ****    Get Soc Type list using   ***  //
  WapiRouter.post('/sotypelist', async(req, res) => {
    var select = "*",
    table_name = "md_society_type",
    where = null,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });

  WapiRouter.post('/societysearch', async(req, res) => {
    try {
        var formdata = req.body;
        const select = "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.contact_name,a.contact_designation,a.contact_number,a.email,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id `;
        var dist = formdata.dist_id > 0 ? `AND a.dist_code=${formdata.dist_id} ` : '';
        var range = formdata.range_code > 0 ? `AND a.range_code=${formdata.range_code} ` : '';
        var soc_type = formdata.soc_type_id > 0 ? `AND a.soc_type=${formdata.soc_type_id} ` : '';
        if (formdata.socname && formdata.socname.trim() !== '') {
          var socname = `AND a.cop_soc_name LIKE '%${formdata.socname.split("'").join("\\'")}%' `;
        }else{
          var socname = '';
        }
        //soc_data_status = `AND a.approve_status='A' `;
       
        var maincon = dist+range+soc_type+socname;
        var whr = `a.functional_status = 'Functional' ${maincon}`;
        
        const order = null;
        const res_dt = await db_Select(select, table_name, whr, order);
        const select2 = "COUNT(*) as total";
        const countResult = await db_Select(select2, table_name, whr, order);
        var total = countResult.msg[0].total;
       // const totalPages = Math.ceil(total / 25);
        
        // Prepare data for rendering
        // const res_dt = {
        //   data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
        // };
        if (res_dt.suc > 0) {
          if (res_dt.msg.length > 0) {
              res.send({ suc: 1, status: "Data found",total_soc:total,msg: res_dt.msg })
          } else {
            result = { suc: 0,status: 'Data no found', msg: '' };
            res.send(result)
          }
        } else {
          result = { suc: 0,status: 'Fail', msg: req.body };
          res.send(result);
        }
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  })

  WapiRouter.post('/getsocgrouplist', async(req, res) => {
    var select = `a.dist_code,b.dist_name,REPLACE(b.dist_name, ' ', '') AS id, SUM(CASE WHEN a.functional_status = 'Functional' THEN 1 ELSE 0 END) AS func_tot, SUM(CASE WHEN a.functional_status = 'Under Liquidation' THEN 1 ELSE 0 END) AS liquidation_tot, SUM(CASE WHEN a.functional_status = 'Non-Functional / Dormant' THEN 1 ELSE 0 END) AS nonfunction_tot`,
    table_name = `md_society a,md_district b`,
    where = `a.dist_code=b.dist_code group by a.dist_code,b.dist_name`,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });
  WapiRouter.post('/getsoctypegrouplist', async(req, res) => {

    var formdata = req.body;
   
    var range_List = await db_Select('range_id,range_name', 'md_range', `dist_id = '${formdata.dist_id}' `, null);
    var data = {};
    var order = `order by soc_type_id ASC`;
   
    if(range_List.msg.length > 1){
    
      var range1 = range_List.msg[0].range_id;
      var range1_name = range_List.msg[0].range_name;
      var range2 = range_List.msg[1].range_id;
      var range2_name = range_List.msg[1].range_name;
      
        var select = `a.range_code,a.soc_type,b.soc_type_name,count(a.cop_soc_name)tot_soc_type,REPLACE(c.dist_name, ' ', '')dist_name`,
        table_name1 = `md_society a,md_society_type b,md_district c
    WHERE a.soc_type = b.soc_type_id AND a.dist_code = c.dist_code
    and a.dist_code = '${formdata.dist_id}' AND a.range_code = '${range1}' AND a.functional_status = 'Functional' group by a.range_code,a.soc_type`,
    table_name2 = `md_society a,md_society_type b,md_district c
    WHERE a.soc_type = b.soc_type_id AND a.dist_code = c.dist_code
    and a.dist_code = '${formdata.dist_id}' AND a.range_code = '${range2}' AND a.functional_status = 'Functional' group by a.range_code,a.soc_type`,
        where = null;
        
        var res_dt1 = await db_Select(select, table_name1, where, order);
        var res_dt2 = await db_Select(select, table_name2, where, order);
        table_name1_for_tot = `md_society a,md_society_type b,md_district c
    WHERE a.soc_type = b.soc_type_id AND a.dist_code = c.dist_code AND a.functional_status = 'Functional'
    and a.dist_code = '${formdata.dist_id}' AND a.range_code = '${range1}'`;
    table_name2_for_tot = `md_society a,md_society_type b,md_district c
    WHERE a.soc_type = b.soc_type_id AND a.dist_code = c.dist_code AND a.functional_status = 'Functional'
    and a.dist_code = '${formdata.dist_id}' AND a.range_code = '${range2}'`;
        var range1_tot = await db_Select(`count(*) as tot`, table_name1_for_tot, where, null);
        var range2_tot = await db_Select(`count(*) as tot`, table_name2_for_tot, where, null);
        var range1 = {'range_name':range1_name,'range_code':range1,'range_tot':range1_tot.msg[0].tot,'range_data':res_dt1.msg};
        var range2 = {'range_name':range2_name,'range_code':range2,'range_tot':range2_tot.msg[0].tot,'range_data':res_dt2.msg};


        data ={range1:range1,range2:range2};
        
    }else{

      var range1 = range_List.msg[0].range_id;
      var range1_name = range_List.msg[0].range_name;
        var select = `a.range_code,a.soc_type,b.soc_type_name,count(a.cop_soc_name)tot_soc_type,REPLACE(c.dist_name, ' ', '')dist_name`,
        table_name1 = `md_society a,md_society_type b,md_district c
    WHERE a.soc_type = b.soc_type_id AND a.dist_code = c.dist_code
    and a.dist_code = '${formdata.dist_id}' AND a.range_code = '${range1}' AND a.functional_status = 'Functional' group by a.range_code,a.soc_type`,
  
        where = null;
        var res_dt1 = await db_Select(select, table_name1, where, order);
        table_name1_for_tot = `md_society a,md_society_type b,md_district c
        WHERE a.soc_type = b.soc_type_id AND a.dist_code = c.dist_code AND a.functional_status = 'Functional'
        and a.dist_code = '${formdata.dist_id}' AND a.range_code = '${range1}'  `;
        var range1_tot = await db_Select(`count(*) as tot`, table_name1_for_tot, where, null);
        var range1 = {'range_name':range1_name,'range_code':range1,'range_tot':range1_tot.msg[0].tot,'range_data':res_dt1.msg};
        data ={range1:range1};
    }
      if (range_List.suc > 0) {
        if (range_List.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: data })
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: {} };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });
  WapiRouter.post('/getdoclist', async(req, res) => {
    var formdata = req.body;
    var select = `doc_type,doc_title,document`,
    table_name = `td_document_upload`,
    where = `doc_type='${formdata.doc_type}'`,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    if(formdata.doc_type == 1){
      var folder_name = 'wapi/docdownloadnoti/';
      var title ='Notifications & Orders';
    }else if(formdata.doc_type == 2){
      var folder_name = 'wapi/docdownloadtender/';
      var title ='Tenders';
    }else if(formdata.doc_type == 3){
      var folder_name = 'wapi/docdownloadannoun/';
      var title ='Important Announcement';
    }else if(formdata.doc_type == 4){
      var folder_name = 'wapi/docdownloads/';
      var title ='Downloads';
    }

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found",title, msg: res_dt.msg,folder_name })
        
        } else {
          result = { suc: 0,status: 'Data no found',title, msg: '',data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail',title, msg: req.body };
        res.send(result);
      }
  });
  WapiRouter.get('/docdownloadnoti/:filename', async(req, res) => {
     // var uploadDir = path.join(__dirname,'..','uploads/notifications/');
     const UPLOAD_FOLDER = path.join(__dirname,'..', 'uploads/notifications/');
      const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
      console.log(filePath);
     // Check if the file exists
     res.download(filePath, (err) => {
         if (err) {
             if (err.code === 'ENOENT') {
                 res.status(404).send('File not found');
             } else {
                 res.status(500).send('Error downloading file');
             }
         }
     });
   });
   WapiRouter.get('/docdownloadtender/:filename', async(req, res) => {
    // var uploadDir = path.join(__dirname,'..','uploads/notifications/');
    const UPLOAD_FOLDER = path.join(__dirname,'..', 'uploads/tenders/');
     const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
     console.log(filePath);
    // Check if the file exists
    res.download(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send('File not found');
            } else {
                res.status(500).send('Error downloading file');
            }
        }
    });
  });
  WapiRouter.get('/docdownloadannoun/:filename', async(req, res) => {
    // var uploadDir = path.join(__dirname,'..','uploads/notifications/');
    const UPLOAD_FOLDER = path.join(__dirname,'..', 'uploads/announcement/');
     const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
     console.log(filePath);
    // Check if the file exists
    res.download(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send('File not found');
            } else {
                res.status(500).send('Error downloading file');
            }
        }
    });
  });
  WapiRouter.get('/docdownloads/:filename', async(req, res) => {
   
    const UPLOAD_FOLDER = path.join(__dirname,'..', 'uploads/downloads/');
     const filePath = path.join(UPLOAD_FOLDER, req.params.filename);
     console.log(filePath);
    // Check if the file exists
    res.download(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send('File not found');
            } else {
                res.status(500).send('Error downloading file');
            }
        }
    });
  });
  WapiRouter.post('/getsocdetail', async(req, res) => {
    var formdata = req.body;
    var select = "a.cop_soc_name,a.reg_no,a.reg_date,b.soc_type_name,f.soc_tier_name,h.controlling_authority_type_name as reg_cont_auth,g.controlling_authority_name as returning_officer,st.state_name,c.dist_name,d.zone_name,e.range_name,a.urban_rural_flag,ulcat.ulb_catg_name,ulb.ulb_name,wa.ward_name,mb.block_name,gp.gp_name,vill.vill_name,a.pin_no,a.address,mms.manage_status_name,mot.officer_type_name,a.num_of_memb,a.audit_upto,a.last_elec_date,a.tenure_ends_on,a.contact_name as key_person,a.contact_designation as key_person_desig,a.contact_number,a.email,a.case_id,a.case_num,a.functional_status",
    table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code 
    LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
    LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
    LEFT JOIN md_state st ON a.state_code = st.state_id
    LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id
    LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_catg_id
    LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id
    LEFT JOIN md_block mb ON a.block_id = mb.block_id
    LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id
    LEFT JOIN md_village vill ON a.vill_id = vill.vill_id
    LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id
    LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id
    LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE id = '${formdata.soc_id}' `,
    where = null,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    var where1 = `soc_id = '${formdata.soc_id}'`;
    var bord_member_detail = await db_Select('board_memb_name,board_memb_desig,bm_contact_no', `td_board_member`, where1, order);

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg,board_member:bord_member_detail.msg })
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });

  WapiRouter.post('/getsocdetail_list', async(req, res) => {
    var formdata = req.body;
    var dist = formdata.dist_id > 0 ? `AND a.dist_code=${formdata.dist_id} ` : '';
    var range = formdata.range_code > 0 ? `AND a.range_code=${formdata.range_code} ` : '';
    var soc_type = formdata.soc_type_id > 0 ? `AND a.soc_type=${formdata.soc_type_id} ` : '';
    if (formdata.socname && formdata.socname.trim() !== '') {
      var socname = `AND a.cop_soc_name LIKE '%${formdata.socname.split("'").join("\\'")}%' `;
    }else{
      var socname = '';
    }
    //soc_data_status = `AND a.approve_status='A' `;
   
    var select = "a.cop_soc_name,a.reg_no,a.reg_date,b.soc_type_name,f.soc_tier_name,h.controlling_authority_type_name as reg_cont_auth,g.controlling_authority_name as returning_officer,st.state_name,c.dist_name,d.zone_name,e.range_name,a.urban_rural_flag,ulcat.ulb_catg_name,ulb.ulb_name,wa.ward_name,mb.block_name,gp.gp_name,vill.vill_name,a.pin_no,a.address,mms.manage_status_name,mot.officer_type_name,a.num_of_memb,a.audit_upto,a.last_elec_date,a.tenure_ends_on,a.contact_name as key_person,a.contact_designation as key_person_desig,a.contact_number,a.email,a.case_id,a.case_num,a.functional_status",
    table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code 
    LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
    LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
    LEFT JOIN md_state st ON a.state_code = st.state_id
    LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id
    LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_catg_id
    LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id
    LEFT JOIN md_block mb ON a.block_id = mb.block_id
    LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id
    LEFT JOIN md_village vill ON a.vill_id = vill.vill_id
    LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id
    LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id
    LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id `,
   
    order = null;
    var maincon = dist+range+soc_type+socname;
    var where = `1 ${maincon}`;
    var res_dt = await db_Select(select, table_name, where, order);
  //  var where1 = `soc_id = '${formdata.soc_id}'`;
    //var bord_member_detail = await db_Select('board_memb_name,board_memb_desig,bm_contact_no', `td_board_member`, where1, order);

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg})
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
  });

  WapiRouter.post('/faqlist', async(req, res) => {
    var select = "id as faq_id,question,answer",
    table_name = "td_faq",
    
    where = null,
    order = null;var title ='FAQ';
    var res_dt = await db_Select(select, table_name, where, order);
      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found",title, msg: res_dt.msg })
        } else {
          result = { suc: 0,status: 'Data no found',title, msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail',title, msg: req.body };
        res.send(result);
      }
   });
   WapiRouter.post('/qlinkslist', async(req, res) => {
    var select = "id as qlinks_id,title,links",
    table_name = "td_qick_links",
    where = null,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
   });
   WapiRouter.post('/gallimglist', async(req, res) => {
    var select = "id as gallery_id,title,gal_img",
    table_name = "td_gallery",
    where = null,
    order = null;var title ='Gallery';
    var res_dt = await db_Select(select, table_name, where, order);
      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found",title, msg: res_dt.msg,folder:'gallery' })
        } else {
          result = { suc: 0,status: 'Data no found',title, msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail',title, msg: req.body,title };
        res.send(result);
      }
   });

   WapiRouter.post('/getsocelestatics', async(req, res) => {
    var select = `SUM(CASE WHEN election_status = 'DUE' THEN 1 ELSE 0 END) AS due_tot,SUM(CASE WHEN election_status = 'ONGOING' THEN 1 ELSE 0 END) AS ongoing_tot, SUM(CASE WHEN election_status = 'DONE' THEN 1 ELSE 0 END) AS done_tot`,
    table_name = `md_society`,
    where = null,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);

      if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      } else {
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
   });
   WapiRouter.post('/societyelectionstatus', async(req, res) => {
    try {
        var formdata = req.body;
        const select = "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.contact_name,a.contact_designation,a.contact_number,a.email,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id `;
        var election_status = `AND a.election_status='${formdata.election_status}' `;
        //soc_data_status = `AND a.approve_status='A' `;
        var maincon = election_status;
        var whr = `a.functional_status = 'Functional' ${maincon}`;
        
        const order = null;
        const res_dt = await db_Select(select, table_name, whr, order);
        const select2 = "COUNT(*) as total";
        const countResult = await db_Select(select2, table_name, whr, order);
        const total = countResult.msg[0].total;
        const totalPages = Math.ceil(total / 25);
        
        // Prepare data for rendering
        // const res_dt = {
        //   data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
        // };
        if (res_dt.suc > 0) {
          if (res_dt.msg.length > 0) {
              res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
          } else {
            result = { suc: 0,status: 'Data no found', msg: '' };
            res.send(result)
          }
        } else {
          result = { suc: 0,status: 'Fail', msg: req.body };
          res.send(result);
        }
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        result = { suc: 0,status: 'Fail', msg: req.body };
        res.send(result);
      }
   })


module.exports = { WapiRouter };
