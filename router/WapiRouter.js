const express = require("express");
const axios = require('axios');
const os = require('os');
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
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
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
        var whr = `1 ${maincon}`;
        
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
  WapiRouter.post('/getdoclist', async(req, res) => {
    var formdata = req.body;
    var select = `doc_type,doc_title,document`,
    table_name = `td_document_upload`,
    where = `doc_type='${formdata.doc_type}'`,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    if(formdata.doc_type == 1){
      var folder_name = 'uploads/notifications/';
      var title ='Notifications & Orders';
    }else{
      var folder_name = 'uploads/tender/';
      var title ='Tenders';
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


// async function getCoordinatesFromAddress(address) {
//   return new Promise(async(resolve,reject)=>{
//     try {
//       const response = await axios.get(
//           `${config.gapiurl_for_address}${encodeURIComponent(address)}&key=${config.gapikey}`
//       );
//       const { results } = response.data;
//       if (results.length > 0) {
//           const { lat, lng } = results[0].geometry.location;
//           resolve ({ lat: lat, lng: lng });
//       } else {
//           console.log('No results found for the given address.');
//           reject({ lat: 0, lng: 0 }) ;
//       }
//   } catch (error) {
//       console.error('Error fetching coordinates:', error.message);
//       reject({ lat: 0, lng: 0 }) ;
//   }
//   })
  
// }
  //   ***********  10/04/2024 -- Code Start for Saving Employee Attendence Detail      *******    //



//   ***********   Code End for Saving Employee Attendence Detail      *******    //

//   ***********  10/04/2024 -- Code Start for Saving Employee Visit Detail      *******    //
WapiRouter.post("/visit_mgmt_save", async (req, res) => {
  var data = req.body;
  if(data.id > 0){
    var fields = `contact_person = '${data.contact_person}', phone_no = '${data.phone_no}', email_id = '${data.email_id}', out_time = '${data.out_time}',in_out_flag = 'O', position_name ='${data.location}' ,remarks = '${data.remarks}',modified_by = '${data.emp_code}',modified_dt = '${data.visit_dt}'`;
  }else{
  var fields = '(visit_dt,emp_code,client_code,org_name,client_addr,contact_person,phone_no,email_id,distance,in_time,out_time,in_out_flag,location,lat_pos,long_pos,position_name,created_by,created_dt)';
  }
  var values = `('${data.visit_dt}','${data.emp_code}','${data.client_code}','${data.org_name}','${data.client_addr}','${data.contact_person}','${data.phone_no}','${data.email_id}','${data.distance}','${data.in_time}','${data.out_time}','${data.in_out_flag}','${data.location}','${data.lat_pos}','${data.long_pos}','${data.location}','${data.emp_code}','${data.visit_dt}')`;
  var where = data.id > 0 ? `sl_no = '${data.id}'` : null,
  flag = data.id > 0 ? 1 : 0;
 var res_dt = await db_Insert('td_visit_mgmt', fields,values,where,flag);
  
  if(res_dt.suc > 0){
    var fields1 = '(`emp_code`,`tour_dt`,`sl_no`,`visit_dtl_id`,`lat_pos`,`long_pos`,`type`,`distance`)';
    var value1  = `('${data.emp_code}','${data.visit_dt}','${data.tourslno}','${res_dt.lastId.insertId}','${data.lat_pos}','${data.long_pos}','T','${data.tourdistance}')`;
    if(data.id < 1){
      var tourin = await db_Insert('td_tour_details', fields1,value1,null,0);
     }
     
      res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
  }else{
     
      res.send({ suc: 0, status: "Data Not found", msg: res_dt.msg })
  }
 
});


  //   ************     CODE FOR LEAVE MODULE      ***********    //
  WapiRouter.post("/get_emp_leave_balance", async (req, res) => {
      var data = req.body,
        result;
      var CL_BAL,ML_BAL = 0;
        var date_time = dateFormat(new Date(), "yyyy-mm-dd");
      var select = "IFNULL(cl_bal,0)cl_bal,IFNULL(ml_bal,0)ml_bal",
        table_name = "td_leave_dtls",
        whr = `emp_no='${data.emp_code}' AND trans_type = 'O' `,
        whr1 = `emp_no='${data.emp_code}' AND trans_type = 'T' AND approval_status = 'A' `,
        order = `order by trans_dt DESC limit 1`;
      var res_dt = await db_Select(select, table_name, whr, order);
      var trans_dt = await db_Select("IFNULL(SUM(IF(leave_type = 'C', no_of_days, 0)),0) AS cl_enjoy,IFNULL(SUM(IF(leave_type = 'S', no_of_days, 0)),0) AS sl_enjoy", table_name, whr1, null);
    
      if(res_dt.msg.length > 0 ){
        CL_BAL = res_dt.msg[0].cl_bal - trans_dt.msg[0].cl_enjoy;
        ML_BAL = res_dt.msg[0].ml_bal - trans_dt.msg[0].sl_enjoy;
      }else{
        CL_BAL = trans_dt.msg[0].cl_enjoy ;
        ML_BAL = trans_dt.msg[0].sl_enjoy ;
      }
        if (res_dt.suc > 0) {
          if (res_dt.msg.length > 0) {
              res.send({ suc: 1, status: "Data found", msg: res_dt.msg,CL_BAL:CL_BAL,ML_BAL : ML_BAL })
          
          } else {
            result = { suc: 0,status: 'Data no found', msg: req.body };
            res.send(result)
          }
        } else {
          result = { suc: 0,status: 'Fail', msg: req.body };
          res.send(result);
        }
  });
  WapiRouter.post('/leave_details', async(req, res) => {
    var select = "*",
    table_name = "md_leave",
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
  WapiRouter.post('/leaveApply', async(req, res) => {
    var data = req.body;
    var date_time = dateFormat(new Date(), "yyyy-mm-dd");
    var select = `ifnull(MAX(trans_cd),0)+1 AS trans_cd`;
    var whares = `emp_no ='${data.emp_no}' AND from_dt = '${data.stdt}'`;
    
     var whr = null;
    var ress_dt = await db_Select(select, 'td_leave_dtls', whr, null);
    var max_sl = ress_dt.msg[0].trans_cd;
    if(data.leaveid == 1 ){
      var leave_type = 'C';
    }else{
      var leave_type = 'S';
    }
    var fields = '(trans_dt,trans_cd,trans_type,emp_no,leave_type,leave_mode,from_dt,to_dt,no_of_days,remarks)';
    var values = `('${date_time}','${max_sl}','T','${data.emp_no}','${leave_type}','F','${data.stdt}','${data.enddt}','${data.noofdays}','${data.remarks}')`;
     var where =  null;
    var chech_dt = await db_Select('*', 'td_leave_dtls', whares, null);
    if(chech_dt.msg.length == 0){
    var res_dt = await db_Insert('td_leave_dtls', fields,values,where,0);
    }
   
     let currentDate = new Date(data.stdt);
     const endDate = new Date(data.enddt);
     if(chech_dt.msg.length == 0){
     while (currentDate <= endDate) {
      var date_ = dateFormat(currentDate, "yyyy-mm-dd");
        var fields = '(`atten_dt`,`emp_code`,`emp_name`,`in_time`,`out_time`,`in_location`,`in_lat`,`in_long`,`type`,`leave_id`,`created_by`,`created_dt`)';
        var values  = `('${date_}','${data.emp_no}','N.A.','00:00:00','00:00:00','N.A.','00','00','LA','${max_sl}','${data.emp_no}','${date_}')`;
        var empdata = await db_Insert("td_attendance",fields,values, null, 0);
        currentDate.setDate(currentDate.getDate() + 1);
     }
        if(ress_dt.suc > 0){
          res.send({ suc: 1, status: "Data found", msg: res_dt.msg})
      }else{
          res.send({ suc: 0, status: "Data Not found", msg: res_dt.msg })
      }
    }else{
      res.send({ suc: 0, status: "Leave All Ready Applied", msg: [] })
    }
    
  });

  WapiRouter.post('/leave_application', async(req, res) => {
    var data = req.body;
    const threeMonthsAgo = moment().subtract(3, 'months').format('YYYY-MM-DD');
    var select = "*",
    table_name = "td_leave_dtls",
    where = `emp_no='${data.emp_code}' AND trans_type = 'T' AND trans_dt > '${threeMonthsAgo}' `,
    order = 'order by trans_dt DESC';
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

  
  //   ************     CODE FOR LEAVE MODULE      ***********    // 
  
 
  WapiRouter.post('/salary_dtls_emp', async(req, res) => {
    var data = req.body;
    var select = "*",
    table_name = "td_salary",
    where = `emp_code='${data.emp_code}' AND year='${data.year}' AND month_id='${data.month_id}' `,
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

  WapiRouter.post('/claimdetailforedit', async(req, res) => {
    var data = req.body;
    var select = "*",
    table_name = "td_claim_detail",
    where = `emp_code='${data.emp_code}' AND id='${data.id}' `,
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

  WapiRouter.post('/dailyexpanceentry', async(req, res) => {
    var data = req.body;
    var dttime= moment().format("YYYY-MM-DD HH:mm:ss");
      //  Generate Claim 
    var date = dateFormat(new Date(), "yyyy-mm-dd");
      var daterange = `'${date}' BETWEEN from_dt AND to_date`;
      var list = await db_Select('*','md_fin_year', daterange, null);
      var fin_yr  = list.msg[0].id;
      var fin_name  = list.msg[0].finname;
      var whereforbulk = `fin_year_id= '${fin_yr}' `;
      var bulktrans = await db_Select('IFNULL(MAX(trans_id),0)+1 as trans_id','td_claim_detail',whereforbulk, null);
      var trans_id  = bulktrans.msg[0].trans_id;
      var claim_no = data.emp_code+'/'+fin_name+'/'+trans_id;
     if(data.id > 0){
      var fields = `claim_dt ='${data.stdt}', description ='${data.description}', claim_type = '${data.claim_type}', fair_type = '${data.fair_type}',mode ='${data.mode}',place ='${data.place}',amount = '${data.amount}',updated_by= '${data.emp_code}',updated_dt='${dttime}'`;
      var values = '';
      var where = `id =${data.id}`;
      var res_dt = await db_Insert("td_claim_detail",fields,values, where, 1);
     }else{
      var fields = '(claim_dt,emp_code,`claim_no`,`trans_id`,description,claim_type,fair_type,mode,place,amount,purpose,`fin_year_id`,created_by,created_dt)';
      var values = `('${data.stdt}','${data.emp_code}','${claim_no}','${trans_id}','${data.description}','${data.claim_type}','${data.fair_type}','${data.mode}','${data.place}','${data.amount}','N.A.','${fin_yr}','${data.emp_code}','${dttime}')`;
       var where =  null;
        var res_dt = await db_Insert('td_claim_detail', fields,values,where,0);
     }

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
  WapiRouter.post('/claimtypelist', async(req, res) => {
    var select = "*",
    table_name = "md_claim_type",
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
  WapiRouter.post('/amttypelist', async(req, res) => {
    var select = "*",
    table_name = "md_amt_type",
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
  WapiRouter.post('/claimdtllist', async(req, res) => {
    var data = req.body;
    var select = "*",
    table_name = "td_claim_detail",
    where = `emp_code='${data.emp_code}' AND status = '0' `,
    order = `order by claim_dt DESC`;
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
  WapiRouter.post('/unapprovedclaimdelete', async(req, res) => {
    var data = req.body;
    var where = `id = '${data.id}' AND emp_code='${data.emp_code}' AND status = '0' `;
    var res_dt = await db_Delete("td_claim_detail", where);
  
      if(res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
        } else {
          result = { suc: 0,status: 'Data no found', msg: res_dt,data:req.body };
          res.send(result)
        }
      }else{
        result = { suc: 0,status: 'Fail', msg: res_dt.msg };
        res.send(result);
      }
  });
  WapiRouter.post('/attenlist', async(req, res) => {
    var data = req.body;
    var select = "atten_dt,emp_code,emp_name,in_time,out_time,out_dt",
    table_name = "td_attendance",
    where = `emp_code='${data.emp_code}' AND atten_dt >= '${data.stdt}' AND atten_dt <='${data.enddt}' `,
    order = `order by atten_dt DESC`;
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
  WapiRouter.post('/meetinglist', async(req, res) => {
    var data = req.body;
    var select = "a.visit_dt,a.emp_code,a.in_time,a.out_time,b.client_name",
    table_name = "td_visit_mgmt a,md_client b",
    where = `a.client_code = b.client_id AND a.emp_code='${data.emp_code}' AND visit_dt >= '${data.stdt}' AND visit_dt <='${data.enddt}' `,
    order = `order by visit_dt DESC`;
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

  


module.exports = { WapiRouter };
