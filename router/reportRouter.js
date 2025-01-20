const reportRouter = require("express").Router();
const ExcelJS = require("exceljs");
const { db_Select } = require("../modules/MasterModule");
reportRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});

///  *************  Code for Society Election Result    ****   ////

reportRouter.get("/election_due_req", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    const cntr_auth_type = req.session.user.cntr_auth_type;
    var range_code = range_id;
    var title = "Election Due";
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    var range_name = '';
    if(cntr_auth_type == 1){
      if (range_code > 0) {
        range_name = ranzeres.msg[0].range_name;
      } else {
        range_name = "ALL Range";
      }
    }
    

    const rangeres = await db_Select("*", "md_range", null, null);
    const soctyperes = await db_Select("*", "md_society_type", null, null);
    const controllingauth = await db_Select("*", "md_controlling_authority_type", null, null);
    // Prepare data for rendering
    const res_dt = {
      range_list: rangeres.suc > 0 ? rangeres.msg : "",
      socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
      page: 1,controllingauth:controllingauth.suc > 0 ? controllingauth.msg : "",
      range_name: range_name,
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/election_status_input", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.render("report/election_status_input", res_dt);
  }
});
  reportRouter.post("/election_due", async (req, res) => {
    try {
      // Extract range_id from session
      var postdata = req.body;
      //const range_id = req.session.user.range_id;
      var range_code = postdata.range_id;
      var title = "Election Due";
      var cntr_auth_type =   postdata.controlling_authority_type;
      const select =
        "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      var cntr_auth_type_con = cntr_auth_type > 0 ? ` AND a.cntr_auth_type = '${cntr_auth_type}'` : "";
      if(cntr_auth_type == 1){
          if (range_code > 0) {
            var select_type =
              postdata.soc_type > 0
                ? `AND a.soc_type = '${postdata.soc_type}'`
                : "";
            var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_type} AND a.election_status='DUE' AND a.approve_status = 'A' AND a.cntr_auth_type = "${cntr_auth_type}" AND a.range_code = "${range_code}" `;
          } else {
            var select_range =
              range_code > 0 ? `AND a.range_code = '${range_code}'` : "";
            var select_type =
              postdata.soc_type > 0
                ? `AND a.soc_type = '${postdata.soc_type}'`
                : "";
            var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_range + select_type} AND a.cntr_auth_type = "${cntr_auth_type}" AND a.election_status='DUE' AND a.approve_status = 'A' `;
          }
      }else{
        if (range_code > 0) {
          var select_type =
            postdata.soc_type > 0
              ? `AND a.soc_type = '${postdata.soc_type}'`
              : "";
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_type} AND a.election_status='DUE' AND a.approve_status = 'A' ${cntr_auth_type_con} AND a.dist_code = "${range_code}" `;
        } else {
          var select_range =
            range_code > 0 ? `AND a.dist_code = '${range_code}'` : "";
          var select_type =
            postdata.soc_type > 0
              ? `AND a.soc_type = '${postdata.soc_type}'`
              : "";
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_range + select_type} ${cntr_auth_type_con} AND a.election_status='DUE' AND a.approve_status = 'A' `;
        }
      }
      // Execute database query
      const result = await db_Select(select, table_name, null, null);
      const ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id=${range_code}`,
        null,
      );
      var range_name = '';
      if (range_code > 0) {
        range_name = ranzeres.msg.length > 0 ? ranzeres.msg[0].range_name : '';
      } else {
        range_name = "ALL ";
      }
      if(cntr_auth_type > 0){
        var ctrauthresult = await db_Select("*","md_controlling_authority_type",`controlling_authority_type_id=${cntr_auth_type}`,null);
        var ctrauthresutname = ctrauthresult.msg[0].controlling_authority_type_name;
      }else{
        var ctrauthresutname = "ALL";
      }
      

      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : "",
        page: 1,
        range: postdata.range_id,
        soc_type: postdata.soc_type,cntr_auth_name:ctrauthresutname,
        range_name: range_name,cntr_auth_type:cntr_auth_type,
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/election_result", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render("report/election_result", res_dt);
    }
  });

  reportRouter.get("/election_due_req_dist", async (req, res) => {
    try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      const cntr_auth_type = req.session.user.cntr_auth_type;
      var range_code = range_id;
      var title = "Election Due";
      const ranzeres = await db_Select(
        "*",
        "md_district",
        `dist_code=${range_code}`,
        null,
      );
      var range_name = '';
      if(cntr_auth_type == 1){
        if (range_code > 0) {
          range_name = ranzeres.msg[0].range_name;
        } else {
          range_name = "ALL Range";
        }
      }

      const rangeres = await db_Select("*", "md_district", null, null);
      const soctyperes = await db_Select("*", "md_society_type", null, null);
      var controllingauth = await db_Select("*", "md_controlling_authority_type", null, null);
      // Prepare data for rendering
      const res_dt = {
        range_list: rangeres.suc > 0 ? rangeres.msg : "",
        socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
        page: 1,controllingauth:controllingauth.suc > 0 ? controllingauth.msg : "",
        range_name: range_name,
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/election_status_input_dist", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      res.render("report/election_status_input_dist", res_dt);
    }
  });

  reportRouter.get("/downloadexcel_past", async (req, res) => {
    try {
      var range =
        req.query.range_code > 0
          ? `AND a.range_code=${req.query.range_code} `
          : "";
      var soc_type =
        req.query.soc_type_id > 0
          ? `AND a.soc_type=${req.query.soc_type_id} `
          : "";
      var cntr_auth_type =
        req.query.cntr_auth > 0
          ? `AND a.cntr_auth_type=${req.query.cntr_auth} `
          : "";
      const select =
        "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email,CASE WHEN a.case_id = 1 THEN 'YES' ELSE 'NO' END AS case_status, a.case_num, a.functional_status";
      const table_name = `md_society a 
              LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
              LEFT JOIN md_district c ON a.dist_code = c.dist_code 
              LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
              LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
              LEFT JOIN md_state st ON a.state_code = st.state_id 
              LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id 
              LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_id 
              LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id 
              LEFT JOIN md_block mb ON a.block_id = mb.block_id 
              LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id 
              LEFT JOIN md_village vill ON a.vill_id = vill.vill_id 
              LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id 
              LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id 
              LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
              LEFT JOIN md_range e ON a.range_code = e.range_id 
              LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
      var con = `a.functional_status = 'Functional' AND a.approve_status = 'A' AND a.election_status ='DUE' `;

      const where = `${con + range + soc_type + cntr_auth_type }`; // Ensure these variables are properly defined
      const res_dt = await db_Select(select, table_name, where, null);

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      // Define column headers
      worksheet.columns = [
        { header: "Society Name", key: "cop_soc_name" },
        { header: "Registration No", key: "reg_no" },
        { header: "Registration Date", key: "reg_date" },
        { header: "Society Type", key: "soc_type_name" },
        { header: "Tier Name", key: "soc_tier_name" },
        { header: "Controlling Authority Type", key: "reg_cont_auth" },
        { header: "Returning Officer", key: "returning_officer" },
        { header: "State", key: "state_name" },
        { header: "District", key: "dist_name" },
        { header: "Zone", key: "zone_name" },
        { header: "Range", key: "range_name" },
        { header: "Urban/Rural", key: "urban_rural_flag" },
        { header: "ULB Category", key: "ulb_catg_name" },
        { header: "ULB Name", key: "ulb_name" },
        { header: "Ward", key: "ward_name" },
        { header: "Block", key: "block_name" },
        { header: "Gram Panchayat", key: "gp_name" },
        { header: "Village", key: "vill_name" },
        { header: "PIN No", key: "pin_no" },
        { header: "Address", key: "address" },
        { header: "Management Status", key: "manage_status_name" },
        { header: "Officer Type", key: "officer_type_name" },
        { header: "Number of Members", key: "num_of_memb" },
        { header: "Audit Up To", key: "audit_upto" },
        { header: "Last Election Date", key: "last_elec_date" },
        { header: "Tenure Ends On", key: "tenure_ends_on" },
        { header: "Key Person", key: "key_person" },
        { header: "Designation", key: "key_person_desig" },
        { header: "Contact Number", key: "contact_number" },
        { header: "Email", key: "email" },
        { header: "Case status", key: "case_status" },
        { header: "Case Number", key: "case_num" },
        { header: "Functional Status", key: "functional_status" },
      ];
      var result = res_dt.suc > 0 ? res_dt.msg : "";
      // Add rows to the worksheet
      result.forEach((item) => {
        worksheet.addRow(item);
      });

      // Set response headers for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

      // Write the Excel file to the response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error during Excel generation:", error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the report." });
    }
  });

  
  reportRouter.get("/downloadexcel_upcoming", async (req, res) => {
    try {
      var range = '';
      var soc_type =
        req.query.soc_type_id > 0
          ? ` AND a.soc_type=${req.query.soc_type_id} `
          : "";
      var controlling_authority_type =
          req.query.controlling_authority_type > 0
            ? ` AND a.cntr_auth_type=${req.query.controlling_authority_type} `
            : "";  
      var month_interval = req.query.month_interval > 0 ? req.query.month_interval : 2 ;
      if(req.query.controlling_authority_type == 1 ){
         range =
        req.query.range > 0
          ? ` AND a.range_code=${req.query.range} `
          : "";
      }else if(req.query.controlling_authority_type > 1){
        range =
        req.query.range > 0
          ? ` AND a.dist_code=${req.query.range} `
          : "";
      }
      
                 
      const select =
        "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email,CASE WHEN a.case_id = 1 THEN 'YES' ELSE 'NO' END AS case_status, a.case_num, a.functional_status";
      const table_name = `md_society a 
            LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
            LEFT JOIN md_district c ON a.dist_code = c.dist_code 
            LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
            LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
            LEFT JOIN md_state st ON a.state_code = st.state_id 
            LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id 
            LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_id 
            LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id 
            LEFT JOIN md_block mb ON a.block_id = mb.block_id 
            LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id 
            LEFT JOIN md_village vill ON a.vill_id = vill.vill_id 
            LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id 
            LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id 
            LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
            LEFT JOIN md_range e ON a.range_code = e.range_id 
            LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
      var con = `a.functional_status = 'Functional' AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH)`;

      const where = `${con + range + soc_type + controlling_authority_type}`; // Ensure these variables are properly defined
      const res_dt = await db_Select(select, table_name, where, null);

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      // Define column headers
      worksheet.columns = [
        { header: "Society Name", key: "cop_soc_name" },
        { header: "Registration No", key: "reg_no" },
        { header: "Registration Date", key: "reg_date" },
        { header: "Society Type", key: "soc_type_name" },
        { header: "Tier Name", key: "soc_tier_name" },
        { header: "Controlling Authority Type", key: "reg_cont_auth" },
        { header: "Returning Officer", key: "returning_officer" },
        { header: "State", key: "state_name" },
        { header: "District", key: "dist_name" },
        { header: "Zone", key: "zone_name" },
        { header: "Range", key: "range_name" },
        { header: "Urban/Rural", key: "urban_rural_flag" },
        { header: "ULB Category", key: "ulb_catg_name" },
        { header: "ULB Name", key: "ulb_name" },
        { header: "Ward", key: "ward_name" },
        { header: "Block", key: "block_name" },
        { header: "Gram Panchayat", key: "gp_name" },
        { header: "Village", key: "vill_name" },
        { header: "PIN No", key: "pin_no" },
        { header: "Address", key: "address" },
        { header: "Management Status", key: "manage_status_name" },
        { header: "Officer Type", key: "officer_type_name" },
        { header: "Number of Members", key: "num_of_memb" },
        { header: "Audit Up To", key: "audit_upto" },
        { header: "Last Election Date", key: "last_elec_date" },
        { header: "Tenure Ends On", key: "tenure_ends_on" },
        { header: "Key Person", key: "key_person" },
        { header: "Designation", key: "key_person_desig" },
        { header: "Contact Number", key: "contact_number" },
        { header: "Email", key: "email" },
        { header: "Case status", key: "case_status" },
        { header: "Case Number", key: "case_num" },
        { header: "Functional Status", key: "functional_status" },
      ];
      var result = res_dt.suc > 0 ? res_dt.msg : "";
      // Add rows to the worksheet
      result.forEach((item) => {
        worksheet.addRow(item);
      });

      // Set response headers for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

      // Write the Excel file to the response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error during Excel generation:", error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the report." });
    }
  });
//   **** Code End for Upcoming Election OF Society    ****   //

//   **** Code Start for Urban Rular  OF Society    ****   //
reportRouter.get("/society_ur_req", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var range_code = range_id;
    var title = "Election Upcoming";
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    if (range_code > 0) {
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL Range";
    }
    const rangeres = await db_Select("*", "md_range", null, null);
    if (range_id > 0) {
      const results = await db_Select(
        "*",
        "md_range",
        `range_id = '${range_id}'`,
        null,
      );
      const distcode = results.msg[0].dist_id > 0 ? results.msg[0].dist_id : 0;
      blockres = await db_Select(
        "*",
        "md_block",
        `dist_id='${distcode}'`,
        null,
      );
    } else {
      blockres = await db_Select("*", "md_block", null, null);
    }
    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    // Prepare data for rendering
    const res_dt = {
      range_list: rangeres.suc > 0 ? rangeres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      page: 1,
      range_name: range_name,
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/society_status_ru_input", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.render("report/society_status_ru_input", res_dt);
  }
});
reportRouter.post("/society_ur_result", async (req, res) => {
  try {
    // Extract range_id from session
    var postdata = req.body;
    const range_id = req.session.user.range_id;
    var range_code = postdata.range_id;
    if (postdata.ur_type == "U") {
      var title = "Urban";
    } else if (postdata.ur_type == "R") {
      var title = "Rural";
    } else {
      var title = "ALL";
    }
    var block_id =
      postdata.block_id != 0 ? ` AND a.block_id = '${postdata.block_id}'` : "";
    var ulb_catg =
      postdata.ulb_catg != 0 ? ` AND a.ulb_catg = '${postdata.ulb_catg}'` : "";
    var bl_ulb_con = block_id + ulb_catg;
    const select =
      "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
    if (range_id > 0) {
      var select_type =
        postdata.ur_type != 0
          ? ` AND a.urban_rural_flag = '${postdata.ur_type}'`
          : "";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_type + bl_ulb_con} AND a.range_code = "${range_id}" `;
    } else {
      var select_range =
        range_code > 0 ? `AND a.range_code = '${range_code}'` : "";
      var select_type =
        postdata.ur_type != 0
          ? ` AND a.urban_rural_flag = '${postdata.ur_type}'`
          : "";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_range + select_type + bl_ulb_con}  `;
    }

    // Execute database query
    const result = await db_Select(select, table_name, null, null);
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    // console.log(ranzeres);
    if (range_code > 0) {
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL Range";
    }
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      block_id: postdata.block_id,
      ulb_catg: postdata.ulb_catg,
      page: 1,
      range_name: range_name,
      range: postdata.range_id,
      urban_rural_flag: postdata.ur_type,
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/society_status_ru_result", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("report/society_status_ru_result", res_dt);
  }
});
reportRouter.get("/society_ur_download", async (req, res) => {
  try {
    var range =
      req.query.range_code > 0
        ? ` AND a.range_code=${req.query.range_code} `
        : "";
    var urban_rural_flag =
      req.query.urban_rural_flag != 0
        ? ` AND a.urban_rural_flag= '${req.query.urban_rural_flag}' `
        : "";
    if (req.query.urban_rural_flag == "U") {
      var title = "Urban";
    } else if (req.query.urban_rural_flag == "R") {
      var title = "Rural";
    } else {
      var title = "ALL";
    }
    var block_id =
      req.query.block_id != 0
        ? ` AND a.block_id = '${req.query.block_id}'`
        : "";
    var ulb_catg =
      req.query.ulb_catg != 0
        ? ` AND a.ulb_catg = '${req.query.ulb_catg}'`
        : "";
    var bl_ulb_con = block_id + ulb_catg;
    const select =
      "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email,CASE WHEN a.case_id = 1 THEN 'YES' ELSE 'NO' END AS case_status, a.case_num, a.functional_status";
    const table_name = `md_society a 
          LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
          LEFT JOIN md_district c ON a.dist_code = c.dist_code 
          LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
          LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
          LEFT JOIN md_state st ON a.state_code = st.state_id 
          LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id 
          LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_id 
          LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id 
          LEFT JOIN md_block mb ON a.block_id = mb.block_id 
          LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id 
          LEFT JOIN md_village vill ON a.vill_id = vill.vill_id 
          LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id 
          LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id 
          LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
          LEFT JOIN md_range e ON a.range_code = e.range_id 
          LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
    var con = `a.functional_status = 'Functional' AND a.approve_status = 'A' `;

    const where = `${con + range + bl_ulb_con + urban_rural_flag}`; // Ensure these variables are properly defined
    const res_dt = await db_Select(select, table_name, where, null);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Define column headers
    worksheet.columns = [
      { header: "Society Name", key: "cop_soc_name" },
      { header: "Registration No", key: "reg_no" },
      { header: "Registration Date", key: "reg_date" },
      { header: "Society Type", key: "soc_type_name" },
      { header: "Tier Name", key: "soc_tier_name" },
      { header: "Controlling Authority Type", key: "reg_cont_auth" },
      { header: "Returning Officer", key: "returning_officer" },
      { header: "State", key: "state_name" },
      { header: "District", key: "dist_name" },
      { header: "Zone", key: "zone_name" },
      { header: "Range", key: "range_name" },
      { header: "Urban/Rural", key: "urban_rural_flag" },
      { header: "ULB Category", key: "ulb_catg_name" },
      { header: "ULB Name", key: "ulb_name" },
      { header: "Ward", key: "ward_name" },
      { header: "Block", key: "block_name" },
      { header: "Gram Panchayat", key: "gp_name" },
      { header: "Village", key: "vill_name" },
      { header: "PIN No", key: "pin_no" },
      { header: "Address", key: "address" },
      { header: "Management Status", key: "manage_status_name" },
      { header: "Officer Type", key: "officer_type_name" },
      { header: "Number of Members", key: "num_of_memb" },
      { header: "Audit Up To", key: "audit_upto" },
      { header: "Last Election Date", key: "last_elec_date" },
      { header: "Tenure Ends On", key: "tenure_ends_on" },
      { header: "Key Person", key: "key_person" },
      { header: "Designation", key: "key_person_desig" },
      { header: "Contact Number", key: "contact_number" },
      { header: "Email", key: "email" },
      { header: "Case status", key: "case_status" },
      { header: "Case Number", key: "case_num" },
      { header: "Functional Status", key: "functional_status" },
    ];
    var result = res_dt.suc > 0 ? res_dt.msg : "";
    // Add rows to the worksheet
    result.forEach((item) => {
      worksheet.addRow(item);
    });

    // Set response headers for the Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${title}.xlsx`,
    );

    // Write the Excel file to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error during Excel generation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report." });
  }
});
//   **** Code End for Upcoming Election OF Society    ****   //

//   **** Code Start for Society Election Status  OF Society    ****   //
reportRouter.get("/society_ele_status_req", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var range_code = range_id;
    var title = "Election Upcoming";
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    if (range_code > 0) {
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL Range";
    }
    const rangeres = await db_Select("*", "md_range", null, null);
    // Prepare data for rendering
    const res_dt = {
      range_list: rangeres.suc > 0 ? rangeres.msg : "",
      page: 1,
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/society_ele_status_input", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.render("report/society_ele_status_input", res_dt);
  }
});
reportRouter.post("/society_ele_status_result", async (req, res) => {
  try {
    // Extract range_id from session
    var postdata = req.body;
    var dist_range_name = postdata.dist_range_name;
    var cntr_auth_id = postdata.controlling_authority_type;
    var range_code = postdata.range_id;
    if (postdata.election_status == "ONGOING") {
      var title = "ONGOING";
      var order = "order by a.elec_due_date DESC";
    } else if (postdata.election_status == "DUE") {
      var title = "DUE";
      var order = "";
    } else {
      var title = "DONE";
      var order = "order by a.last_elec_date DESC";
    }
    var cntr_auth = cntr_auth_id > 0 ? `AND a.cntr_auth_type = '${cntr_auth_id}'` : "";
    const select =
      "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
    if (range_code > 0) {
      var election_status = ` AND a.election_status = '${postdata.election_status}'`;
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${election_status + cntr_auth} AND a.range_code = "${range_code}" `;
    } else {
      var select_range =
        range_code > 0 ? `AND a.range_code = '${range_code}'` : "";
      var election_status = ` AND a.election_status = '${postdata.election_status}'`;
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${cntr_auth + select_range + election_status} `;
    }

    // Execute database query
      const result = await db_Select(select, table_name, null, order);
      var range_name = '';
      if(dist_range_name == 'RANGE'){
          const ranzeres = await db_Select(
            "*",
            "md_range",
            `range_id=${range_code}`,
            null,
          );
          if (range_code > 0) {
            range_name = ranzeres.msg[0].range_name;
          } else {
            range_name = "ALL Range";
          }
      }else{
            const ranzeres = await db_Select(
              "*",
              "md_district",
              `dist_code=${range_code}`,
              null,
            );
            if (range_code > 0) {
              range_name = ranzeres.msg[0].dist_name;
            } else {
              range_name = "ALL District";
            }
      }



    var cntr_auth_name = '';
    // getting Conttolling Authority Name For display
    if (cntr_auth_id > 0) {
        const cntrauthres = await db_Select(
          "*",
          "md_controlling_authority_type",
          `controlling_authority_type_id=${cntr_auth_id}`,
          null,
        );
      cntr_auth_name = cntrauthres.msg[0].controlling_authority_type_name;
    } else {
      cntr_auth_name = "ALL";
    }
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      range_name: range_name,
      range: postdata.range_id,ctr_auth_id:cntr_auth_id,
      ele_status: postdata.election_status,cntr_auth_name:cntr_auth_name,
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/society_ele_status_result", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("report/society_ele_status_result", res_dt);
  }
});
reportRouter.get("/society_ele_status_download", async (req, res) => {
  try {
  
    var ctr_auth_id = ` AND a.cntr_auth_type='${req.query.ctr_auth_id}' `;
     if(ctr_auth_id == 1){
      var range =
      req.query.range_code > 0
        ? `AND a.range_code=${req.query.range_code} `
        : "";
     }else{ 
      var range =
      req.query.range_code > 0
        ? `AND a.dist_code=${req.query.range_code} `
        : "";

     }

    
    var election_status = ` AND a.election_status='${req.query.election_status}' `;
    if (req.query.election_status == "ONGOING") {
      var title = "ONGOING";
    } else if (req.query.election_status == "DUE") {
      var title = "DUE";
    } else {
      var title = "DONE";
    }
    const select =
      "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email,CASE WHEN a.case_id = 1 THEN 'YES' ELSE 'NO' END AS case_status, a.case_num, a.functional_status";
    const table_name = `md_society a 
          LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
          LEFT JOIN md_district c ON a.dist_code = c.dist_code 
          LEFT JOIN md_controlling_authority_type h ON a.cntr_auth_type = h.controlling_authority_type_id 
          LEFT JOIN md_controlling_authority g ON a.cntr_auth = g.controlling_authority_id 
          LEFT JOIN md_state st ON a.state_code = st.state_id 
          LEFT JOIN md_ulb_catg ulcat ON a.ulb_catg = ulcat.ulb_catg_id 
          LEFT JOIN md_ulb ulb ON a.ulb_id = ulb.ulb_id
          LEFT JOIN md_ward wa ON a.ward_no = wa.ward_id 
          LEFT JOIN md_block mb ON a.block_id = mb.block_id 
          LEFT JOIN md_gp gp ON a.gp_id = gp.gp_id 
          LEFT JOIN md_village vill ON a.vill_id = vill.vill_id 
          LEFT JOIN md_management_status mms ON a.mgmt_status = mms.manage_status_id 
          LEFT JOIN md_officer_type mot ON a.officer_type = mot.officer_type_id 
          LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
          LEFT JOIN md_range e ON a.range_code = e.range_id 
          LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
    var con = `a.functional_status = 'Functional' AND a.approve_status = 'A'  `;

    const where = `${con + range + election_status + ctr_auth_id }`; // Ensure these variables are properly defined
    const res_dt = await db_Select(select, table_name, where, null);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Define column headers
    worksheet.columns = [
      { header: "Society Name", key: "cop_soc_name" },
      { header: "Registration No", key: "reg_no" },
      { header: "Registration Date", key: "reg_date" },
      { header: "Society Type", key: "soc_type_name" },
      { header: "Tier Name", key: "soc_tier_name" },
      { header: "Controlling Authority Type", key: "reg_cont_auth" },
      { header: "Returning Officer", key: "returning_officer" },
      { header: "State", key: "state_name" },
      { header: "District", key: "dist_name" },
      { header: "Zone", key: "zone_name" },
      { header: "Range", key: "range_name" },
      { header: "Urban/Rural", key: "urban_rural_flag" },
      { header: "ULB Category", key: "ulb_catg_name" },
      { header: "ULB Name", key: "ulb_name" },
      { header: "Ward", key: "ward_name" },
      { header: "Block", key: "block_name" },
      { header: "Gram Panchayat", key: "gp_name" },
      { header: "Village", key: "vill_name" },
      { header: "PIN No", key: "pin_no" },
      { header: "Address", key: "address" },
      { header: "Management Status", key: "manage_status_name" },
      { header: "Officer Type", key: "officer_type_name" },
      { header: "Number of Members", key: "num_of_memb" },
      { header: "Audit Up To", key: "audit_upto" },
      { header: "Last Election Date", key: "last_elec_date" },
      { header: "Tenure Ends On", key: "tenure_ends_on" },
      { header: "Key Person", key: "key_person" },
      { header: "Designation", key: "key_person_desig" },
      { header: "Contact Number", key: "contact_number" },
      { header: "Email", key: "email" },
      { header: "Case status", key: "case_status" },
      { header: "Case Number", key: "case_num" },
      { header: "Functional Status", key: "functional_status" },
    ];
    var result = res_dt.suc > 0 ? res_dt.msg : "";
    // Add rows to the worksheet
    result.forEach((item) => {
      worksheet.addRow(item);
    });

    // Set response headers for the Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report_${title}.xlsx`,
    );

    // Write the Excel file to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error during Excel generation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report." });
  }
});
//   **** Code End for Upcoming Election OF Society    ****   //

//   **** Code start for Upcoming Election OF Society    ****   //
reportRouter.get("/election_upcoming_req", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var range_code = range_id;
    var title = "Election Upcoming";
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    if (range_code > 0) {
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL Range";
    }
    const rangeres = await db_Select("*", "md_range", null, null);
    const soctyperes = await db_Select("*", "md_society_type", null, null);
    const controlling_auth = await db_Select("*", "md_controlling_authority_type", null, null);
    // Prepare data for rendering
    const res_dt = {
      range_list: rangeres.suc > 0 ? rangeres.msg : "",
      socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
      page: 1,
      range_name: range_name,
      socname: "",
      title: title,controllingauth:controlling_auth.suc > 0 ? controlling_auth.msg : "",
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/election_upcoming_input", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.render("report/election_upcoming_input", res_dt);
  }
});
  reportRouter.get("/election_upcoming_dist", async (req, res) => {
    try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var range_code = range_id;
      var title = "Election Upcoming";
      const ranzeres = await db_Select(
        "*",
        "md_district",
        `dist_code=${range_code}`,
        null,
      );
      if (range_code > 0) {
        range_name = ranzeres.msg[0].dist_name;
      } else {
        range_name = "ALL Range";
      }
      const rangeres = await db_Select("*", "md_district", null, null);
      const soctyperes = await db_Select("*", "md_society_type", null, null);
      const controlling_auth = await db_Select("*", "md_controlling_authority_type",`controlling_authority_type_id NOT IN (1)`, null);
      // Prepare data for rendering
      const res_dt = {
        range_list: rangeres.suc > 0 ? rangeres.msg : "",
        socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
        page: 1,
        range_name: range_name,
        socname: "",
        title: title,controllingauth:controlling_auth.suc > 0 ? controlling_auth.msg : "",
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/election_upcoming_input_dist", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      res.render("report/election_upcoming_input_dist", res_dt);
    }
  });
reportRouter.post("/election_upcoming", async (req, res) => {
  try {
    // Extract range_id from session
    var postdata = req.body;
    const range_id = req.session.user.range_id;
    var dist_range_name = postdata.dist_range_name;
    var range_code = postdata.range_id;
    var month_interval = postdata.month_tenure;
    var title_sufix = "";
    if (month_interval == 6) {
      var title_sufix = "Within Six(6) Month";
    } else if (month_interval == 3) {
      var title_sufix = "Within Three(3) Month";
    } else {
      var title_sufix = "";
    }
    var title = "Election Upcoming";
    var controlling_auth_type_con = postdata.controlling_authority_type > 0 ? `AND a.cntr_auth_type = '${postdata.controlling_authority_type}'`: "";
    const select =
      "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
    if(dist_range_name == 'RANGE'){
      if (range_id > 0) {
        var select_type =
          postdata.soc_type > 0
            ? `AND a.soc_type = '${postdata.soc_type}'`
            : "";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_type} AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) AND a.range_code = "${range_id}" ${controlling_auth_type_con}`;
      } else {
        var select_range =
          range_code > 0 ? `AND a.range_code = '${range_code}'` : "";
        var select_type =
          postdata.soc_type > 0 ? `AND a.soc_type = '${postdata.soc_type}'` : "";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${select_range + select_type} AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) ${controlling_auth_type_con}`;
      }
    }else{
      if (range_id > 0) {
        var select_type =
          postdata.soc_type > 0
            ? `AND a.soc_type = '${postdata.soc_type}'`
            : "";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.approve_status = 'A' ${select_type} AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) AND a.dist_code = "${range_id}" ${controlling_auth_type_con}`;
      } else {
        var select_range =
          range_code > 0 ? `AND a.dist_code = '${range_code}'` : "";
        var select_type =
          postdata.soc_type > 0 ? `AND a.soc_type = '${postdata.soc_type}'` : "";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' ${select_range + select_type} AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) ${controlling_auth_type_con}`;
      }
    }
    

    // Execute database query
    const result = await db_Select(select, table_name, null, null);
    var range_name = '';
    if(dist_range_name == 'RANGE'){
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    if (range_code > 0) {
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL Range";
    }
    }else{

      const ranzeres = await db_Select(
        "*",
        "md_district",
        `dist_code=${range_code}`,
        null,
      );
      if (range_code > 0) {
        range_name = ranzeres.msg[0].dist_name;
      } else {
        range_name = "ALL District";
      }

    }
    if(postdata.controlling_authority_type > 0){
      var ctrauthresult = await db_Select("*","md_controlling_authority_type",`controlling_authority_type_id=${postdata.controlling_authority_type}`,null);
      var ctrauthname = ctrauthresult.msg[0].controlling_authority_type_name;
    }else{
      var ctrauthname = '';
    }
   
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      range_name: range_name,
      range: postdata.range_id,month_interval:postdata.month_tenure,cntr_auth_name:ctrauthname,
      soc_type: postdata.soc_type,controlling_authority_type:postdata.controlling_authority_type,
      socname: "",
      title: title,
      soc_data_status: "",
      title_sufix: title_sufix,
    };
    // Render the view with data
    res.render("report/election_result_upcoming", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("report/election_result_upcoming", res_dt);
  }
});

//////  *******     Election result on Range Wise  ********** /////
reportRouter.get("/election_due_reqn", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    var range_code = range_id;
    var title = "Election Due";
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    if (range_code > 0) {
        range_name = ranzeres.msg.length > 0 ? ranzeres.msg[0].range_name : '';
    } else {
      range_name = "ALL Range";
    }
    const rangeres = await db_Select("*", "md_range", null, null);
    var distres = await db_Select("*", "md_district", null, null);
    const soctyperes = await db_Select("*", "md_society_type", null, null);
    var crt_auth_type_res = await db_Select("*", "md_controlling_authority_type", null, null);
    // Prepare data for rendering
    const res_dt = {
      range_list: rangeres.suc > 0 ? rangeres.msg : "",
      socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
      dist_list: distres.suc > 0 ? distres.msg : "",
      page: 1,
      range_name: range_name,
      range_cd: range_code,
      cntr_auth_type: cntr_auth_type,controllingauth:crt_auth_type_res.suc > 0 ? crt_auth_type_res.msg : "",
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/election_status_inputn", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    res.render("report/election_status_inputn", res_dt);
  }
});

reportRouter.post("/election_duen", async (req, res) => {
  try {
    // Extract range_id from session
    var postdata = req.body;
    const range_id = req.session.user.range_id;
    var cntr_auth_type = 1;
    var range_code = postdata.range_id;
    var range_con = "";
    if (range_code > 0) {
      range_con = `and  a.range_code  = ${range_code}`;
    }
    var title = "Election Due";
    const select = `range_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD`;
    var table_name = `( SELECT e.range_name range_name, COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_range e where  a.range_code = e.range_id and  a.functional_status = 'Functional' ${range_con} AND  a.cntr_auth_type  = ${cntr_auth_type} GROUP BY e.range_name
                              UNION
                              SELECT e.range_name range_name,
                                  0 total_available,
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_range e
                              where  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DUE'
                              and  a.approve_status  = 'A'
                              AND  a.cntr_auth_type  = '${cntr_auth_type}'
                              ${range_con}
                              GROUP BY e.range_name
                              UNION
                              SELECT e.range_name range_name,
                                  0 total_available,
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_range e
                              where a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status = 'DUE'
                              and  a.approve_status  = 'A'
                              AND  a.cntr_auth_type  = '${cntr_auth_type}'
                              ${range_con}
                              GROUP BY e.range_name
                              UNION
                              SELECT e.range_name range_name,
                                  0 total_available,
                                  0  DUE,
                                  count(*) ONGOING,
                                  0 DONE
                              FROM md_society a,md_range e
                              where a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'ONGOING'
                              and  a.approve_status  = 'A'
                              AND  a.cntr_auth_type  = '${cntr_auth_type}'
                              ${range_con}
                              GROUP BY e.range_name
                              UNION
                              SELECT e.range_name range_name,
                                  0 total_available,
                                  0  DUE,
                                  0 ONGOING,
                                  count(*) HELD
                              FROM md_society a,md_range e
                              where a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DONE'
                              and  a.approve_status  = 'A'
                              AND  a.cntr_auth_type  = '${cntr_auth_type}'
                              ${range_con}
                              GROUP BY e.range_name
                                  )a
                              group by range_name order by range_name ASC`;

    const result = await db_Select(select, table_name, null, null);

    // console.log(ranzeres);
    if (range_code > 0) {
      const ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id=${range_code}`,
        null,
      );
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL Range";
    }
    var cntr_auth_name = '';
    if (cntr_auth_type > 0) {
      const ranzeres = await db_Select(
        "*",
        "md_controlling_authority_type",
        `controlling_authority_type_id=${cntr_auth_type}`,
        null,
      );
      cntr_auth_name = ranzeres.msg[0].controlling_authority_type_name;
    } else {
      cntr_auth_name = "ALL Range";
    }

    
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      range: postdata.range_id,
      soc_type: postdata.soc_type,range_name: range_name,
      cntr_auth_type:cntr_auth_type,cntr_auth_name:cntr_auth_name,
      socname: "",
      title: title,
      soc_data_status: "",
    };
    // Render the view with data
    res.render("report/election_result_range", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("report/election_result_range", res_dt);
  }
});
reportRouter.get("/dnlexcel_group_by_dist_range", async (req, res) => {
  try {
    var cntr_auth_type = req.query.cntr_auth
    
    var cntr_auth_name ='';
    if (cntr_auth_type > 0) {
      const ranzeres = await db_Select(
        "*",
        "md_controlling_authority_type",
        `controlling_authority_type_id=${cntr_auth_type}`,
        null,
      );
      cntr_auth_name = ranzeres.msg[0].controlling_authority_type_name;
    } else {
      cntr_auth_name = "ALL ";
    }
    if( cntr_auth_type == 1){
            var range_con =
            req.query.range_dist > 0
              ? `AND a.range_code=${req.query.range_dist} `
              : "";
              var select =
            "range_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD";
            var table_name = `( SELECT e.range_name range_name, COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_range e where  a.range_code = e.range_id and  a.functional_status = 'Functional' ${range_con} AND  a.cntr_auth_type  = ${cntr_auth_type} GROUP BY e.range_name
                                        UNION
                                        SELECT e.range_name range_name, 
                                            0 total_available, 
                                            count(*) DUE,
                                            0 ONGOING,
                                            0 DONE
                                        FROM md_society a,md_range e
                                        where  a.range_code = e.range_id
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status  = 'DUE'
                                        and  a.approve_status  = 'A'
                                        AND  a.cntr_auth_type  = ${cntr_auth_type}
                                        ${range_con}
                                        GROUP BY e.range_name
                                        UNION
                                        SELECT e.range_name range_name, 
                                            0 total_available, 
                                            count(*) DUE,
                                            0 ONGOING,
                                            0 DONE
                                        FROM md_society a,md_range e
                                        where a.range_code = e.range_id
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status = 'DUE'
                                        and  a.approve_status  = 'A'
                                        AND  a.cntr_auth_type  = ${cntr_auth_type}
                                        ${range_con}
                                        GROUP BY e.range_name
                                        UNION
                                        SELECT e.range_name range_name, 
                                            0 total_available, 
                                            0  DUE,
                                            count(*) ONGOING,
                                            0 DONE
                                        FROM md_society a,md_range e
                                        where a.range_code = e.range_id
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status  = 'ONGOING'
                                        and  a.approve_status  = 'A'
                                        AND  a.cntr_auth_type  = ${cntr_auth_type}
                                        ${range_con}
                                        GROUP BY e.range_name
                                        UNION
                                        SELECT e.range_name range_name, 
                                            0 total_available, 
                                            0  DUE,
                                            0 ONGOING,
                                            count(*) HELD
                                        FROM md_society a,md_range e
                                        where a.range_code = e.range_id
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status  = 'DONE'
                                        and  a.approve_status  = 'A'
                                        AND  a.cntr_auth_type  = ${cntr_auth_type}
                                        ${range_con}
                                        GROUP BY e.range_name
                                            )a
                                        group by range_name order by range_name ASC`;

                                        
    }else if(cntr_auth_type > 1 ){
      var range_con =
      req.query.range_dist > 0
        ? `AND a.dist_code=${req.query.range_dist} `
        : "";
        var select =
      "dist_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD";
      var table_name = `( SELECT e.dist_name dist_name, COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_district e where  a.dist_code = e.dist_code and  a.functional_status = 'Functional' ${range_con} AND  a.cntr_auth_type  = ${cntr_auth_type} GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    count(*) DUE,
                                    0 ONGOING,
                                    0 DONE
                                FROM md_society a,md_district e
                                where  a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status  = 'DUE'
                                AND  a.cntr_auth_type  = ${cntr_auth_type}
                                ${range_con}
                                GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    count(*) DUE,
                                    0 ONGOING,
                                    0 DONE
                                FROM md_society a,md_district e
                                where a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status = 'DUE'
                                AND  a.cntr_auth_type  = ${cntr_auth_type}
                                ${range_con}
                                GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    0  DUE,
                                    count(*) ONGOING,
                                    0 DONE
                                FROM md_society a,md_district e
                                where a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status  = 'ONGOING'
                                AND  a.cntr_auth_type  = ${cntr_auth_type}
                                ${range_con}
                                GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    0  DUE,
                                    0 ONGOING,
                                    count(*) HELD
                                FROM md_society a,md_district e
                                where a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status  = 'DONE'
                                AND  a.cntr_auth_type  = ${cntr_auth_type}
                                ${range_con}
                                GROUP BY e.dist_name
                                    )a
                                group by dist_name order by dist_name ASC`;
    }
                                
    var res_dt = await db_Select(select, table_name, null, null);

    // Create a new workbook and worksheet
    var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet("Report");

    var result = res_dt.suc > 0 ? res_dt.msg : [];
    
    // Initialize totals
    let tot_tot = 0;
    let tot_due = 0;
    let tot_ongoing = 0;
    let tot_held = 0;
  

    // Define column headers
    worksheet.columns = [
      { header: "Range/District Name", key: "range_name" },
      { header: "Total", key: "total" },
      { header: " Due", key: "DUE" },
      { header: " Ongoing", key: "ONGOING" },
      { header: " Held", key: "HELD" }, // Make sure the key is 'total_held' instead of 'total-total_due'
    ];

    // Add rows to the worksheet
    result.forEach((item) => {
      console.log('Adding row: ', item);
      // Add to the totals
      tot_tot += item.total;
      tot_due += item.DUE;
      tot_ongoing += item.ONGOING;
      tot_held += item.HELD; // Calculate the held value as total - total_due

      // Add the row to the worksheet
      worksheet.addRow({
        range_name: item.range_name,
        total: item.total,
        DUE: item.DUE,
        ONGOING: item.ONGOING,
        HELD: item.HELD, // Dynamically calculated
      });
    });

    // Add a final row for the totals
    worksheet.addRow({
      range_name: "Total",
      total: tot_tot,
      DUE: tot_due,
      ONGOING: tot_ongoing,
      HELD: tot_held,
    });
    var cntr_auth_name1 = cntr_auth_name.replace(/ /g, "_").replace(/-/g, "_").replace(/,/g, "_");
    // Set response headers for the Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${cntr_auth_name1} rangetype_report.xlsx`
    );

    // Write the Excel file to the response
    await workbook.xlsx.write(res);
    res.end();
      // try {
      //   await workbook.xlsx.write(res);
      //   res.end();
      // } catch (err) {
      //   console.error("Error writing to response:", err);
      //   res.status(500).json({ error: "Failed to generate Excel file." });
      // }
  } catch (error) {
    console.error("Error during Excel generation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report." });
  }
});
reportRouter.get("/dnlexcel_group_by_dist", async (req, res) => {
  try {
    var cntr_auth_type = req.query.cntr_auth
    // console.log(cntr_auth_type);
    var cntr_auth_name = '';
    if (cntr_auth_type > 0) {
      const ranzeres = await db_Select(
        "*",
        "md_controlling_authority_type",
        `controlling_authority_type_id=${cntr_auth_type}`,
        null,
      );
      cntr_auth_name = ranzeres.msg[0].controlling_authority_type_name;
    } else {
      cntr_auth_name = "ALL";
    }
    
            var range_con =
            req.query.range_dist > 0
              ? `AND a.dist_code=${req.query.range_dist} `
              : "";
        var cntr_auth_con = cntr_auth_type > 0 ? `AND a.cntr_auth_type = ${cntr_auth_type}` : "";      
              var select =
            "dist_name as range_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD";
            var table_name = `( SELECT e.dist_name , COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_district e where  a.dist_code = e.dist_code and  a.functional_status = 'Functional' ${range_con} ${cntr_auth_con} GROUP BY e.dist_name
                                        UNION
                                        SELECT e.dist_name dist_name, 
                                            0 total_available, 
                                            count(*) DUE,
                                            0 ONGOING,
                                            0 DONE
                                        FROM md_society a,md_district e
                                        where  a.dist_code = e.dist_code
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status  = 'DUE'
                                        and  a.approve_status  = 'A'
                                        ${cntr_auth_con}
                                        ${range_con}
                                        GROUP BY e.dist_name
                                        UNION
                                        SELECT e.dist_name dist_name, 
                                            0 total_available, 
                                            count(*) DUE,
                                            0 ONGOING,
                                            0 DONE
                                        FROM md_society a,md_district e
                                        where a.dist_code = e.dist_code
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status = 'DUE'
                                        and  a.approve_status  = 'A'
                                        ${cntr_auth_con}
                                        ${range_con}
                                        GROUP BY e.dist_name
                                        UNION
                                        SELECT e.dist_name dist_name, 
                                            0 total_available, 
                                            0  DUE,
                                            count(*) ONGOING,
                                            0 DONE
                                        FROM md_society a,md_district e
                                        where a.dist_code = e.dist_code
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status  = 'ONGOING'
                                        and  a.approve_status  = 'A'
                                        ${cntr_auth_con}
                                        ${range_con}
                                        GROUP BY e.dist_name
                                        UNION
                                        SELECT e.dist_name dist_name, 
                                            0 total_available, 
                                            0  DUE,
                                            0 ONGOING,
                                            count(*) HELD
                                        FROM md_society a,md_district e
                                        where a.dist_code = e.dist_code
                                        and  a.functional_status = 'Functional'
                                        and  a.election_status  = 'DONE'
                                        and  a.approve_status  = 'A'
                                        ${cntr_auth_con}
                                        ${range_con}
                                        GROUP BY e.dist_name
                                            )a
                                        group by dist_name order by dist_name ASC`;
  
                                        
     var res_dt = await db_Select(select, table_name, null, null);

     var workbook = new ExcelJS.Workbook();
    var worksheet = workbook.addWorksheet("Report");

    var result = res_dt.suc > 0 ? res_dt.msg : [];
    
    // Initialize totals
    let tot_tot = 0;
    let tot_due = 0;
    let tot_ongoing = 0;
    let tot_held = 0;
  

    // Define column headers
    worksheet.columns = [
      { header: "Range/District Name", key: "range_name" },
      { header: "Total", key: "total" },
      { header: " Due", key: "DUE" },
      { header: " Ongoing", key: "ONGOING" },
      { header: " Held", key: "HELD" }, // Make sure the key is 'total_held' instead of 'total-total_due'
    ];

    // Add rows to the worksheet
    result.forEach((item) => {
      // Add to the totals
      tot_tot += item.total;
      tot_due += item.DUE;
      tot_ongoing += item.ONGOING;
      tot_held += item.HELD; // Calculate the held value as total - total_due

      // Add the row to the worksheet
      worksheet.addRow({
        range_name: item.range_name,
        total: item.total,
        DUE: item.DUE,
        ONGOING: item.ONGOING,
        HELD: item.HELD, // Dynamically calculated
      });
    });

    // Add a final row for the totals
    worksheet.addRow({
      range_name: "Total",
      total: tot_tot,
      DUE: tot_due,
      ONGOING: tot_ongoing,
      HELD: tot_held,
    });
     
    var cntr_auth_name1 = cntr_auth_name.replace(/ /g, "_").replace(/-/g, "_").replace(/,/g, "_");
  
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename= ${cntr_auth_name1}_report.xlsx`
    );

    // Write the Excel file to the response
    await workbook.xlsx.write(res);
    res.end();
     
  } catch (error) {
    console.error("Error during Excel generation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the report." });
  }
});


   ///  ********** Report District Wise  ****************   //    

  reportRouter.get("/election_due_reqnd", async (req, res) => {
    try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var cntr_auth_type = req.session.user.cntr_auth_type;
      var range_code = range_id;
      var title = "Election Due";
      const ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id=${range_code}`,
        null,
      );
      if (range_code > 0) {
          range_name = ranzeres.msg.length > 0 ? ranzeres.msg[0].range_name : '';
      } else {
        range_name = "ALL Range";
      }
      const rangeres = await db_Select("*", "md_range", null, null);
      var distres = await db_Select("*", "md_district", null, null);
      const soctyperes = await db_Select("*", "md_society_type", null, null);
      const crtauthlist = await db_Select("*", "md_controlling_authority_type", null, null);
      // Prepare data for rendering
      const res_dt = {
        range_list: rangeres.suc > 0 ? rangeres.msg : "",
        socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
        dist_list: distres.suc > 0 ? distres.msg : "",
        page: 1,
        range_name: range_name,
        range_cd: range_code,crtauthlists:crtauthlist.suc > 0 ? crtauthlist.msg : "",
        cntr_auth_type: cntr_auth_type,
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/districtwise/election_status_inputn", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      res.render("report/districtwise/election_status_inputn", res_dt);
    }
  });
   
  reportRouter.post("/election_duend", async (req, res) => {
    try {
      // Extract range_id from session
      var postdata = req.body;
      const range_id = req.session.user.range_id;
      var cntr_auth_type = postdata.cntr_auth_type;
      var range_code = postdata.range_id;
      var range_con = "";
      var cntr_auth_type_con = "";
      if (range_code > 0) {
        range_con = `and  a.dist_code  = ${range_code}`;
      }
      if (cntr_auth_type > 0) {
        cntr_auth_type_con = `and  a.cntr_auth_type  = ${range_code}`;
      }
      var title = "Election Due";
      const select = `dist_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD`;
      var table_name = `( SELECT e.dist_name dist_name, COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_district e where  a.dist_code = e.dist_code and  a.functional_status = 'Functional' ${range_con} ${cntr_auth_type_con} GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    count(*) DUE,
                                    0 ONGOING,
                                    0 DONE
                                FROM md_society a,md_district e
                                where  a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status  = 'DUE'
                                and  a.approve_status  = 'A'
                                ${cntr_auth_type_con}
                                ${range_con}
                                GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    count(*) DUE,
                                    0 ONGOING,
                                    0 DONE
                                FROM md_society a,md_district e
                                where a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status = 'DUE'
                                and  a.approve_status  = 'A'
                                ${cntr_auth_type_con}
                                ${range_con}
                                GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    0  DUE,
                                    count(*) ONGOING,
                                    0 DONE
                                FROM md_society a,md_district e
                                where a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status  = 'ONGOING'
                                and  a.approve_status  = 'A'
                                ${cntr_auth_type_con}
                                ${range_con}
                                GROUP BY e.dist_name
                                UNION
                                SELECT e.dist_name dist_name,
                                    0 total_available,
                                    0  DUE,
                                    0 ONGOING,
                                    count(*) HELD
                                FROM md_society a,md_district e
                                where a.dist_code = e.dist_code
                                and  a.functional_status = 'Functional'
                                and  a.election_status  = 'DONE'
                                and  a.approve_status  = 'A'
                                ${cntr_auth_type_con}
                                ${range_con}
                                GROUP BY e.dist_name
                                    )a
                                group by dist_name order by dist_name ASC`;
  
     
      const result = await db_Select(select, table_name, null, null);
  
      // console.log(ranzeres);
      if (range_code > 0) {
        const ranzeres = await db_Select(
          "*",
          "md_district",
          `dist_code=${range_code}`,
          null,
        );
        range_name = ranzeres.msg[0].range_name;
      } else {
        range_name = "ALL Range";
      }
      var cntr_auth_name = '';
    if (cntr_auth_type > 0) {
      const ranzeres = await db_Select(
        "*",
        "md_controlling_authority_type",
        `controlling_authority_type_id=${cntr_auth_type}`,
        null,
      );
      cntr_auth_name = ranzeres.msg[0].controlling_authority_type_name;
    } else {
      cntr_auth_name = "ALL Range";
    }
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : "",
        page: 1,
        range: postdata.range_id,
        soc_type: postdata.soc_type,
        range_name: range_name,
        cntr_auth_type:cntr_auth_type,cntr_auth_name:cntr_auth_name,
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/districtwise/election_result_district", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render("report/districtwise/election_result_district", res_dt);
    }
  });

  reportRouter.get("/ele_soctype_input_rangewise", async (req, res) => {
    try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var range_code = range_id;
      var title = "Election Due";
      const ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id=${range_code}`,
        null,
      );
      if (range_code > 0) {
        range_name = ranzeres.msg[0].range_name;
      } else {
        range_name = "ALL Range";
      }
      const rangeres = await db_Select("*", "md_range", null, null);
      const soctyperes = await db_Select("*", "md_society_type", null, null);
      const controllingauth = await db_Select("*", "md_controlling_authority_type", null, null);
      // Prepare data for rendering
      const res_dt = {
        range_list: rangeres.suc > 0 ? rangeres.msg : "",
        socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
        page: 1,
        range_name: range_name,
        range_cd: range_code,controllingauth:controllingauth.suc > 0 ? controllingauth.msg : "",
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/soctype/election_input", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      res.render("report/soctype/election_input", res_dt);
    }
  });
  reportRouter.post("/ele_soctype_output_rangewise", async (req, res) => {
    try {
      // Extract range_id from session
      var postdata = req.body;
      const range_id = req.session.user.range_id;
      var cntr_auth_type = 1;
      var range_code = postdata.range_id;
      var title = "Election Due";
      // Execute database query
      if(range_id == 0) {
        var range_con =
        range_code > 0 ? `AND a.range_code=${range_code} ` : "";
      }else{
        var range_con =`AND a.range_code=${range_code} `;
      }
      var soc_type_id = postdata.soc_type > 0 ? `AND a.soc_type=${postdata.soc_type} ` : "";
      
      const select =
        "soc_type_id,soc_type_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD";
      const table_name = `(SELECT b.soc_type_id soc_type_id,b.soc_type_name soc_type_name,COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_society_type b,md_range e where a.soc_type = b.soc_type_id and  a.range_code = e.range_id and  a.functional_status = 'Functional' ${range_con} AND a.cntr_auth_type  = ${cntr_auth_type}  ${soc_type_id} GROUP BY b.soc_type_id,b.soc_type_name 
                                  UNION SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DUE'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              AND a.cntr_auth_type  = ${cntr_auth_type}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status = 'DUE'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              AND a.cntr_auth_type  = ${cntr_auth_type}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  0  DUE,
                                  count(*) ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'ONGOING'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              AND a.cntr_auth_type  = ${cntr_auth_type}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  0  DUE,
                                  0 ONGOING,
                                  count(*) HELD
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DONE'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              AND a.cntr_auth_type  = ${cntr_auth_type}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                                  )a
                              group by soc_type_id,soc_type_name
                              order by soc_type_id`;
      const result = await db_Select(select, table_name, null, null);
      const ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id=${range_code}`,
        null,
      );
      // console.log(ranzeres);
      if (range_code > 0) {
        range_name = ranzeres.msg[0].range_name;
      } else {
        range_name = "ALL Range";
      }

        const crtaurh = await db_Select(
          "*",
          "md_controlling_authority_type",
          `controlling_authority_type_id=1`,
          null,
        );
        var cntr_auth_name = crtaurh.msg[0].controlling_authority_type_name;
      
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : "",
        page: 1,
        range: postdata.range_id,
        soc_type: postdata.soc_type,cntr_auth_name:cntr_auth_name,
        range_name: range_name,
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/soctype/election_result", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render("report/soctype/election_result", res_dt);
    }
  });
  reportRouter.get("/ele_soctype_input_districtwise", async (req, res) => {
    try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var ctrauth_type = req.session.user.cntr_auth_type;
      var range_code = range_id;
      var title = "Election Due";
      const ranzeres = await db_Select(
        "dist_name as range_name",
        "md_district",
        `dist_code=${range_code}`,
        null,
      );
      if (range_code > 0) {
        range_name = ranzeres.msg[0].range_name;
      } else {
        range_name = "ALL Range";
      }
      const rangeres = await db_Select("*", "md_district", null, null);
      const soctyperes = await db_Select("*", "md_society_type", null, null);
      var crtauthlist = await db_Select("*", "md_controlling_authority_type", null, null);
      // Prepare data for rendering
      var res_dt = {
        range_list: rangeres.suc > 0 ? rangeres.msg : "",
        socty_list: soctyperes.suc > 0 ? soctyperes.msg : "",
        range_name: range_name,
        range_cd: range_code,
        socname: "",ctrauth_type:ctrauth_type,
        title: title,crtauthlists:crtauthlist.suc > 0 ? crtauthlist.msg : "",
      };
      // Render the view with data
      res.render("report/soctype_districtwise/election_input", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      res.render("report/soctype_districtwise/election_input", res_dt);
    }
  });
  reportRouter.post("/ele_soctype_output_districtwise", async (req, res) => {
    try {
      // Extract range_id from session
      var postdata = req.body;
      const range_id = req.session.user.range_id;
      const ctrauth_type_id = req.session.user.range_id;
      var cntr_auth_type = postdata.cntr_auth_type;
      var range_code = postdata.range_id;
      var title = "Election Due";
      // Execute database query
      if(range_id == 0) {
        var range_con =
        range_code > 0 ? `AND a.dist_code=${range_code} ` : "";
      }else{
        var range_con =`AND a.dist_code=${range_code} `;
      }
      var soc_type_id = postdata.soc_type > 0 ? `AND a.soc_type=${postdata.soc_type} ` : "";
      var cntr_auth_con =cntr_auth_type > 0 ? `AND a.cntr_auth_type=${cntr_auth_type} `: "";
      const select =
        "soc_type_id,soc_type_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD";
      const table_name = `(SELECT b.soc_type_id soc_type_id,b.soc_type_name soc_type_name,COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_society_type b,md_range e where a.soc_type = b.soc_type_id and  a.range_code = e.range_id and  a.functional_status = 'Functional' ${range_con} ${cntr_auth_con}  ${soc_type_id} GROUP BY b.soc_type_id,b.soc_type_name 
                                  UNION SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DUE'
                              and a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status = 'DUE'
                               and a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  0  DUE,
                                  count(*) ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'ONGOING'
                               and a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  0  DUE,
                                  0 ONGOING,
                                  count(*) HELD
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DONE'
                              and a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                                  )a
                              group by soc_type_id,soc_type_name
                              order by soc_type_id`;
      const result = await db_Select(select, table_name, null, null);
      const ranzeres = await db_Select(
        "*",
        "md_district",
        `dist_code=${range_code}`,
        null,
      );

      const cntr_auth_res = await db_Select(
        "*",
        "md_controlling_authority_type",
        `controlling_authority_type_id=${postdata.cntr_auth_type}`,
        null,
      );
      // console.log(ranzeres);
      if (range_code > 0) {
        range_name = ranzeres.msg[0].range_name;
      } else {
        range_name = "ALL District";
      }
      var controlling_authority_type_name = '';
      if (postdata.cntr_auth_type > 0) {
        controlling_authority_type_name = cntr_auth_res.msg[0].controlling_authority_type_name;
      }else{
        controlling_authority_type_name = "ALL";
      }
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : "",
        page: 1,
        range: postdata.range_id,
        soc_type: postdata.soc_type,cntr_auth_name:controlling_authority_type_name,
        range_name: range_name,cntr_auth_type:cntr_auth_type,
        socname: "",
        title: title,
        soc_data_status: "",
      };
      // Render the view with data
      res.render("report/soctype_districtwise/election_result", res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error("Error during dashboard rendering:", error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render("report/soctype_districtwise/election_result", res_dt);
    }
  });
  reportRouter.get("/dnlexcel_soctype", async (req, res) => {
    try {
    
        var cntr_auth_con =
        req.query.cntr_auth_type > 0 ? `AND a.cntr_auth_type=${req.query.cntr_auth_type} ` : "";
        var soc_type_id =
        req.query.soc_type > 0 ? `AND a.soc_type=${req.query.soc_type_id} ` : "";
        if(req.query.cntr_auth_type == 1){
          var range_con =
          req.query.range > 0 ? `AND a.range_code=${req.query.range} ` : "";
        }else{
          var range_con =
          req.query.range > 0 ? `AND a.dist_code=${req.query.range} ` : "";
        }
        

        const select =
        "soc_type_id,soc_type_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD";
      const table_name = `(SELECT b.soc_type_id soc_type_id,b.soc_type_name soc_type_name,COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_society_type b,md_range e where a.soc_type = b.soc_type_id and  a.range_code = e.range_id and  a.functional_status = 'Functional' ${range_con} ${cntr_auth_con}  ${soc_type_id} GROUP BY b.soc_type_id,b.soc_type_name 
                                  UNION SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DUE'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  count(*) DUE,
                                  0 ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status = 'DUE'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  0  DUE,
                                  count(*) ONGOING,
                                  0 DONE
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'ONGOING'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                              UNION
                              SELECT b.soc_type_id soc_type_id,
                                    b.soc_type_name soc_type_name,
                                  0 total_available, 
                                  0  DUE,
                                  0 ONGOING,
                                  count(*) HELD
                              FROM md_society a,md_society_type b,md_range e
                              where a.soc_type = b.soc_type_id
                              and  a.range_code = e.range_id
                              and  a.functional_status = 'Functional'
                              and  a.election_status  = 'DONE'
                              and  a.approve_status  = 'A'
                              ${range_con}
                              ${cntr_auth_con}
                              ${soc_type_id}
                              GROUP BY b.soc_type_id,b.soc_type_name
                                  )a
                              group by soc_type_id,soc_type_name
                              order by soc_type_id`;
      const res_dt = await db_Select(select, table_name, null, null);
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");
  
      // Define column headers
      // Define column headers
      worksheet.columns = [
        { header: "Society Type", key: "soc_type_name" },
        { header: "Total", key: "total" },
        { header: "Election Due", key: "DUE" },
        { header: "Election Ongoing", key: "ONGOING" },
        { header: "Election Held", key: "HELD" }, // Make sure the key is 'total_held' instead of 'total-total_due'
      ];
  
      var result = res_dt.suc > 0 ? res_dt.msg : [];
      // Initialize totals
      let tot_tot = 0;
      let tot_due = 0;
      let tot_ongoing = 0;
      let tot_held = 0;
  
      // Add rows to the worksheet
      result.forEach((item) => {
        // Add to the totals
        tot_tot += item.total;
        tot_due += item.DUE;
        tot_ongoing += item.ONGOING;
        tot_held += item.HELD; // Calculate the held value as total - total_due
  
        // Add the row to the worksheet
        worksheet.addRow({
          soc_type_name: item.soc_type_name,
          total: item.total,
          DUE: item.DUE,
          ONGOING: item.ONGOING,
          HELD: item.HELD, // Dynamically calculated
        });
      });
  
      // Add a final row for the totals
      worksheet.addRow({
        range_name: "Total",
        total: tot_tot,
        DUE: tot_due,
        ONGOING: tot_ongoing,
        HELD: tot_held,
      });
      var range_names ='';
      if(req.query.cntr_auth_type == 1){
      if (req.query.range > 0) {
        const ranzeres = await db_Select(
          "*",
          "md_range",
          `range_id=${req.query.range}`,
          null,
        );
        range_names = ranzeres.msg[0].range_name;
      } else {
        range_names = "ALL Range";
      }
     }else{
        const ranzeres = await db_Select(
          "*",
          "md_district",
          `dist_code=${req.query.range}`,
          null,
        );
        if(req.query.range > 0){
        range_names = ranzeres.msg[0].dist_name;
        }else{
          range_names = 'ALL District';
        }
     }
      // Set response headers for the Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=soctype_report_${range_names}.xlsx`,
      );
  
      // Write the Excel file to the response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error during Excel generation:", error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the report." });
    }
  });

module.exports = { reportRouter };
