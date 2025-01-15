const DashboardnRouter = require("express").Router();
const ExcelJS = require("exceljs");
const requestIp = require("request-ip");
const { db_Select, db_Insert } = require("../modules/MasterModule");
DashboardnRouter.use((req, res, next) => {
  var user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
});

DashboardnRouter.get("/dashboard", async (req, res) => {
  try {
    // Extract range_id from session
    var range_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    if(req.session.user.user_type == 'S'){
        var select =
          "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.approve_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name,g.controlling_authority_type_name";
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id WHERE a.functional_status='Functional' order by g.controlling_authority_type_name DESC LIMIT 25`;
        whr = "";
        var order = null;
        whr1 = `functional_status='Functional' `;
        var distres = await db_Select("*", "md_district", null, null);
    }else{
        if(cntr_auth_type == 1){
              var select =
              "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.approve_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name,g.controlling_authority_type_name";
            if (range_id > 0) {
              var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id WHERE a.functional_status='Functional' AND (a.cntr_auth_type = "${cntr_auth_type}" OR a.cntr_auth_type = 0) AND a.range_code = "${range_id}" order by g.controlling_authority_type_name DESC LIMIT 25`;
            } else {
              var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id WHERE a.functional_status='Functional' order by g.controlling_authority_type_name DESC LIMIT 25`;
            }
            whr = "";
            var order = null;
            if (range_id > 0) {
              whr1 = `functional_status='Functional' AND (cntr_auth_type = "${cntr_auth_type}" OR cntr_auth_type = 0) AND range_code='${range_id}'`;
            } else {
              whr1 = `functional_status='Functional' `;
            }
            var distres = await db_Select("*", "md_district", null, null);
        }else{

            if(req.session.user.user_type == 'A'){
              var select =
              "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.approve_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name,g.controlling_authority_type_name";
              var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id WHERE a.functional_status='Functional' AND (a.cntr_auth_type = "${cntr_auth_type}" OR a.cntr_auth_type = 0) order by g.controlling_authority_type_name DESC LIMIT 25`;
            whr = "";
            var order = null;
            whr1 = `functional_status='Functional' AND (cntr_auth_type = "${cntr_auth_type}" OR cntr_auth_type = 0) `;
            var distres = await db_Select("*", "md_district",  null, null);
            }else{

              var select =
              "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.approve_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name,g.controlling_authority_type_name";
            
              var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id WHERE a.functional_status='Functional' AND (a.cntr_auth_type = "${cntr_auth_type}" OR a.cntr_auth_type = 0) AND a.dist_code = "${range_id}" order by g.controlling_authority_type_name DESC LIMIT 25`;
            whr = "";
            var order = null;
            whr1 = `functional_status='Functional' AND (cntr_auth_type = "${cntr_auth_type}" OR cntr_auth_type = 0) AND dist_code = "${range_id}"`;
            var distres = await db_Select("*", "md_district",  `dist_code = '${range_id}'`, null);
            }
        } 
    }
   ///   in case when user is of head office
    if(req.session.user.user_type == 'A'){
      if(cntr_auth_type > 1){
        var distres = await db_Select("*", "md_district",  null, null);
      }
    }
    
   
    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const select2 = "COUNT(*) as total";
    const countResult = await db_Select(select2, "md_society", whr1, order);
    const total = countResult.msg[0].total;
    const totalPages = Math.ceil(total / 25);
    if(req.session.user.user_type == 'S'){
        var regauttypehres = await db_Select(
          "*",
          "md_controlling_authority_type",
          null,
          null,
        );
    }else{
        var regauttypehres = await db_Select(
          "*",
          "md_controlling_authority_type",
          `controlling_authority_type_id = '${cntr_auth_type}'`,
          null,
        );
    }
    
    const zoneres = await db_Select("*", "md_zone", null, null);
    const ranzeres = await db_Select("*", "md_range", null, null);
    console.log(cntr_auth_type,range_id);
    var blockres;
    if (range_id > 0) {
      const results = await db_Select(
        "*",
        "md_range",
        `range_id = '${range_id}'`,
        null,
      );
      const distcode = results.msg.length > 0 ? results.msg[0].dist_id : 0;
      if(cntr_auth_type == 1 ){
          blockres = await db_Select(
            "*",
            "md_block",
            `dist_id='${distcode}'`,
            null,
          );
      }else{
        blockres = await db_Select(
          "*",
          "md_block",
          `dist_id='${range_id}'`,
          null,
        );
      }
      
    } else {
      blockres = await db_Select("*", "md_block", `dist_id='0'`, null);
    }
    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const soctietype = await db_Select("*", "md_society_type", null, null);
    
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      totalPages: totalPages,
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      ranzelist: ranzeres.suc > 0 ? ranzeres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      soctietypelist: soctietype.suc > 0 ? soctietype.msg : "",
      zonereslist: zoneres.suc > 0 ? zoneres.msg : "",
      distlist: distres.suc > 0 ? distres.msg : "",
      cntr_auth_type: 0,
      zone_code: 0,
      dist_code: 0,
      soc_tier: 0,
      soc_type_id: 0,
      range_code: range_id,
      urban_rural_flag: 0,
      ulb_catg: 0,
      block_id: 0,
      total: total,
      socname: "",
      functional_status: "1",
      soc_data_status: "",
      range_name: "",
    };

    res.render("dashboard/landing", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("dashboard/landing", res_dt);
  }
});
DashboardnRouter.post("/dashboard", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var cntr_auth = req.session.user.cntr_auth_type;
    var range_or_dist = cntr_auth > 1 ? 'dist_code':'range_code';
    // if (range_id == 0) {
    //   const user_type = 1;
    // } else {
    //   const user_type = 2;
    // }
    var formdata = req.body;
    const select =
      "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.approve_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name,g.controlling_authority_type_name";
    var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id`;
  
    if(range_id > 0){
      var con1 =`AND (cntr_auth_type = "${cntr_auth}" OR cntr_auth_type = 0) `;
    }else{
      var con1 = formdata.cntr_auth_type > 0
        ? `AND a.cntr_auth_type=${formdata.cntr_auth_type} `
        : "";
    }
    
    var con2 =
      formdata.range_code > 0 ? `AND a.${range_or_dist}=${formdata.range_code} ` : "";

    var con3;
    if (formdata.urban_rural_flag == "U") {
      con3 = `AND a.urban_rural_flag='U' `;
    } else if (formdata.urban_rural_flag == "R") {
      con3 = `AND a.urban_rural_flag='R' `;
    } else {
      con3 = "";
    }

    if (formdata.urban_rural_flag == "R") {
      var con4 =
        formdata.block_id > 0 ? `AND a.block_id=${formdata.block_id} ` : "";
    } else {
      var con4 = "";
    }

    if (formdata.urban_rural_flag == "U") {
      var con5 =
        formdata.ulb_catg > 0 ? `AND a.ulb_catg='${formdata.ulb_catg}' ` : "";
    } else {
      var con5 = "";
    }

    var con6 =
      formdata.soc_tier > 0 ? `AND a.soc_tier=${formdata.soc_tier} ` : "";
    var con7 =
      formdata.soc_type_id > 0 ? `AND a.soc_type=${formdata.soc_type_id} ` : "";

    if (formdata.socname && formdata.socname.trim() !== "") {
      var con8 = `AND a.cop_soc_name LIKE '%${formdata.socname.split("'").join("\\'")}%' `;
    } else {
      var con8 = "";
    }

    var con9 =
      formdata.zone_code > 0 ? `AND a.zone_code=${formdata.zone_code} ` : "";
    if (formdata && formdata.dist_code) {
      var con10 =
        formdata.dist_code > 0
          ? `AND a.dist_code='${formdata.dist_code}' `
          : "";
    } else {
      var con10 = "";
    }
    let soc_data_status = "";

    if (
      formdata.soc_data_status == "A" ||
      formdata.soc_data_status == "U" ||
      formdata.soc_data_status == "E" || formdata.soc_data_status == "R"
    ) {
      soc_data_status = `AND a.approve_status='${formdata.soc_data_status}'`;
    }

    var maincon =
      con1 +
      con2 +
      con3 +
      con4 +
      con5 +
      con6 +
      con7 +
      con8 +
      con9 +
      con10 +
      soc_data_status;
    if (range_id > 0) {
      var whr = ` a.${range_or_dist}='${range_id}' ${maincon} order by g.controlling_authority_type_name DESC LIMIT 25`;
    } else {
      var whr = `1 ${maincon} LIMIT 25`;
    }
    const order = null;
   
      console.log(maincon);
      console.log('czCZCzxczccxzcc');
    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const select2 = "COUNT(*) as total";
    const countResult = await db_Select(select2, table_name, whr, order);
    const total = countResult.msg[0].total;
    const totalPages = Math.ceil(total / 25);
    const regauttypehres = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    if (range_id > 0) {
      var ranzeres = await db_Select(
        "*",
        "md_range",
        `range_id='${range_id}'`,
        null,
      );
    } else {
      var ranzeres = await db_Select("*", "md_range", null, null);
    }
    const results = await db_Select("*", "md_range", null, null);
    var blockres;
    if (range_id > 0) {
      const distcode =
        ranzeres.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
      if(cntr_auth == 1 ){
          blockres = await db_Select(
            "*",
            "md_block",
            `dist_id='${distcode}'`,
            null,
          );
      }else{
        blockres = await db_Select(
          "*",
          "md_block",
          `dist_id='${range_id}'`,
          null,
        );
      }
    } else {
      blockres = await db_Select("*", "md_block", null, null);
    }
    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const zoneres = await db_Select("*", "md_zone", null, null);
    const distres = await db_Select("*", "md_district", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const soctietype = await db_Select("*", "md_society_type", null, null);
    var urban_rural_flag; // Declare the variable first

    if (formdata.urban_rural_flag === "U") {
      urban_rural_flag = "U";
    } else if (formdata.urban_rural_flag === "R") {
      urban_rural_flag = "R";
    } else {
      urban_rural_flag = 0;
    }
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      totalPages: totalPages,
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      ranzelist: ranzeres.suc > 0 ? ranzeres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      zonereslist: zoneres.suc > 0 ? zoneres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      distlist: distres.suc > 0 ? distres.msg : "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      soctietypelist: soctietype.suc > 0 ? soctietype.msg : "",
      cntr_auth_type: formdata.cntr_auth_type > 0 ? formdata.cntr_auth_type : 0,
      zone_code: formdata.zone_code > 0 ? formdata.zone_code : 0,
      range_code: formdata.range_code > 0 ? formdata.range_code : 0,
      dist_code: formdata.dist_code > 0 ? formdata.dist_code : 0,
      soc_type_id: formdata.soc_type_id > 0 ? formdata.soc_type_id : 0,
      soc_tier: formdata.soc_tier > 0 ? formdata.soc_tier : 0,
      urban_rural_flag,
      functional_status: "0",
      soc_data_status: formdata.soc_data_status,
      ulb_catg: formdata.ulb_catg > 0 ? formdata.ulb_catg : 0,
      range_name: "",
      block_id: formdata.block_id > 0 ? formdata.block_id : 0,
      total: total,
      socname: formdata.socname.trim(),
    };

    // Render the view with data
     res.render("dashboard/landing", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("dashboard/landing", res_dt);
  }
});

DashboardnRouter.get("/socLimitList", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 25;
  const offset = (page - 1) * limit;
  var cntr_auth_type = req.session.user.cntr_auth_type;
  var range_or_dist = cntr_auth_type > 1 ? 'dist_code' : 'range_code';
  
  var dist_code =
    req.query.dist_code > 0 ? ` AND a.dist_code=${req.query.dist_code} ` : "";
  var zone_code =
    req.query.zone_code > 0 ? ` AND a.zone_code=${req.query.zone_code} ` : "";
  if(req.session.user.user_type == 'S'){
        var range_code = '';
        var con1 =``;
  }else {
    if(cntr_auth_type == 1){
      var range_code =
        req.query.range_code > 0 ? ` AND a.range_code=${req.query.range_code} ` : "";
        var con1 =
        cntr_auth_type > 0
          ? `AND (a.cntr_auth_type=${cntr_auth_type} OR a.cntr_auth_type = 0)`
          : "";
      }else{
        var range_code = '';
        var con1 =`AND (a.cntr_auth_type=${cntr_auth_type} OR a.cntr_auth_type = 0)`
      }
  }
  
  var con6 =
    req.query.soc_tier > 0 ? `AND a.soc_tier=${req.query.soc_tier} ` : "";
  var con4 =
    req.query.urban_rural_flag > 0
      ? `AND a.urban_rural_flag=${req.query.urban_rural_flag} `
      : "";
  var con7 =
    req.query.soc_type_id > 0 ? `AND a.soc_type=${req.query.soc_type_id}` : "";
  var soc_data_status =
    req.query.soc_data_status.length > 0
      ? `AND a.approve_status= '${req.query.soc_data_status}' `
      : "";

  var functional_status =
    req.query.functional_status != ""
      ? ` AND a.functional_status='${req.query.functional_status}'`
      : "";
  var maincon =
    con1 +
    dist_code +
    zone_code +
    range_code +
    con4 +
    con6 +
    con7 +
    functional_status +
    soc_data_status;
  const range_id = req.session.user.range_id;
  const select =
    "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.approve_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name,g.controlling_authority_type_name";
  var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LEFT JOIN md_controlling_authority_type g ON a.cntr_auth_type = g.controlling_authority_type_id`;
    if(req.session.user.user_type == 'S'){
      var whr = `1 ${maincon} order by g.controlling_authority_type_name DESC LIMIT ${offset} , ${limit}`;
    }else{
      if(cntr_auth_type == 1){
        if (range_id > 0) {
          var whr = `1 AND a.range_code='${range_id}' ${maincon} order by g.controlling_authority_type_name DESC LIMIT ${offset} , ${limit}`;
        } else {
          var whr = `1 ${maincon} LIMIT ${offset} , ${limit}`;
        }
      }else{
        if(req.session.user.user_type == 'A'){
          var whr = `1 ${maincon} order by g.controlling_authority_type_name DESC LIMIT ${offset} , ${limit}`;
        }else{
          var whr = `1 AND a.dist_code='${range_id}' ${maincon} order by g.controlling_authority_type_name DESC LIMIT ${offset} , ${limit}`;
        }
      }
    }

  const order = null;
  const select2 = "COUNT(*) as total";
    if(req.session.user.user_type == 'S'){
        var countResult = await db_Select(
          select2,
          table_name,
          `1 ${maincon}`,
          order,
        );
    }else{
          if(cntr_auth_type == 1){
              if (range_id > 0) {
                var countResult = await db_Select(
                  select2,
                  table_name,
                  `a.range_code='${range_id}' ${maincon}`,
                  order,
                );
              } else {
                var countResult = await db_Select(
                  select2,
                  table_name,
                  `1 ${maincon}`,
                  order,
                );
              }
          }else{
            if(req.session.user.user_type == 'A'){
            var countResult = await db_Select(
              select2,
              table_name,
              `1 ${maincon}`,
              order,
            );
            }else{
              var countResult = await db_Select(
                select2,
                table_name,
                `a.dist_code='${range_id}' ${maincon}`,
                order,
              );
            }
          }
    }

  const total = countResult.msg[0].total;
  const totalPages = Math.ceil(total / limit);
  // Execute database query
  const result = await db_Select(select, table_name, whr, order);
  res.json({
    data: result.suc > 0 ? result.msg : "",
    page,
    totalPages: totalPages,
    total: total,
  });
});

DashboardnRouter.get("/dash", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    const user_type = req.session.user.user_type;
    if(user_type == 'S'){
      var cntr_auth_type = 1;
    }else{
      var cntr_auth_type = req.session.user.cntr_auth_type;
    }
    
    const select =
      "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.tenure_ends_on,a.elec_due_date,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
    if (range_id > 0) {
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" LIMIT 25`;
      var table_list_for_onemonth_before = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) `;
      var soc_list_over_election = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" AND a.tenure_ends_on < CURDATE()  `;
    } else {
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' LIMIT 25`;
      var table_list_for_onemonth_before = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) `;
      var soc_list_over_election = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on < CURDATE() `;
    }
    whr = "";
    const order = null;
    if (range_id > 0) {
      whr1 = `functional_status='Functional' AND range_code='${range_id}'`;
    } else {
      whr1 = `functional_status='Functional' `;
    }
    var onemonthduereport = await db_Select(
      "COUNT(*) as  onemnth",
      table_list_for_onemonth_before,
      whr,
      order,
    );
    var overelection = await db_Select(
      "COUNT(*) as  overele",
      soc_list_over_election,
      whr,
      order,
    );
    // Execute database query

    const result = await db_Select(select, table_name, whr, order);
    const select2 = "COUNT(*) as total";
    const countResult = await db_Select(select2, "md_society", whr1, order);
    const total = countResult.msg[0].total;
    const totalPages = Math.ceil(total / 25);
    var regauttypehres = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    const zoneres = await db_Select("*", "md_zone", null, null);
    const ranzeres = await db_Select(
      "*",
      "md_range",
      null,
      "order by range_name",
    );
    var blockres;
    if (range_id > 0) {
      const results = await db_Select(
        "*",
        "md_range",
        `range_id = '${range_id}'`,
        null,
      );
      console.log(results);
      const distcode = results.msg.length > 0 ? results.msg[0].dist_id : 0;
      blockres = await db_Select(
        "*",
        "md_block",
        `dist_id='${distcode}'`,
        null,
      );
    } else {
      blockres = await db_Select("*", "md_block", `dist_id='0'`, null);
    }
    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const soctietype = await db_Select("*", "md_society_type", null, null);
    const distres = await db_Select("*", "md_district", null, null);
    const ctrauthlist = await db_Select("*", "md_controlling_authority_type", null, null);
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      totalPages: totalPages,
      onemondue: onemonthduereport.suc > 0 ? onemonthduereport.msg[0] : "",
      overelect: overelection.suc > 0 ? overelection.msg[0] : "",
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      ranzelist: ranzeres.suc > 0 ? ranzeres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      soctietypelist: soctietype.suc > 0 ? soctietype.msg : "",
      zonereslist: zoneres.suc > 0 ? zoneres.msg : "",
      distlist: distres.suc > 0 ? distres.msg : "",
      cntr_auth_type: cntr_auth_type,
      zone_code: 0,
      dist_code: 0,
      soc_tier: 0,
      soc_type_id: 0,
      range_code: 0,
      urban_rural_flag: 0,
      ulb_catg: 0,
      block_id: 0,
      total: total,
      socname: "",
      functional_status: "1",
      soc_data_status: "",
      ctrauth: ctrauthlist.suc > 0 ? ctrauthlist.msg:""
    };

    // Render the view with data
    if(user_type == 'S' || user_type == 'A'){
       res.render("dashboard/dashboard_hosuper", res_dt);
    }else{
       res.render("dashboard/dashboard_roaro", res_dt);
    }
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    if(user_type == 'S' || user_type == 'A'){
      res.render("dashboard/dashboard_hosuper", res_dt);
    }else{
        res.render("dashboard/dashboard_roaro", res_dt);
    }
  }
});


DashboardnRouter.post("/get_society_tot", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var select = `SUM(CASE WHEN a.functional_status = 'Functional' THEN 1 ELSE 0 END) AS func_tot, SUM(CASE WHEN a.functional_status = 'Under Liquidation' THEN 1 ELSE 0 END) AS liquidation_tot, SUM(CASE WHEN a.functional_status = 'Non-Functional / Dormant' THEN 1 ELSE 0 END) AS non_functional`,
      table_name = `md_society a`,
      order = null;
      var con1 = '';
      if(data.rangedist == 'DIST'){
        var range_dist = 'dist_code';
      }else{
        var range_dist = 'range_code';
      }
      
     if(data.range_code > 0){
       con1 = data.cntr_auth_id > 0 ? ` AND a.cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
     }else{
       con1 = data.cntr_auth_id > 0 ? ` a.cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
     }
     var where = data.range_code > 0 ? `a.${range_dist} ='${data.range_code}'` : ``;
      
    var res_dt = await db_Select(select, table_name, where + con1, order);
    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : "", // Echoing the received claims
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
DashboardnRouter.post("/get_society_modified_data", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var select = `SUM(CASE WHEN a.approve_status = 'A' THEN 1 ELSE 0 END) AS appr_tot, SUM(CASE WHEN a.approve_status = 'E' THEN 1 ELSE 0 END) AS edited_tot, SUM(CASE WHEN (a.approve_status = 'U' OR a.approve_status = 'R')THEN 1 ELSE 0 END) AS unapproved`,
      table_name = `md_society a`,
      order = null;
      var con1 = '';
      if(data.range_code > 0){
        con1 = data.cntr_auth_id > 0 ? ` AND a.cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
      }else{
        con1 = data.cntr_auth_id > 0 ? ` AND a.cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
      }

      if(data.rangedist == 'RANGE'){
        var where = data.range_code > 0 ? `AND a.range_code ='${data.range_code}'` : ``;
      }else {
        var where = data.range_code > 0 ? `AND a.dist_code ='${data.range_code}'` : ``;
      }
      var con = `a.functional_status = 'Functional'`;
    var res_dt = await db_Select(select, table_name, con+where+con1, order);
    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : "", // Echoing the received claims
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
DashboardnRouter.post("/get_election_status", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var con1 = data.cntr_auth_id > 0 ? ` AND cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
    
    if(data.rangedist == 'DIST'){
       var range_dist = 'dist_code';
    }else{
      var range_dist = 'range_code';
    }
    
    var select = `SUM(CASE WHEN election_status = 'DUE' THEN 1 ELSE 0 END) AS due_tot,SUM(CASE WHEN election_status = 'ONGOING' THEN 1 ELSE 0 END) AS ongoing_tot, SUM(CASE WHEN election_status = 'DONE' THEN 1 ELSE 0 END) AS done_tot`,
      table_name = `md_society`,
      where =
        data.range_code > 0
          ? `functional_status = 'Functional' AND approve_status = 'A' AND ${range_dist} ='${data.range_code}'`
          : `functional_status = 'Functional' AND approve_status = 'A' `,
      order = null;
    var res_dt = await db_Select(select, table_name, where+con1, order);
    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : "", // Echoing the received claims
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
///  *************  Code for Society Election Result    ****   ////
DashboardnRouter.get("/societyelection", async (req, res) => {
  try {
    // Extract range_id from session
    const range_id = req.session.user.range_id;
    var range_code = req.query.range_code;

    const select =
      "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
    if (range_id > 0) {
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.election_status ='ONGOING' AND a.range_code = "${range_id}" LIMIT 25`;
    } else {
      var confor_range =
        range_code > 0 ? `AND a.range_code = '${range_code}'` : "";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.election_status ='ONGOING' ${confor_range} LIMIT 25`;
    }
    whr = "";
    const order = null;
    if (range_id > 0) {
      whr1 = `election_status ='ONGOING' AND functional_status='Functional' AND range_code='${range_id}'`;
    } else {
      var confor_range =
        range_code > 0 ? `AND a.range_code = '${range_code}'` : "";
      whr1 = `election_status ='ONGOING' AND functional_status='Functional' ${confor_range}`;
    }

    // Execute database query
    const result = await db_Select(select, table_name, whr, order);
    const select2 = "COUNT(*) as total";
    const countResult = await db_Select(select2, "md_society", whr1, order);
    const total = countResult.msg[0].total;
    const totalPages = Math.ceil(total / 25);
    var regauttypehres = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    const zoneres = await db_Select("*", "md_zone", null, null);
    const ranzeres = await db_Select(
      "*",
      "md_range",
      `range_id=${range_code}`,
      null,
    );
    console.log(ranzeres);
    if (range_code > 0) {
      range_name = ranzeres.msg[0].range_name;
    } else {
      range_name = "ALL";
    }
    var blockres;
    blockres = await db_Select("*", "md_block", `dist_id='0'`, null);

    const ulbcatgres = await db_Select("*", "md_ulb_catg", null, null);
    const soctierres = await db_Select("*", "md_soc_tier", null, null);
    const soctietype = await db_Select("*", "md_society_type", null, null);
    const distres = await db_Select("*", "md_district", null, null);
    // Prepare data for rendering
    const res_dt = {
      data: result.suc > 0 ? result.msg : "",
      page: 1,
      totalPages: totalPages,
      confor_range: range_code,
      range_name: range_name,
      regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : "",
      blocklist: blockres.suc > 0 ? blockres.msg : "",
      ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : "",
      soctierlist: soctierres.suc > 0 ? soctierres.msg : "",
      soctietypelist: soctietype.suc > 0 ? soctietype.msg : "",
      zonereslist: zoneres.suc > 0 ? zoneres.msg : "",
      distlist: distres.suc > 0 ? distres.msg : "",
      cntr_auth_type: 0,
      zone_code: 0,
      dist_code: 0,
      soc_tier: 0,
      soc_type_id: 0,
      range_code: 0,
      urban_rural_flag: 0,
      ulb_catg: 0,
      block_id: 0,
      total: total,
      socname: "",
      functional_status: "1",
      soc_data_status: "",
    };
    // Render the view with data
    res.render("dashboard/election_result", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
    //res.status(500).send('An error occurred while loading the dashboard.');
    res.render("dashboard/election_result", res_dt);
  }
});

DashboardnRouter.get("/socLimitListfor_election_status", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 25;
  const offset = (page - 1) * limit;

  var con1 =
    req.query.cntr_auth_type > 0
      ? `AND a.cntr_auth_type=${req.query.cntr_auth_type} `
      : "";
  var dist_code =
    req.query.dist_code > 0 ? `AND a.dist_code=${req.query.dist_code} ` : "";
  var zone_code =
    req.query.zone_code > 0 ? `AND a.zone_code=${req.query.zone_code} ` : "";
  var range_code =
    req.query.range_code > 0 ? `AND a.range_code=${req.query.range_code} ` : "";
  var con6 =
    req.query.soc_tier > 0 ? `AND a.soc_tier=${req.query.soc_tier} ` : "";
  var con4 =
    req.query.urban_rural_flag > 0
      ? `AND a.urban_rural_flag=${req.query.urban_rural_flag} `
      : "";
  var con7 =
    req.query.soc_type_id > 0 ? `AND a.soc_type=${req.query.soc_type_id}` : "";
  var soc_data_status =
    req.query.soc_data_status > 0
      ? `AND a.approve_status='${req.query.soc_data_status}' `
      : "";

  var functional_status = ` AND a.functional_status='Functional'`;
  var election_status = ` AND a.election_status='${req.query.election_status}'`;
  var maincon =
    con1 +
    dist_code +
    zone_code +
    range_code +
    con4 +
    con6 +
    con7 +
    functional_status +
    soc_data_status +
    election_status;
  console.log(maincon);
  const range_id = req.session.user.range_id;
  const select =
    "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
  var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
  if (range_id > 0) {
    var whr = `a.functional_status='Functional' AND a.range_code='${range_id}' ${maincon} LIMIT ${offset} , ${limit}`;
  } else {
    var whr = `a.functional_status='Functional' ${maincon} LIMIT ${offset} , ${limit}`;
  }

  const order = null;

  const select2 = "COUNT(*) as total";
  if (range_id > 0) {
    var countResult = await db_Select(
      select2,
      table_name,
      `a.range_code='${range_id}' ${maincon}`,
      order,
    );
  } else {
    var countResult = await db_Select(
      select2,
      table_name,
      `1 ${maincon}`,
      order,
    );
  }

  const total = countResult.msg[0].total;
  const totalPages = Math.ceil(total / limit);
  // Execute database query
  const result = await db_Select(select, table_name, whr, order);
  res.json({
    data: result.suc > 0 ? result.msg : "",
    page,
    totalPages: totalPages,
    total: total,
  });
});

DashboardnRouter.post("/get_soctype_detail", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var soc_con = "";
    
    var con1 = data.cntr_auth_id > 0 ? ` AND a.cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
    var con2 = '';
    var division_name = ''
    var ctrauthname = '';
    if(data.cntr_auth_id > 0){
      var countResult = await db_Select('controlling_authority_type_name','md_controlling_authority_type',`controlling_authority_type_id='${data.cntr_auth_id}'`,null);
      ctrauthname = countResult.msg[0].controlling_authority_type_name;
    }else{
      ctrauthname = ' ALL Controlling Authority';
    }

    if(data.rangedist == 'RANGE'){
       con2 = data.range_code > 0 ? `AND a.range_code = '${data.range_code}'` :  ``;
       if (data.range_code > 0) {
        var countResult = await db_Select('range_name','md_range',`range_id='${data.range_code}'`,null);
        division_name = countResult.msg[0].range_name;
      }else
      {
        division_name = 'ALL Range';
      }
    }else {
       con2 = data.range_code > 0 ? `AND a.dist_code = '${data.range_code}'` :  ``;
       if (data.range_code > 0) {
        var countResult = await db_Select('dist_name','md_district',`dist_code='${data.range_code}'`,null);
        division_name = countResult.msg[0].dist_name + ' District';
      }else
      {
        division_name = 'ALL District';
      }
    }
    
    var title = "Election Due";
    const select = `soc_type_id,soc_type_name,sum(total_available)total,sum(DUE)DUE,sum(ONGOING)ONGOING,sum(DONE)HELD`;
    var table_name = `(SELECT b.soc_type_id soc_type_id,b.soc_type_name soc_type_name,COUNT(*) AS total_available, 0 DUE,0 ONGOING,0 DONE FROM md_society a,md_society_type b,md_range e where a.soc_type = b.soc_type_id and  a.range_code = e.range_id and  a.functional_status = 'Functional' ${soc_con} ${con1} ${con2} GROUP BY b.soc_type_id,b.soc_type_name 
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
                        ${soc_con} ${con1} ${con2}
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
                        ${soc_con} ${con1} ${con2}
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
                        ${soc_con} ${con1} ${con2}
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
                        ${soc_con} ${con1} ${con2}
                        GROUP BY b.soc_type_id,b.soc_type_name
                            )a
                        group by soc_type_id,soc_type_name
                        order by soc_type_id`;
    const soctyperes = await db_Select(select, table_name, null, null);
    const responseData = {
      soctype: soctyperes.suc > 0 ? soctyperes.msg : "",division_name:division_name,ctrauthname:ctrauthname // Echoing the received claims
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

DashboardnRouter.post("/get_rular_urban", async (req, res) => {
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var con1 = data.cntr_auth_id > 0 ? `AND a.cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
    var con1s = data.cntr_auth_id > 0 ? `AND cntr_auth_type = '${data.cntr_auth_id}'` :  ``;
     //data.rangedist == 'RANGE'
    var range_dist = data.rangedist == 'DIST' ? 'dist_code':'range_code';

    var select = `SUM(CASE WHEN urban_rural_flag = 'U' THEN 1 ELSE 0 END) AS urban_tot,SUM(CASE WHEN urban_rural_flag = 'R' THEN 1 ELSE 0 END) AS rular_tot,SUM(CASE WHEN urban_rural_flag = 'D' THEN 1 ELSE 0 END) AS devauth_tot`,
      table_name = `md_society`,
      where =
        data.range_code > 0
          ? `functional_status = 'Functional' AND ${range_dist} ='${data.range_code}'`
          : `functional_status = 'Functional'`,
      order = null;
    var res_dt = await db_Select(select, table_name, where + con1s, order);
   

    const select_election = "count(*) as month_before";

    var range_code = data.range_code;
    if (range_code > 0) {
      var table_name6 = `md_society a WHERE a.functional_status='Functional' AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 6 MONTH) AND a.${range_dist} = "${range_code}" ${con1}`;
      var table_name3 = `md_society a WHERE a.functional_status='Functional' AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 3 MONTH) AND a.${range_dist} = "${range_code}" ${con1}`;
    } else {
      var select_range =
        range_code > 0 ? `AND a.${range_dist} = '${range_code}'` : "";
      var table_name6 = `md_society a WHERE a.functional_status='Functional' ${select_range} ${con1} AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 6 MONTH) `;
      var table_name3 = `md_society a WHERE a.functional_status='Functional' ${select_range} ${con1} AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 3 MONTH) `;
    }
    var res_dt6 = await db_Select(select_election, table_name6, null, null);
    var res_dt3 = await db_Select(select_election, table_name3, null, null);

    var select_ele = `SUM(CASE WHEN election_status = 'DUE' THEN 1 ELSE 0 END) AS due_tot,SUM(CASE WHEN election_status = 'ONGOING' THEN 1 ELSE 0 END) AS ongoing_tot, SUM(CASE WHEN election_status = 'DONE' THEN 1 ELSE 0 END) AS done_tot`,
      where_ele =
        data.range_code > 0
          ? `functional_status = 'Functional' AND approve_status = 'A' AND ${range_dist} ='${data.range_code}'`
          : `functional_status = 'Functional' AND approve_status = 'A' `;
    var res_dt_ele = await db_Select(select_ele, `md_society`, where_ele +con1s, null);

    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : "",
      six_month_data: res_dt6.suc > 0 ? res_dt6.msg[0] : "",
      three_month_data: res_dt3.suc > 0 ? res_dt3.msg[0] : "",
      election_result_data: res_dt_ele.suc > 0 ? res_dt_ele.msg[0] : "", // Echoing the received claims
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

DashboardnRouter.get("/society_download", async (req, res) => {
  try {
    var range_id = req.session.user.range_id;
    var cntr_auth_ty = req.session.user.cntr_auth_type;
    var zone_code = "";
    var range_code_for_name = 0;
     var range_or_dist = cntr_auth_ty > 1 ? 'dist_code':'range_code';
    if (range_id > 0) {
      range_code_for_name = req.session.user.range_id;
      var range =
        range_id > 0 ? `AND a.${range_or_dist}=${req.session.user.range_id} ` : "";
    } else {
      range_code_for_name = req.query.range_code > 0 ? req.query.range_code : 0;
      var range =
        req.query.range_code > 0
          ? `AND a.${range_or_dist}=${req.query.range_code} `
          : "";
      zone_code =
        req.query.zone_code > 0
          ? `AND a.zone_code=${req.query.zone_code} `
          : "";
    }
    if(cntr_auth_ty > 1){
      var cntr_auth_type = `AND (a.cntr_auth_type=${cntr_auth_ty} OR a.cntr_auth_type=0)`;
    }else{
      if (range_id > 0) {
        var cntr_auth_type = `AND (a.cntr_auth_type=${cntr_auth_ty} OR a.cntr_auth_type=0)`;
      }else{
        var cntr_auth_type =
        req.query.cntr_auth_type > 0
          ? `AND a.cntr_auth_type=${req.query.cntr_auth_type} `
          : "";
      }
    }
    
    // var dist_code = req.query.dist_code > 0 ? `AND a.dist_code=${req.query.dist_code} ` : '';

    var soc_tier =
      req.query.soc_tier > 0 ? `AND a.soc_tier=${req.query.soc_tier} ` : "";
    var urban_rural_flag =
      req.query.urban_rural_flag > 0
        ? `AND a.urban_rural_flag=${req.query.urban_rural_flag} `
        : "";
    var soc_type_id =
      req.query.soc_type_id > 0
        ? `AND a.soc_type=${req.query.soc_type_id}`
        : "";
    if (req.query.soc_data_status) {
      var soc_data_status =
        req.query.soc_data_status.length > 0
          ? `AND a.approve_status= '${req.query.soc_data_status}' `
          : "";
    } else {
      var soc_data_status = "";
    }
    if (req.query.functional_status) {
      var functional_status =
        req.query.functional_status.length > 0
          ? `AND a.functional_status= '${req.query.functional_status}' `
          : "";
    } else {
      var functional_status = "";
    }

    const select =
      "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email, a.case_id, a.case_num, a.functional_status";
    const table_name = `md_society a 
          LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id 
          LEFT JOIN md_district c ON a.dist_code = c.dist_code 
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
          LEFT JOIN md_zone d ON a.zone_code = d.zone_id 
          LEFT JOIN md_range e ON a.range_code = e.range_id 
          LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
    var con = `a.functional_status = 'Functional' `;

    const where = `${con + range + cntr_auth_type + zone_code + soc_tier + urban_rural_flag + soc_type_id + soc_data_status + functional_status}`; // Ensure these variables are properly defined
    const res_dt = await db_Select(select, table_name, where, null);
    if(cntr_auth_ty > 1 ){
      var res_dt_range = await db_Select(
        "range_name",
        "md_range",
        `range_id = '${range_code_for_name}' `,
        null,
      );
    }else{
      var res_dt_range = await db_Select(
        "dist_name as range_name",
        "md_district",
        `dist_code = '${range_code_for_name}' `,
        null,
      );
    }
    
    var range_name = res_dt_range.msg[0].range_name;
    console.log(res_dt_range);
    //}
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
      { header: "Case ID", key: "case_id" },
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
      `attachment; filename=society_list_of${range_name}.xlsx`,
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

DashboardnRouter.post(
  "/get_society_election_due_monthwise",
  async (req, res) => {
    try {
      // Extract query parameter 'claims'
      var data = req.body;
      //var ctr_auth_type = req.session.user.cntr_auth_type;
      var ctr_auth_type = data.cntr_auth_id;
      var rangedist = data.rangedist;
       if(rangedist == 'DIST' ){
        var range_dist = 'dist_code';
       }else{
        var range_dist = 'range_code';
       }
      var month_interval = data.month_interval;
      const select = "count(*) as month_before";
      var range_code = data.range_code;
      var select_crtauth =
      ctr_auth_type > 0 ? ` AND a.cntr_auth_type = '${ctr_auth_type}'` : "";
      if (range_code > 0) {
        var table_name = `md_society a WHERE a.functional_status='Functional' AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) AND a.${range_dist} = "${range_code}" ${select_crtauth}`;
      } else {
        var select_range =
          range_code > 0 ? `AND a.${range_dist} = '${range_code}'` : "";
        var table_name = `md_society a WHERE a.functional_status='Functional' ${select_range} ${select_crtauth} AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) `;
      }
      var res_dt = await db_Select(select, table_name, null, null);
      const responseData = {
        soctot: res_dt.suc > 0 ? res_dt.msg[0] : "", // Echoing the received claims
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
  },
);
DashboardnRouter.get("/editprofile", async (req, res) => {
  var user = req.session.user;
  try {
    var range_dist_id = req.session.user.range_id;
    var cntr_auth_type = req.session.user.cntr_auth_type;
    var distlist = await db_Select("*", "md_district", null, null);
    var cnt_type = await db_Select(
      "*",
      "md_controlling_authority_type",
      null,
      null,
    );
    var ranze = await db_Select("*", "md_range", null, null);
    var userres = await db_Select(
      "*",
      "md_user",
      `user_id='${user.user_id}'`,
      null,
    );
    const res_dt = {
      data: ranze.suc > 0 ? ranze.msg : "",distl : distlist.suc > 0 ? distlist.msg : "",
      cnt_type:cnt_type.suc > 0 ? cnt_type.msg : "",
      usersd: userres.suc > 0 ? userres.msg[0] : "",cntr_auth_type:cntr_auth_type,range_dist:range_dist_id
    };
    res.render("user/profile", res_dt);
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});
DashboardnRouter.post("/editprofile", async (req, res) => {
  var user = req.session.user;
  var data = req.body;
  try {
    var fields = `user_name = '${data.user_name}',designation='${data.designation}',user_email='${data.user_email}'`;
    var whr = `id = '${data.id}' AND user_id = '${user.user_id}'`;
    var save_data = await db_Insert("md_user", fields, null, whr, 1);
    req.flash("success_msg", "Updated successful!");
    res.redirect("/dash/editprofile");
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error during dashboard rendering:", error);
  }
});

module.exports = { DashboardnRouter };
