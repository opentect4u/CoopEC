const SocietyRouter = require("express").Router();
const axios = require("axios");
const moment = require("moment");
const logger = require('../logger'); 
const {
  db_Select,
  db_Insert,
  SendNotification,
  db_Delete,
} = require("../modules/MasterModule");
SocietyRouter.use((req, res, next) => {
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
SocietyRouter.get("/edit", async (req, res) => {
  try {
    // Extract range_id from session
    const soc_id = req.query.id;
    var range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
  
    const select = "*";
    const table_name = "md_society";
    const whr = `id='${soc_id}' `;
    const order = null;
    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const typelist = await db_Select("*", "md_society_type", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const regauttypehres = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    if (range_id > 0) {
      var devauth_name = await db_Select(
        "*",
        "md_developement_authority",
        `range_id=${range_id}`,
        null,
      );
    } else {
      var devauth_name = await db_Select(
        "*",
        "md_developement_authority",
        null,
        null,
      );
    }
    const regauthres = await db_Select(
      "*",
      "md_controlling_authority",
      null,
      null,
    );
    const zoneres = await db_Select("*", "md_zone", null, null);
    const distres = await db_Select("*", "md_district", null, null);
    const distcode = result.msg[0].dist_code > 0 ? result.msg[0].dist_code : 0;
    const zone_id = result.msg[0].zone_code > 0 ? result.msg[0].zone_code : 0;
    var ranzeres = await db_Select(
      "*",
      "md_range",
      `dist_id='${distcode}'`,
      null,
    );
    var mergranzeres = ranzeres.msg;
    
    if(distcode == 15 || distcode ==  21 ){
      mergranzeres.push({ range_id: 28, range_name: 'Kolkata Metropolitan Area Housing' });
    }
    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const ulbres = await db_Select("*", "md_ulb", null, null);
    const managementres = await db_Select(
      "*",
      "md_management_status",
      null,
      null,
    );
    const officertyperes = await db_Select("*", "md_officer_type", null, null);
    const caseflagres = await db_Select("*", "md_case_flag", null, null);
    const wardres = await db_Select("*", "md_ward", null, null);
    
    //var dist_code_for_range = await db_Select("dist_id", "md_range", `range_id=${range_id}`, null);
    if(cntr_auth_type > 1){
        var blockres = await db_Select(
          "*",
          "md_block",
          `dist_id='${range_id}'`,
          null,
        );
    }else{
      var blockres = await db_Select(
        "*",
        "md_block",
        `dist_id='${distcode}'`,
        null,
      );
    }
    const gpres = await db_Select("*", "md_gp", `dist_id='${distcode}'`, null);
    const villres = await db_Select(
      "*",
      "md_village",
      `dist_id='${distcode}'`,
      null,
    );
    //const boardmembdtsl = await db_Select('*', 'td_board_member',  `tenure_ends_on >= CURDATE() AND soc_id='${soc_id}'`, null);
    const boardmembdtsl = await db_Select(
      "*",
      "td_board_member",
      `soc_id='${soc_id}'`,
      null,
    );

    // Prepare data for rendering
    const res_dt = {
      soc: result.suc > 0 ? result.msg[0] : "",
      soctypelist: typelist.suc > 0 ? typelist.msg : "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      regauthlist: regauthres.suc > 0 ? regauthres.msg : "",
      moment: moment,cntr_auth_id:cntr_auth_type,
      zonelist: zoneres.suc > 0 ? zoneres.msg : "",
      districtlist: distres.suc > 0 ? distres.msg : "",
      ranzelist: ranzeres.suc > 0 ? mergranzeres : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      ulblist: ulbres.suc > 0 ? ulbres.msg : "",
      managementlist: managementres.suc > 0 ? managementres.msg : "",
      officertypelist: officertyperes.suc > 0 ? officertyperes.msg : "",
      caseflaglist: caseflagres.suc > 0 ? caseflagres.msg : "",
      wardlist: wardres.suc > 0 ? wardres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      gplist: gpres.suc > 0 ? gpres.msg : "",
      villlist: villres.suc > 0 ? villres.msg : "",
      boardmembdlist: boardmembdtsl.suc > 0 ? boardmembdtsl.msg : "",
      devauth_list: devauth_name.suc > 0 ? devauth_name.msg : "",
    };
    
    // Render the view with data
    res.render("society/edit", res_dt);
  } catch (error) {
    logger.error(err); // log the error
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("dashboard/edit", res_dt);
  }
});
SocietyRouter.post("/socedit", async (req, res) => {
  try {
    // Extract range_id from session
    var user_id = req.session.user.user_id;

    var date_ob = moment();
    var range_id_ = req.session.user.range_id;
    // Format it as YYYY-MM-DD HH:mm:ss
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");

    //   ********   Code For Getting Ip   *********   //
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
       var ip = req.clientIp;
    //   ********   Code For Getting Ip   *********  //

    var data = req.body;
    var table_name = "md_society";
    var values = null;
    var block_id = data.block_id || 0;
    var gp_id = data.gp_id || 0;
    var ulb_catg = data.ulb_catg || 0;
    var officer_type = data.officer_type || 0;
    var ulb_id = data.ulb_id || 0;
    var dev_auth_id = data.dev_auth_id || 0;
    var num_of_memb = data.num_of_memb != '' ? `${data.num_of_memb}` : 0;
    var last_elec_date = data.last_elec_date != "" ? `'${data.last_elec_date}'` : "NULL";
    var elec_due_date = data.elec_due_date != "" ? `'${data.elec_due_date}'` : "NULL";
    var tenure_ends_on = data.tenure_ends_on != "" ? `'${data.tenure_ends_on}'` : "NULL";
    const rangeCode = data.range_code ? data.range_code : 0;
    var fields = `cop_soc_name = '${data.cop_soc_name
      .split("'")
      .join("\\'")}',new_flag='${data.new_flag}',reg_no = '${
      data.reg_no
    }',reg_date = '${data.reg_date}',soc_tier = '${data.soc_tier}',
      soc_type = '${data.soc_type}',cntr_auth_type='${
        data.cntr_auth_type
      }',cntr_auth='${data.cntr_auth}',dist_code='${data.dist_code}',
      ulb_catg = '${ulb_catg}',ulb_id = '${ulb_id}',ward_no = '${
        data.ward_no
      }',pin_no = '${data.pin_no}',range_code = '${rangeCode}',
      urban_rural_flag ='${data.urban_rural_flag}',dev_auth_id =${
        dev_auth_id
      },
      block_id = ${block_id},gp_id = ${gp_id},vill_id = ${
        data.vill_id
      },mouza = '${data.mouza}',address='${data.address
        .split("'")
        .join("\\'")}',num_of_memb=${num_of_memb},audit_upto='${
        data.audit_upto
      }',
      mgmt_status = '${
        data.mgmt_status
      }',officer_type = ${officer_type},last_elec_date = ${last_elec_date},
      tenure_ends_on = ${tenure_ends_on},elec_due_date = ${elec_due_date},contact_name='${data.contact_name}',contact_designation='${
        data.contact_designation
      }',
      contact_number = '${data.contact_number}',email = '${
        data.email
      }',case_id='${data.case_id}',case_num='${
        data.case_num
      }',functional_status='${
        data.functional_status
      }',approve_status='E',election_status='${
        data.election_status
      }',modified_by='${user_id}',
      modified_dt = '${formattedDate}',modified_ip='${ip}' `;
    var whr = `id = '${data.id}'`;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);

    const board_memb_id = data["board_memb_id[]"];
    const board_memb_name = data["board_memb_name[]"];
    const board_memb_desig = data["board_memb_desig[]"];
    const bm_contact_no = data["bm_contact_no[]"];
    const board_memb_father = data["board_memb_father[]"];
    const board_memb_email  = data["board_memb_email[]"];

    for (let i = 0; i < board_memb_name.length; i++) {
      // Only process if board_memb_name is not empty
      if (board_memb_name[i].length > 0) {
        // Construct the values string for insertion
        const values = `('${data.id}', '${board_memb_name[i]}','${board_memb_desig[i]}','${board_memb_father[i]}','${board_memb_email[i]}','${bm_contact_no[i]}','${
          data.tenure_ends_on
        }','${user_id}','${moment().format("YYYY-MM-DD HH:mm:ss")}','${ip}')`;
        console.log(board_memb_name[i]);
        if (board_memb_id[i] > 0) {
          // Update existing record
          const fields = `board_memb_name = '${
            board_memb_name[i]
          }', board_memb_desig = '${board_memb_desig[i]}',bm_contact_no = '${
            bm_contact_no[i]
          }',tenure_ends_on ='${
            data.tenure_ends_on
          }',board_memb_father ='${board_memb_father[i]}',board_memb_email ='${board_memb_email[i]}', modified_by = '${user_id}', modified_at = '${moment().format(
            "YYYY-MM-DD HH:mm:ss",
          )}',created_ip='${ip}'`;
          await db_Insert(
            "td_board_member",
            fields,
            null,
            `board_memb_id = ${board_memb_id[i]}`,
            true,
          );
        } else {
          // Insert new record
          const fields =
            "(`soc_id`, `board_memb_name`, `board_memb_desig`,`board_memb_father`,`board_memb_email`,`bm_contact_no`,`tenure_ends_on`,`created_by`, `created_dt`,`created_ip`)";
          await db_Insert("td_board_member", fields, values, null, false);
        }
      }
    }
    var message = `Society ${data.cop_soc_name
      .split("'")
      .join("\\'")} Updated by ${user_id}.`;
    var noti_fields = `(type,message,wrk_releated_id,user_type,view_status,range_id,created_by,created_at,created_ip)`;
    var noti_values = `('S','${message}','${data.id}','M','1','${data.range_code}','${user_id}','${formattedDate}','${ip}')`;
    // var sa_data = await db_Insert(
    //   "td_notification",
    //   noti_fields,
    //   noti_values,
    //   null,
    //   false,
    // );
    // if (sa_data.suc > 0) {
    //   console.log("Event is emmititng");
    //   var notification_dtls = await SendNotification(range_id_);
    //   req.io.emit("notification", { message: notification_dtls.msg });
    // }

    req.flash("success_msg", "Update successful!");
    res.redirect("/dash/dashboard");
  } catch (error) {
    logger.error(err); // log the error
    // Log the error and send an appropriate response
    req.flash("error_msg", "Some Thing went wrong !");
    res.render("/dash/dashboard");
  }
});

SocietyRouter.get("/socadd", async (req, res) => {
  try {
    // Extract range_id from session
    const soc_id = req.query.id;
    const range_id = req.session.user.range_id;
    const select = "*";
    const table_name = "md_society";
    const whr = `id='${soc_id}' `;
    const order = null;
    //   var where_dist_con = `b.dist_id = a.dist_code AND b.range_id = '${range_id}'`;
    // Execute database query
    // const result = await db_Select(select, table_name, whr, order);
    const typelist = await db_Select("*", "md_society_type", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const regauttypehres = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    const regauthres = await db_Select(
      "*",
      "md_controlling_authority",
      null,
      null,
    );
    const zoneres = await db_Select("*", "md_zone", null, null);
    const distres = await db_Select("*", "md_district", null, null);
    if(req.session.user.user_type == 'S'){
        var ranzeres = await db_Select("*", "md_range", null, null);
        var distcode = 0;
    }else{
    if (req.session.user.cntr_auth_type == 1) {
      var ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id='${range_id}'`,
        null,
      );
      var distcode = ranzeres.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
    } else {
      var ranzeres = await db_Select("*", "md_range", null, null);
      var distcode = range_id;
    }
   }
    if (range_id > 0) {
      var devauth_name = await db_Select(
        "*",
        "md_developement_authority",
        `range_id=${range_id}`,
        null,
      );
    } else {
      var devauth_name = await db_Select(
        "*",
        "md_developement_authority",
        null,
        null,
      );
    }

    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const ulbres = await db_Select("*", "md_ulb", null, null);
    const managementres = await db_Select(
      "*",
      "md_management_status",
      null,
      null,
    );
    const officertyperes = await db_Select("*", "md_officer_type", null, null);
    const caseflagres = await db_Select("*", "md_case_flag", null, null);
    const wardres = await db_Select("*", "md_ward", null, null);
    const blockres = await db_Select(
      "*",
      "md_block",
      `dist_id='${distcode}'`,
      null,
    );
    const gpres = await db_Select("*", "md_gp", `dist_id='${distcode}'`, null);
    const villres = await db_Select(
      "*",
      "md_village",
      `dist_id='${distcode}'`,
      null,
    );
    const boardmembdtsl = await db_Select(
      "*",
      "td_board_member",
      `soc_id='${soc_id}'`,
      null,
    );

    // Prepare data for rendering
    const res_dt = {
      soctypelist: typelist.suc > 0 ? typelist.msg : "",
      soc: "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      regauthlist: regauthres.suc > 0 ? regauthres.msg : "",
      moment: moment,
      zonelist: zoneres.suc > 0 ? zoneres.msg : "",
      districtlist: distres.suc > 0 ? distres.msg : "",
      ranzelist: ranzeres.suc > 0 ? ranzeres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      ulblist: ulbres.suc > 0 ? ulbres.msg : "",
      managementlist: managementres.suc > 0 ? managementres.msg : "",
      officertypelist: officertyperes.suc > 0 ? officertyperes.msg : "",
      caseflaglist: caseflagres.suc > 0 ? caseflagres.msg : "",
      wardlist: wardres.suc > 0 ? wardres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      gplist: gpres.suc > 0 ? gpres.msg : "",
      villlist: villres.suc > 0 ? villres.msg : "",
      boardmembdlist: boardmembdtsl.suc > 0 ? boardmembdtsl.msg : "",
      devauth_list: devauth_name.suc > 0 ? devauth_name.msg : "",
    };
    // Render the view with data
    res.render("society/add", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    // res.render('dashboard/edit', res_dt);
  }
});
SocietyRouter.post("/socadddata", async (req, res) => {
  try {
    // Extract range_id from session
    var user_id = req.session.user.user_id;
    var datetime = moment().format("YYYY-MM-DD HH:mm:ss");

    //   ********   Code For Getting Ip   *********   //
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
     var ip = '';
    //   ********   Code For Getting Ip   *********  //
    var data = req.body;
    var table_name = "md_society";
    var values = null;
    var block_id = data.block_id || 0;
    var gp_id = data.gp_id || 0;
    var ulb_catg = data.ulb_catg || 0;
    var ulb_id = data.ulb_id || 0;
    var dev_auth_id = data.dev_auth_id || 0;
    var officer_type = data.officer_type || 0;
    var last_elec_date = data.last_elec_date != "" ? `'${data.last_elec_date}'` : "NULL";
    var elec_due_date = data.elec_due_date != "" ? `'${data.elec_due_date}'` : "NULL";
    var tenure_ends_on = data.tenure_ends_on != "" ? `'${data.tenure_ends_on}'` : "NULL";
    var fields = `(cop_soc_name,new_flag,reg_no,reg_date,soc_type,soc_tier,cntr_auth_type,cntr_auth,state_code,zone_code,dist_code,range_code,urban_rural_flag,dev_auth_id,ulb_catg,ulb_id,ward_no,block_id,gp_id,vill_id,pin_no,address,mouza,num_of_memb,audit_upto,mgmt_status,officer_type,last_elec_date,tenure_ends_on,elec_due_date,contact_name,contact_designation,contact_number,email,case_id,case_num,functional_status,approve_status,created_by,created_dt,created_ip)`;
    var values = `('${data.cop_soc_name.split("'").join("\\'")}','${
      data.new_flag
    }','${data.reg_no}','${data.reg_date}','${data.soc_type}','${
      data.soc_tier
    }','${data.cntr_auth_type}','${data.cntr_auth}',19,'${data.zone_code}','${
      data.dist_code
    }','${data.range_code}','${data.urban_rural_flag}',${dev_auth_id},'${ulb_catg}','${ulb_id}','${data.ward_no}','${block_id}','${gp_id}','${
      data.vill_id
    }','${data.pin_no}','${data.address}','${data.mouza}','${
      data.num_of_memb
    }','${data.audit_upto}','${data.mgmt_status}',${officer_type},${last_elec_date},${tenure_ends_on},${elec_due_date},'${
      data.contact_name
    }','${data.contact_designation}','${data.contact_number}','${
      data.email
    }','${data.case_id}','${data.case_num}','${
      data.functional_status
    }','E','${user_id}','${datetime}','${ip}')`;
    var whr = null;
    var save_data = await db_Insert(table_name, fields, values, whr, 0);

    var soc_id = save_data.lastId.insertId;

    //   Save Data for Election Audit
    var fields1 = `(soc_id,mgmt_status,officer_type,audit_upto,last_elec_date,tenure_ends_on,elec_due_date,contact_name,created_by,created_dt)`;
    var values1 = `('${soc_id}','${data.mgmt_status}','${officer_type}','${data.audit_upto}','${data.last_elec_date}','${data.tenure_ends_on}','${data.elec_due_date}','${data.contact_name}','${data.user_id}','${datetime}')`;
    var election_res = await db_Insert(
      "td_election_details",
      fields1,
      values1,
      null,
      0,
    );

    const board_memb_id = data["board_memb_id[]"];
    const board_memb_name = data["board_memb_name[]"];
    const board_memb_desig = data["board_memb_desig[]"];
    const bm_contact_no = data["bm_contact_no[]"];
    const board_memb_father = data["board_memb_father[]"];
    const board_memb_email = data["board_memb_email[]"];

    for (let i = 0; i < board_memb_name.length; i++) {
      // Only process if board_memb_name is not empty
      if (board_memb_name[i].length > 0) {
        // Construct the values string for insertion
        const values = `('${soc_id}', '${board_memb_name[i]}', '${board_memb_desig[i]}','${board_memb_father[i]}','${board_memb_email[i]}','${bm_contact_no[i]}','${user_id}','${moment().format("YYYY-MM-DD HH:mm:ss")}','${ip}')`;

        if (board_memb_id[i] > 0) {
          // Update existing record
          const fields = `board_memb_name = '${
            board_memb_name[i]
          }', board_memb_desig = '${board_memb_desig[i]}',board_memb_father = '${board_memb_father[i]}',
           board_memb_email = '${board_memb_email[i]}',bm_contact_no = '${bm_contact_no[i]}', modified_by = '${user_id}', modified_at = '${moment().format(
            "YYYY-MM-DD HH:mm:ss",
          )}',modified_id='${ip}' `;
          await db_Insert(
            "td_board_member",
            fields,
            null,
            `board_memb_id = ${board_memb_id[i]}`,
            true,
          );
        } else {
          // Insert new record
          const fields =
            "(`soc_id`, `board_memb_name`, `board_memb_desig`,`board_memb_father`,`board_memb_email`,`bm_contact_no`, `created_by`, `created_dt`,`created_ip`)";
          await db_Insert("td_board_member", fields, values, null, false);
        }
      }
    }

    res.redirect("/dash/dashboard");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.redirect("/dash/dashboard");
  }
});

SocietyRouter.get("/board_memb_del", async (req, res) => {
  try {
    var id = req.query.id,
      where = `board_memb_id = '${id}' `;
    var soc_id = req.query.soc_id;
    var res_dt = await db_Delete("td_board_member", where);
    if (res_dt.suc > 0) {
      var responseData = {
        td_id: id,
        message: "Status updated successfully",
        success: true, // Echoing the received claims
      };
    } else {
      var responseData = {
        message: "Fail",
        success: false, // Echoing the received claims
      };
    }
    res.json(responseData);
    //res.redirect("/society/edit?id="+soc_id);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("dash/dashboard");
  }
});
SocietyRouter.get("/socdelet", async (req, res) => {
  try {
  
    var user_id = req.session.user.user_id;
    var date_ob = moment();
    var datetime = date_ob.format("YYYY-MM-DD HH:mm:ss");
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    var ip = '';
     console.log('Test is going on');
  //   *** Code for Insert and Delete Option  //
    var soc_id = req.query.id;
    var where = `id = '${soc_id}' `;
    var get_data = await db_Select("*", "md_society", where, null);
   var data = get_data.msg[0];

   var created_dt = moment(data.created_dt, 'YYYY-MM-DD', true).isValid() 
    ? moment(data.created_dt).format('YYYY-MM-DD') 
    : '0000-00-00 00:00:00';
    var fields = `(cop_soc_name,new_flag,reg_no,reg_date,soc_type,soc_tier,cntr_auth_type,cntr_auth,state_code,zone_code,dist_code,range_code,urban_rural_flag,dev_auth_id,ulb_catg,ulb_id,ward_no,block_id,gp_id,vill_id,pin_no,address,mouza,num_of_memb,audit_upto,mgmt_status,officer_type,last_elec_date,tenure_ends_on,elec_due_date,contact_name,contact_designation,contact_number,email,case_id,case_num,functional_status,approve_status,created_by,created_dt,created_ip,deleted_by,deleted_dt,deleted_ip)`;
    var values = `('${data.cop_soc_name.split("'").join("\\'")}','${
      data.new_flag
    }','${data.reg_no}','${moment(data.reg_date,'YYYY-MM-DD').format('YYYY-MM-DD')}','${data.soc_type}','${
      data.soc_tier
    }','${data.cntr_auth_type}','${data.cntr_auth}',0,'${data.zone_code}','${
      data.dist_code
    }','${data.range_code}','${data.urban_rural_flag}','${
      data.dev_auth_id
    }','${data.ulb_catg}','${data.ulb_id}','${data.ward_no}','${data.block_id}','${data.gp_id}','${
      data.vill_id
    }','${data.pin_no}','${data.address}','${data.mouza}','${
      0
    }','${data.audit_upto}','${'0'}','${'0'}','${datetime}','${datetime}','${datetime}','${
      data.contact_name
    }','${data.contact_designation}','${data.contact_number}','${
      data.email
    }','${data.case_id}','${data.case_num}','${
      data.functional_status
    }','E','${data.created_by}','${datetime}','${
      data.created_ip
    }','${user_id}','${datetime}','${ip}')`;
   
    var save_data = await db_Insert("md_society_delete", fields, values, null, 0);
    if(save_data.suc > 0){
        var res_dt = await db_Delete("md_society", where);
        var res_dt = await db_Delete("td_board_member", `soc_id = '${soc_id}' `);
        if (res_dt.suc > 0) {
          req.flash("success_msg", "Deleted successful!");
      
        } else {
          req.flash("error_msg", "Something Went Wrong!");
        }
    }
    // res.json(responseData);
    res.redirect("/dash/dashboard");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.redirect("/dash/dashboard");
  }
});
SocietyRouter.get("/regauth", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const contr_auth_type_id = req.query.contr_auth_type_id;
    // In a real application, you might query a database or perform other operations
    const contauthres = await db_Select(
      "controlling_authority_id,controlling_authority_name",
      "md_controlling_authority",
      `contr_auth_type_id='${contr_auth_type_id}'`,
      null,
    );
    const responseData = {
      contauthlist: contauthres.suc > 0 ? contauthres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/ulblist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const ulb_catg = req.query.ulb_catg;
    const dist_code = req.query.dist_code;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select(
      "ulb_id,ulb_name",
      "md_ulb",
      `ulb_catg_id='${ulb_catg}' AND dist_code='${dist_code}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/wardlist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const ulb_catg = req.query.ulb_catg;
    const ulb_id = req.query.ulb_id;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select(
      "ward_id,ward_name",
      "md_ward",
      `ulb_catg_id='${ulb_catg}' AND ulb_id='${ulb_id}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/blocklist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const dist_code = req.query.dist_code;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select(
      "block_id,block_name",
      "md_block",
      `dist_id='${dist_code}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/gplist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const block_id = req.query.block_id;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select(
      "gp_id,gp_name",
      "md_gp",
      `block_id='${block_id}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

SocietyRouter.get("/villlist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const block_id = req.query.block_id;
    const gp_id = req.query.gp_id;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select(
      "vill_id,vill_name",
      "md_village",
      `block_id='${block_id}' AND gp_id='${gp_id}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/zonelist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const dist_code = req.query.dist_code;
    const datahres = await db_Select(
      "a.zone_id,b.zone_name",
      "md_range a,md_zone b",
      `a.zone_id= b.zone_id AND a.dist_id='${dist_code}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/rangelist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const dist_code = req.query.dist_code;
    const datahres = await db_Select(
      "range_id,range_name",
      "md_range",
      `dist_id='${dist_code}' AND range_id != 0 `,
      null,
    );
    var mergedat = datahres.msg;
    
      if(dist_code == 15 || dist_code ==  21 ){
        mergedat.push({ range_id: 28, range_name: 'Kolkata Metropolitan Area Housing' });
      }
     
    const responseData = {
      datahlist: datahres.suc > 0 ? mergedat : "", // Echoing the received claims
    };

    console.log(mergedat);
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
SocietyRouter.get("/getsuggestions", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const sugname = req.query.name;
    const range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    if(cntr_auth_type == 1){
        if (range_id > 0) {
          var datahres = await db_Select(
            "cop_soc_name",
            "md_society",
            `(cntr_auth_type=${cntr_auth_type} OR cntr_auth_type = 0) AND range_code='${range_id}' AND cop_soc_name LIKE '%${sugname
              .split("'")
              .join("\\'")}%'`,
            null,
          );
        } else {
          var datahres = await db_Select(
            "cop_soc_name",
            "md_society",
            `cop_soc_name LIKE '%${sugname.split("'").join("\\'")}%'`,
            null,
          );
        }
    }else{
          if(req.session.user.user_type == 'S'){
          var datahres = await db_Select(
            "cop_soc_name",
            "md_society",
            `cop_soc_name LIKE '%${sugname
              .split("'")
              .join("\\'")}%'`,
            null,
          );
        }else{
          var datahres = await db_Select(
            "cop_soc_name",
            "md_society",
            `(cntr_auth_type = "${cntr_auth_type}" OR cntr_auth_type = 0) AND dist_code='${range_id}' AND cop_soc_name LIKE '%${sugname
              .split("'")
              .join("\\'")}%'`,
            null,
          );
        }
    }
    

    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

SocietyRouter.get("/distlist", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const zone_code = req.query.zone_code;
    const datahres = await db_Select(
      "DISTINCT b.*",
      "md_range a,md_district b",
      `a.dist_id = b.dist_code AND a.zone_id='${zone_code}'`,
      null,
    );
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

SocietyRouter.get("/modifiedlist", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    if (cntr_auth_type == 1) {
      var select =
        "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      if (range_id > 0) {
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" AND cntr_auth_type='${cntr_auth_type}' AND approve_status = 'E' `;
      } else {
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND approve_status = 'E' `;
      }
      whr = "";
      var order = null;
      if (range_id > 0) {
        whr1 = `functional_status='Functional' AND range_code='${range_id}' AND approve_status = 'E'`;
      } else {
        whr1 = `functional_status='Functional' AND approve_status = 'E' `;
      }
    } else {
      var select =
        "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.dist_code = "${range_id}" AND cntr_auth_type='${cntr_auth_type}' AND approve_status = 'E' `;

      var whr = "";
      var order = null;
      var whr1 = `functional_status='Functional' AND dist_code='${range_id}' AND cntr_auth_type='${cntr_auth_type}' AND approve_status = 'E'`;
    }

    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const select2 = "COUNT(*) as total";
    const countResult = await db_Select(select2, "md_society", whr1, order);
    const total = countResult.msg[0].total;
    const totalPages = Math.ceil(total / 25);

    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      socname: "",
      total: total,
      socname: "",
      range_name: "",
    };
    // Render the view with data
    res.render("society/modified_list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("society/modified_list", res_dt);
  }
});
SocietyRouter.post("/modifiedlist", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var formdata = req.body;
    if (formdata.socname && formdata.socname.trim() !== "") {
      var soc_name = `AND a.cop_soc_name LIKE '%${formdata.socname.split("'").join("\\'")}%' `;
    } else {
      var soc_name = "";
    }

    var cntr_auth_type = req.session.user.cntr_auth_type;
    if (cntr_auth_type == 1) {
      var select =
        "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      if (range_id > 0) {
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" ${soc_name} AND approve_status = 'E' `;
      } else {
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${soc_name} AND approve_status = 'E' `;
      }
      whr = "";
      var order = null;
      if (range_id > 0) {
        whr1 = `functional_status='Functional' ${soc_name} AND range_code='${range_id}' AND approve_status = 'E'`;
      } else {
        whr1 = `functional_status='Functional' ${soc_name} AND approve_status = 'E' `;
      }
    } else {
      var select =
        "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.dist_code = "${range_id}" ${soc_name} AND cntr_auth_type='${cntr_auth_type}' AND approve_status = 'E' `;

      var whr = "";
      var order = null;
      var whr1 = `functional_status='Functional' ${soc_name} AND dist_code='${range_id}' AND cntr_auth_type='${cntr_auth_type}' AND approve_status = 'E'`;
    }

    // const select =
    //   "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
    // if (range_id > 0) {
    //   var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" ${soc_name} AND approve_status ='E' `;
    // } else {
    //   var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${soc_name} AND approve_status ='E'`;
    // }
    // whr = '';
    // const order = null;
    // if (range_id > 0) {
    //   whr1 = `functional_status='Functional' AND range_code='${range_id}' ${soc_name} AND approve_status ='E'`;
    // } else {
    //   whr1 = `functional_status='Functional' ${soc_name} AND approve_status ='E' `;
    // }

    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const select2 = "COUNT(*) as total";
    const countResult = await db_Select(select2, "md_society a", whr1, order);
    const total = countResult.msg[0].total;
    const totalPages = Math.ceil(total / 25);

    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      total: total,
      socname: "",
      range_name: "",
    };
    // Render the view with data
    res.render("society/modified_list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("society/modified_list", res_dt);
  }
});

SocietyRouter.get("/getmodifiedsuggestions", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    const sugname = req.query.name;
    const range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    if (cntr_auth_type == 1) {
      if (range_id > 0) {
        var datahres = await db_Select(
          "cop_soc_name",
          "md_society",
          `range_code='${range_id}' AND approve_status ='E' AND cop_soc_name LIKE '%${sugname
            .split("'")
            .join("\\'")}%'`,
          null,
        );
      } else {
        var datahres = await db_Select(
          "cop_soc_name",
          "md_society",
          `cop_soc_name LIKE '%${sugname.split("'").join("\\'")}%'`,
          null,
        );
      }
    } else {
      var datahres = await db_Select(
        "cop_soc_name",
        "md_society",
        `cntr_auth_type='${cntr_auth_type}' AND approve_status ='E' AND cop_soc_name LIKE '%${sugname
          .split("'")
          .join("\\'")}%'`,
        null,
      );
    }

    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

SocietyRouter.get("/approve", async (req, res) => {
  try {
    // Extract range_id from session
    const soc_id = req.query.id;
    const range_id = req.session.user.range_id;
    const select = "*";
    const table_name = "md_society";
    const whr = `id='${soc_id}' `;
    const order = null;
    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const typelist = await db_Select("*", "md_society_type", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const regauttypehres = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    const regauthres = await db_Select(
      "*",
      "md_controlling_authority",
      null,
      null,
    );
    const zoneres = await db_Select("*", "md_zone", null, null);
    const distres = await db_Select("*", "md_district", null, null);
    const distcode = result.msg[0].dist_code > 0 ? result.msg[0].dist_code : 0;
    const zone_id = result.msg[0].zone_code > 0 ? result.msg[0].zone_code : 0;
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `dist_id='${distcode}'`,
      null,
    );

    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const ulbres = await db_Select("*", "md_ulb", null, null);
    const managementres = await db_Select(
      "*",
      "md_management_status",
      null,
      null,
    );
    const officertyperes = await db_Select("*", "md_officer_type", null, null);
    const caseflagres = await db_Select("*", "md_case_flag", null, null);
    const wardres = await db_Select("*", "md_ward", null, null);
    const blockres = await db_Select(
      "*",
      "md_block",
      `dist_id='${distcode}'`,
      null,
    );
    const gpres = await db_Select("*", "md_gp", `dist_id='${distcode}'`, null);
    const villres = await db_Select(
      "*",
      "md_village",
      `dist_id='${distcode}'`,
      null,
    );
    const boardmembdtsl = await db_Select(
      "*",
      "td_board_member",
      `soc_id='${soc_id}'`,
      null,
    );
    if (range_id > 0) {
      var devauth_name = await db_Select(
        "*",
        "md_developement_authority",
        `range_id=${range_id}`,
        null,
      );
    } else {
      var devauth_name = await db_Select(
        "*",
        "md_developement_authority",
        null,
        null,
      );
    }

    // Prepare data for rendering
    const res_dt = {
      soc: result.suc > 0 ? result.msg[0] : "",
      soctypelist: typelist.suc > 0 ? typelist.msg : "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      regauthlist: regauthres.suc > 0 ? regauthres.msg : "",
      moment: moment,
      zonelist: zoneres.suc > 0 ? zoneres.msg : "",
      districtlist: distres.suc > 0 ? distres.msg : "",
      ranzelist: ranzeres.suc > 0 ? ranzeres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      ulblist: ulbres.suc > 0 ? ulbres.msg : "",
      managementlist: managementres.suc > 0 ? managementres.msg : "",
      officertypelist: officertyperes.suc > 0 ? officertyperes.msg : "",
      caseflaglist: caseflagres.suc > 0 ? caseflagres.msg : "",
      wardlist: wardres.suc > 0 ? wardres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      gplist: gpres.suc > 0 ? gpres.msg : "",
      villlist: villres.suc > 0 ? villres.msg : "",
      boardmembdlist: boardmembdtsl.suc > 0 ? boardmembdtsl.msg : "",
      devauth_list: devauth_name.suc > 0 ? devauth_name.msg : "",
    };
    // Render the view with data
    res.render("society/approve", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("dashboard/approve", res_dt);
  }
});

SocietyRouter.post("/approve", async (req, res) => {
  try {
    // Extract range_id from session
    var user_id = req.session.user.user_id;
    var date_ob = moment();
    var formdata = req.body;
    // Format it as YYYY-MM-DD HH:mm:ss
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    //   ********   Code For Getting Ip   *********   //
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
    var ip = '';
    
    //   ********   Code For Getting Ip   *********  //

    var data = req.body;
    var table_name = "md_society";
    var values = null;

    var fields = `approve_status='${formdata.status}',return_reason = '${formdata.return_reason}',approve_by='${user_id}',
      approve_dt = '${formattedDate}',approve_ip='${ip}' `;
    var whr = `id = '${data.id}'`;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);

    req.flash("success_msg", "Update successful!");
    res.redirect("/dash/dashboard");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("dashboard/edit", res_dt);
  }
});

// ********  Village Add code
SocietyRouter.get("/managevillage", async (req, res) => {
  try {
    // Extract range_id from session
    const distres = await db_Select("*", "md_district", null, null);
    // Prepare data for rendering
    const res_dt = {
      moment: moment,
      districtlist: distres.suc > 0 ? distres.msg : "",
    };
    // Render the view with data
    res.render("village/manage_village", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
  }
});
SocietyRouter.post("/managevillage", async (req, res) => {
  try {
    // Extract range_id from session
    var data = req.body;
    var dist_id = data.dist_code,
      block = data.block_id,
      gp_id = data.gp_id;
    var whr = ` AND a.dist_id = ${dist_id} AND a.block_id = ${block} AND a.gp_id = ${gp_id} `;
    const villlist = await db_Select(
      "a.vill_id,a.vill_name,b.block_name,c.gp_name",
      `md_village a,md_block b,md_gp c where a.block_id=b.block_id AND a.gp_id =c.gp_id ${whr}`,
      null,
      null,
    );
    const res_dt = {
      villlist: villlist.suc > 0 ? villlist.msg : "",
    };
    // Render the view with data
    res.render("village/list", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
  }
});
SocietyRouter.get("/addvillage", async (req, res) => {
  try {
    // Extract range_id from session
    const distres = await db_Select("*", "md_district", null, null);
    // Prepare data for rendering
    const res_dt = {
      moment: moment,
      districtlist: distres.suc > 0 ? distres.msg : "",
    };
    // Render the view with data
    res.render("village/add", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
  }
});
SocietyRouter.get("/editvillage", async (req, res) => {
  try {
    // Extract range_id from session
    const distres = await db_Select("*", "md_district", null, null);
    const id = req.query.id;
    // Prepare data for rendering
    var whr = ` AND a.vill_id = ${id}`;
    var village = await db_Select(
      "a.vill_id,a.dist_id,a.vill_name,b.block_name,c.gp_name",
      `md_village a,md_block b,md_gp c where a.block_id=b.block_id AND a.gp_id =c.gp_id ${whr}`,
      null,
      null,
    );
    const res_dt = {
      moment: moment,
      districtlist: distres.suc > 0 ? distres.msg : "",
      villag: village.suc > 0 ? village.msg[0] : "",
    };
    // Render the view with data
    res.render("village/edit", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
  }
});
SocietyRouter.post("/editvillage", async (req, res) => {
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
    var table_name = "md_village";
    var values = null;

    var fields = `vill_name='${data.vill_name}',modified_by='${user_id}',
      modified_at = '${formattedDate}',modified_ip='${ip}' `;
    var whr = `vill_id = '${data.vill_id}'`;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);

    req.flash("success_msg", "Update successful!");
    res.redirect("/society/managevillage");
    // Render the view with data
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
  }
});

SocietyRouter.post("/villageadddata", async (req, res) => {
  try {
    var user_id = req.session.user.user_id;
    var date_ob = moment();
    var range_id_ = req.session.user.range_id;
    // Format it as YYYY-MM-DD HH:mm:ss
    var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
    //   ********   Code For Getting Ip   *********   //
    // var ipresult = await fetchIpData();
    // var ip = ipresult.ipdata;
     var ip = '';
    //   ********   Code For Getting Ip   *********  //
    var data = req.body;
    var table_name = "md_village";
    var values = `('${data.dist_code}','${data.block_id}','${data.gp_id}','${data.vill_name}','${user_id}','${formattedDate}','${ip}')`;
    var fields = `(dist_id,block_id,gp_id,vill_name,created_by,created_at,created_ip)`;
    var save_data = await db_Insert(table_name, fields, values, whr, 0);

    var message = `Village ${data.vill_name
      .split("'")
      .join("\\'")} Added by ${user_id}.`;
    var noti_fields = `(type,message,wrk_releated_id,user_type,view_status,range_id,created_by,created_at,created_ip)`;
    var noti_values = `('V','${message}','${save_data.lastId.insertId}','M','1','${range_id_}','${user_id}','${formattedDate}','${ip}')`;
    var sa_data = await db_Insert(
      "td_notification",
      noti_fields,
      noti_values,
      null,
      false,
    );
    if (save_data.suc > 0) {
      console.log("Event is emmititng");
      var notification_dtls = await SendNotification(
        range_id_,
        req.session.user.user_type,
      );
    //  req.io.emit("notification", { message: notification_dtls.msg });
    }
    req.flash("success_msg", "Village Added successful!");
    res.redirect("/dash/dashboard");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
  }
});

SocietyRouter.post("/updatenotiasread", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var values = null;
    var fields = `view_status=0`;
    var whr = `id = '${data.id}'`;
    console.log("check_update");
    console.log(data.id);
    const datahres = await db_Insert("td_notification", fields, values, whr, 1);
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : "", // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = { SocietyRouter };
