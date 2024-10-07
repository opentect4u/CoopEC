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
    var select = "*",
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
WapiRouter.post("/mobile_login", async (req, res) => {
  var data = req.body,
    result;
  console.log(data);
  var select = "user_name,user_id,user_type,user_id,user_status,password",
    table_name = "md_user",
    whr = `user_id='${data.user_id}' AND user_type='U'`,
    order = null;
  var res_dt = await db_Select(select, table_name, whr, order);
  if (res_dt.suc > 0) {
    if (res_dt.msg.length > 0) {
      if (await bcrypt.compare(data.password, res_dt.msg[0].password)) {
        res.send({ suc: 1, status: "Data found", msg: res_dt.msg[0] })
      } else {
        result = {
          suc: 0,
          msg: "Please check your userid or password",
          dt: res_dt
        };
        res.send(result)
      }
    } else {
      result = { suc: 0, msg: "No data found", dt: res_dt };
      res.send(result)
    }
  } else {
    result = { suc: 0, msg: res_dt.msg, dt: res_dt };
    res.send(result);
  }
});
WapiRouter.post("/change_pass", async (req, res) => {
  var dttime= moment().format("YYYY-MM-DD HH:mm:ss");
  var data = req.body,
    result;
  var select = "*",
    table_name = "md_user",
    whr = `user_id='${data.user_id}' AND user_type='U'`,values = null,
    order = null;
  var res_dt = await db_Select(select, table_name, whr, order);
  if (res_dt.suc > 0) {
    if (res_dt.msg.length > 0) {
      if (await bcrypt.compare(data.oldpass, res_dt.msg[0].password)) {
         var pass = bcrypt.hashSync(data.password, 10);
         var fields = `password ='${pass}',modified_by ='${data.user_id}',modified_dt='${dttime}' `;
         var resin = await db_Insert('md_user', fields,values, whr, 1);

        res.send({ suc: 1, status: "Data found", msg: resin.msg })
      } else {
        result = {
          suc: 0,
          msg: "Please Give correct old password",
          dt: res_dt
        };
        res.send(result)
      }
    } else {
      result = { suc: 0, msg: "No data found", dt: res_dt };
      res.send(result)
    }
  } else {
    result = { suc: 0, msg: res_dt.msg, dt: res_dt };
    res.send(result);
  }
});



async function getCoordinatesFromAddress(address) {
  return new Promise(async(resolve,reject)=>{
    try {
      const response = await axios.get(
          `${config.gapiurl_for_address}${encodeURIComponent(address)}&key=${config.gapikey}`
      );
      const { results } = response.data;
      if (results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          resolve ({ lat: lat, lng: lng });
      } else {
          console.log('No results found for the given address.');
          reject({ lat: 0, lng: 0 }) ;
      }
  } catch (error) {
      console.error('Error fetching coordinates:', error.message);
      reject({ lat: 0, lng: 0 }) ;
  }
  })
  
}
  //   ***********  10/04/2024 -- Code Start for Saving Employee Attendence Detail      *******    //
  WapiRouter.post("/atten_save", async (req, res) => {
    var data = req.body;
    var date_time = dateFormat(new Date(), "yyyy-mm-dd ");
    var st_point = 0;
    var visit_dtl_id = 0;
    var fields = data.id > 0 ? `out_time ='${data.out_time}',out_dt ='${date_time}', out_location ='${data.in_location}', out_lat = '${data.in_lat}', out_long = '${data.in_long}'` : '(atten_dt,emp_code,emp_name,in_time,out_time,in_location,in_lat,in_long)';
    var  values = `('${date_time}','${data.emp_code}','${data.emp_name}','${data.in_time}',${null},'${data.in_location}','${data.in_lat}','${data.in_long}')`;

    var fields1 = '(`emp_code`,`tour_dt`,`sl_no`,visit_dtl_id,`lat_pos`,`long_pos`,`type`,`distance`)';
    var value1  = `('${data.emp_code}','${date_time}','${st_point}','${visit_dtl_id}','${data.in_lat}',${data.in_long},'L','0')`;
  
    var where = data.id > 0 ? `sl_no = '${data.id}'` : null,
    flag = data.id > 0 ? 1 : 0;
   var res_dt = await db_Insert('td_attendance', fields,values,where,flag);
   if(data.id < 1){
    var tourin = await db_Insert('td_tour_details', fields1,value1,null,0);
   }
    console.log(res_dt);
    if(res_dt.suc > 0){
       
        res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
    }else{
       
        res.send({ suc: 0, status: "Data Not found", msg: res_dt.msg })
    }
   
  });
  //   ***********   Code End for Saving Employee Attendence Detail      *******    //

//   ***********  10/04/2024 -- Code Start for Saving Employee Attendence Detail      *******    //
WapiRouter.post("/client_save", async (req, res) => {
    var data = req.body;
    var date_time = dateFormat(new Date(), "yyyy-mm-dd");
    var ph_number = data.mobile > 0 ? data.mobile : 0;
    const coordinates =  await getCoordinatesFromAddress(data.client_addr);
    var fields = '(client_name,mobile,email,client_addr,lat_pos,log_pos,create_status,created_by,created_at)';
    var values = `('${data.client_name}','${ph_number}','${data.email}','${data.client_addr}',${coordinates.lat},'${coordinates.lng}','M','${data.emp_code}','${data.created_at}')`;
  
    var where = data.id > 0 ? `sl_no = '${data.id}'` : null,
    flag = data.id > 0 ? 1 : 0;
   var res_dt = await db_Insert('md_client', fields,values,where,flag);
    console.log(res_dt);
    if(res_dt.suc > 0){
       
        res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
    }else{
       
        res.send({ suc: 0, status: "Data Not found", msg: res_dt.msg })
    }
   
  });
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
WapiRouter.post("/visit_sch_mgmt_save", async (req, res) => {
  var data = req.body;
 
  var fields = `visit_dt = '${data.visit_dt}',distance = '${data.distance}',in_time = '${data.in_time}',out_time = '${data.out_time}',in_out_flag = 'I',location = '${data.location}',lat_pos = '${data.lat_pos}',long_pos = '${data.long_pos}',position_name = '${data.location}'`;
  var where =`sl_no = '${data.id}'`;
  var values = '';
  var res_dt = await db_Insert('td_visit_mgmt', fields,values,where,1);
  
  if(res_dt.suc > 0){
    var fields1 = '(`emp_code`,`tour_dt`,`sl_no`,`visit_dtl_id`,`lat_pos`,`long_pos`,`type`,`distance`)';
    var value1  = `('${data.emp_code}','${data.visit_dt}','${data.tourslno}','${data.id}','${data.lat_pos}','${data.long_pos}','T','${data.tourdistance}')`;
    //if(data.id < 1){
      var tourin = await db_Insert('td_tour_details', fields1,value1,null,0);
    // }
      res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
  }else{
     
      res.send({ suc: 0, status: "Data Not found", msg: res_dt.msg })
  }
 
});
WapiRouter.post("/add_schedule", async (req, res) => {
  var data = req.body;
  var date_time = dateFormat(new Date(), "yyyy-mm-dd");
  var fields = '(sch_dt,visit_type,emp_code,client_code,org_name,distance,in_out_flag,created_by,created_dt)';
  var values = `('${data.sch_dt}','1','${data.emp_code}','${data.client_code}','${data.org_name}','${data.distance}','S','${data.emp_code}','${date_time}')`;
  var where = data.id > 0 ? `sl_no = '${data.id}'` : null;
  
 var res_dt = await db_Insert('td_visit_mgmt', fields,values,where,0);
  
  if(res_dt.suc > 0){
     
      res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
  }else{
     
      res.send({ suc: 0, status: "Data Not found", msg: res_dt.msg })
  }
 
});
    WapiRouter.post("/visit_mgmt_dtlsby", async (req, res) => {
      var data = req.body,
        result;
        var date_time = dateFormat(new Date(), "yyyy-mm-dd");
      var select = "sl_no,DATE_ADD(visit_dt, INTERVAL 1 DAY) AS visit_dt,emp_code,client_code,org_name,client_addr,dist_id,contact_person,phone_no,email_id,distance,in_time,out_time,in_out_flag,location,lat_pos,long_pos,position_name,remarks",
        table_name = "td_visit_mgmt",
        whr = `emp_code='${data.emp_code}' AND (visit_dt = '${date_time}' OR sch_dt = '${date_time}')`,
        order = null;
      var res_dt = await db_Select(select, table_name, whr, order);
        if (res_dt.suc > 0) {
          if (res_dt.msg.length > 0) {
              res.send({ suc: 1, status: "Data found", msg: res_dt.msg })
          
          } else {
            result = { suc: 0,status: 'Data no found', msg: req.body };
            res.send(result)
          }
        } else {
          result = { suc: 0,status: 'Fail', msg: req.body };
          res.send(result);
        }
    });

    WapiRouter.post("/visit_mgmt_dtls", async (req, res) => {
    
      var data = req.body,
        result;
      var select = "a.*,b.client_addr",
        table_name = "td_visit_mgmt a,md_client b",
        whr = `a.client_code = b.client_id AND a.sl_no='${data.id}' `,
        order = null;
      var res_dt = await db_Select(select, table_name, whr, order);
       
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
    WapiRouter.post("/get_last_lat_long", async (req, res) => {
      
      var data = req.body,result;
      var date_time = dateFormat(new Date(), "yyyy-mm-dd");
      order = null;
       var select1 = "*", table_name1 = "td_tour_details";
       var whr1 = `emp_code='${data.emp_code}' and tour_dt ='${date_time}' order by sl_no desc limit 1`;
       var res_dt = await db_Select(select1, table_name1, whr1, order);
      
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
//   ***********   Code End for Saving Employee Visit Detail      *******    //


  WapiRouter.post('/client_details', async(req, res) => {
      var select = "*",
      table_name = "md_client",
      where = null,
      order = `order by client_name ASC`;
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
    
    

    WapiRouter.post('/getclidetail', async(req, res) => {
      var data = req.body;
      var select = "*",
      table_name = "md_client",
      where =  `client_id = '${data.client_id}'` ,
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

    WapiRouter.post('/get_schedule', async(req, res) => {
      var data = req.body;
      var select = "*",
      table_name = "td_visit_mgmt",
      where =  `emp_code = '${data.emp_code}' AND visit_type ='1' `,
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
