const DashboardRouter = require('express').Router()
const ExcelJS = require('exceljs');
const {db_Select} = require('../modules/MasterModule');
DashboardRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
});
DashboardRouter.get('/dashboard', async(req, res) => {
    try {
        // Extract range_id from session
        const range_id = req.session.user.range_id;
      //  const suc_msg = req.flash('success_msg') ;
        const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        if(range_id > 0){ 
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" LIMIT 25`;
         }else{
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' LIMIT 25`;
         }
        whr = '';
        const order = null;
        if(range_id > 0){
            whr1 = `functional_status='Functional' AND range_code='${range_id}'`;
        }else{
          whr1 =`functional_status='Functional' `;
        }
       
        // Execute database query
        const result = await db_Select(select, table_name, whr, order);
        const select2 = "COUNT(*) as total";
        const countResult = await db_Select(select2, 'md_society', whr1, order);
        const total = countResult.msg[0].total;
        const totalPages = Math.ceil(total / 25);
        var regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
        const zoneres = await db_Select('*', 'md_zone', null, null);
        const ranzeres = await db_Select('*', 'md_range', null, null);
        var blockres ;
        if(range_id > 0){
          const results = await db_Select('*', 'md_range', `range_id = '${range_id}'`, null);
          const distcode = results.msg[0].dist_id > 0 ? results.msg[0].dist_id : 0;
           blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
        }else{
           blockres = await db_Select('*', 'md_block',  `dist_id='0'`, null);
        }
        const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
        const soctierres = await db_Select('*', 'md_soc_tier', null, null);
        const soctietype = await db_Select('*', 'md_society_type', null, null);
        const distres = await db_Select('*', 'md_district', null, null);
        // Prepare data for rendering
        // console.log('Check Message Data');
        // console.log(suc_msg);
        // console.log('Check Message Data');
        const res_dt = {
          data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
          regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',
          blocklist:blockres.suc > 0 ? blockres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
          soctierlist:soctierres.suc > 0 ? soctierres.msg : '', soctietypelist:soctietype.suc > 0 ? soctietype.msg : '',
          zonereslist:zoneres.suc > 0 ? zoneres.msg : '',distlist:distres.suc > 0 ? distres.msg : '',
          cntr_auth_type:0,zone_code:0,dist_code:0,soc_tier:0,soc_type_id:0,range_code:0,urban_rural_flag:0,
          ulb_catg:0,block_id:0,total:total,socname:'',functional_status:'1',soc_data_status:''
        };
        // Render the view with data
        res.render('dashboard/landing', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('dashboard/landing', res_dt);
      }
})
DashboardRouter.post('/dashboard', async(req, res) => {
  try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      if(range_id == 0){
        const  user_type =  1;
      }else{
        const  user_type =  2;
      }
      var formdata = req.body;
      const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
       
      
      var con1 = formdata.cntr_auth_type > 0 ? `AND a.cntr_auth_type=${formdata.cntr_auth_type} ` : '';
      var con2 = formdata.range_code > 0 ? `AND a.range_code=${formdata.range_code} ` : '';
    
      var con3;
      if(formdata.urban_rural_flag == 'U'){
        con3 = `AND a.urban_rural_flag='U' `
      }else if(formdata.urban_rural_flag == 'R'){
        con3 = `AND a.urban_rural_flag='R' `
      }else{
          con3 = ''
      }
      
      if(formdata.urban_rural_flag == 'R'){
        var con4 = formdata.block_id > 0 ? `AND a.block_id=${formdata.block_id} ` : '';
      }else{
        var con4 = '';
      }

      if(formdata.urban_rural_flag == 'U'){
        var con5 = formdata.ulb_catg > 0 ? `AND a.ulb_catg='${formdata.ulb_catg}' ` : '';
      }else{
        var con5 = '';
      }
      
      var con6 = formdata.soc_tier > 0 ? `AND a.soc_tier=${formdata.soc_tier} ` : '';
      var con7 = formdata.soc_type_id > 0 ? `AND a.soc_type=${formdata.soc_type_id} ` : '';
      
      if (formdata.socname && formdata.socname.trim() !== '') {
        var con8 = `AND a.cop_soc_name LIKE '%${formdata.socname.split("'").join("\\'")}%' `;
      }else{
        var con8 = '';
      }
   
      var con9 = formdata.zone_code > 0 ? `AND a.zone_code=${formdata.zone_code} ` : '';
      if (formdata && formdata.dist_code) {
        var con10 = formdata.dist_code > 0 ? `AND a.dist_code='${formdata.dist_code}' ` : '';
      } else {
        var con10 = '';
      }
      let soc_data_status = '';

      if(range_id == 0){
        if (formdata.soc_data_status == 'A' || formdata.soc_data_status == 'U' || formdata.soc_data_status == 'E') {
          soc_data_status = `AND a.approve_status='${formdata.soc_data_status}'`;
        }
      }
      
      
     // var con11 = formdata.functional_status !='' ? `AND a.functional_status='${formdata.functional_status}' ` : '';
     
      var maincon = con1+con2+con3+con4+con5+con6+con7+con8+con9+con10+soc_data_status;
      if(range_id > 0 ){
        var whr = ` a.range_code='${range_id}' ${maincon} LIMIT 25`;
      }else{
        var whr = `1 ${maincon} LIMIT 25`;
      }
      const order = null;
    //   console.log(whr);
    //   console.log('chack');
      // Execute database query
      const result = await db_Select(select, table_name, whr, order);
      const select2 = "COUNT(*) as total";
      const countResult = await db_Select(select2, table_name, whr, order);
      const total = countResult.msg[0].total;
      const totalPages = Math.ceil(total / 25);
      const regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
      if(range_id > 0){
      var ranzeres = await db_Select('*', 'md_range', `range_id='${range_id}'`, null);
      }else{
        var ranzeres = await db_Select('*','md_range', null, null);
      }
      const results = await db_Select('*', 'md_range', null, null);
      var blockres ;
      if(range_id > 0){
      const distcode = ranzeres.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
       blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
      }else{
         blockres = await db_Select('*', 'md_block',  null, null);
      }
      const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
      const zoneres = await db_Select('*', 'md_zone', null, null);
      const distres = await db_Select('*', 'md_district', null, null);
      const soctierres = await db_Select('*', 'md_soc_tier', null, null);
      const soctietype = await db_Select('*', 'md_society_type', null, null);
      var urban_rural_flag; // Declare the variable first

        if (formdata.urban_rural_flag === 'U') {
          urban_rural_flag = 'U';
        } else if (formdata.urban_rural_flag === 'R') {
          urban_rural_flag = 'R';
        }else{
          urban_rural_flag = 0;
        }
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
        regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',
        blocklist:blockres.suc > 0 ? blockres.msg : '',zonereslist:zoneres.suc > 0 ? zoneres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
        distlist:distres.suc > 0 ? distres.msg : '',soctierlist:soctierres.suc > 0 ? soctierres.msg : '', soctietypelist:soctietype.suc > 0 ? soctietype.msg : '',
        cntr_auth_type:formdata.cntr_auth_type > 0 ? formdata.cntr_auth_type :0,
        zone_code:formdata.zone_code > 0 ? formdata.zone_code :0,
        range_code:formdata.range_code > 0 ? formdata.range_code :0,
        dist_code:formdata.dist_code > 0 ? formdata.dist_code :0,
        soc_type_id:formdata.soc_type_id > 0 ? formdata.soc_type_id :0,
        soc_tier:formdata.soc_tier > 0 ? formdata.soc_tier :0,
        urban_rural_flag,functional_status:'0',
        ulb_catg:formdata.ulb_catg > 0 ? formdata.ulb_catg :0,soc_data_status,
        block_id:formdata.block_id > 0 ? formdata.block_id :0,total:total,socname:formdata.socname.trim()
      };
 
      // Render the view with data
      res.render('dashboard/landing', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('dashboard/landing', res_dt);
    }
})


DashboardRouter.get('/socLimitList',async(req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 25;
  const offset = (page - 1) * limit;
  
  var con1 = req.query.cntr_auth_type > 0 ? `AND a.cntr_auth_type=${req.query.cntr_auth_type} ` : '';
  var dist_code = req.query.dist_code > 0 ? `AND a.dist_code=${req.query.dist_code} ` : '';
  var zone_code = req.query.zone_code > 0 ? `AND a.zone_code=${req.query.zone_code} ` : '';
  var range_code = req.query.range_code > 0 ? `AND a.range_code=${req.query.range_code} ` : '';
  var con6 = req.query.soc_tier > 0 ? `AND a.soc_tier=${req.query.soc_tier} ` : '';
  var con4 = req.query.urban_rural_flag > 0 ? `AND a.urban_rural_flag=${req.query.urban_rural_flag} ` : '';
  var con7 = req.query.soc_type_id > 0 ? `AND a.soc_type=${req.query.soc_type_id}` : '';
  var soc_data_status =  req.query.soc_data_status > 0 ? `AND a.approve_status=${req.query.soc_data_status} ` : '';

  var functional_status = req.query.functional_status != '' ? ` AND a.functional_status='${req.query.functional_status}'` : '';
  var maincon =con1+dist_code+zone_code+range_code+con4+con6+con7 +functional_status+soc_data_status;
     console.log(maincon);
      const range_id = req.session.user.range_id;
      const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
      if(range_id > 0){
        var whr = `1 AND a.range_code='${range_id}' ${maincon} LIMIT ${offset} , ${limit}`;
      }else{
        var whr = `1 ${maincon} LIMIT ${offset} , ${limit}`;
      }
      
      const order = null;
      const select2 = "COUNT(*) as total";
      if(range_id > 0){
        var countResult = await db_Select(select2, table_name,`a.range_code='${range_id}' ${maincon}`, order);
      }else{
        var countResult = await db_Select(select2, table_name,`1 ${maincon}`, order);
      }
    
        const total = countResult.msg[0].total;
       const totalPages = Math.ceil(total / limit);
      // Execute database query
     const result = await db_Select(select, table_name, whr, order);
     res.json({ data: result.suc > 0 ? result.msg : '', page,totalPages:totalPages,total:total });

});

DashboardRouter.get('/dash', async(req, res) => {
  try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,a.tenure_ends_on,a.elec_due_date,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      if(range_id > 0){ 
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" LIMIT 25`;
      var table_list_for_onemonth_before = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) `;
      var soc_list_over_election = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" AND a.tenure_ends_on < CURDATE()  `;
   
       }else{
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' LIMIT 25`;
        var table_list_for_onemonth_before = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) `;
        var soc_list_over_election = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on < CURDATE() `;
    
       }
      whr = '';
      const order = null;
      if(range_id > 0){
          whr1 = `functional_status='Functional' AND range_code='${range_id}'`;
      }else{
        whr1 =`functional_status='Functional' `;
      }
      var onemonthduereport = await db_Select('COUNT(*) as  onemnth', table_list_for_onemonth_before, whr, order);
      var overelection = await db_Select('COUNT(*) as  overele', soc_list_over_election, whr, order);
      // Execute database query

      const result = await db_Select(select, table_name, whr, order);
      const select2 = "COUNT(*) as total";
      const countResult = await db_Select(select2, 'md_society', whr1, order);
      const total = countResult.msg[0].total;
      const totalPages = Math.ceil(total / 25);
      var regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
      const zoneres = await db_Select('*', 'md_zone', null, null);
      const ranzeres = await db_Select('*', 'md_range', null, null);
      var blockres ;
      if(range_id > 0){
        const results = await db_Select('*', 'md_range', `range_id = '${range_id}'`, null);
        const distcode = results.msg[0].dist_id > 0 ? results.msg[0].dist_id : 0;
         blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
      }else{
         blockres = await db_Select('*', 'md_block',  `dist_id='0'`, null);
      }
      const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
      const soctierres = await db_Select('*', 'md_soc_tier', null, null);
      const soctietype = await db_Select('*', 'md_society_type', null, null);
      const distres = await db_Select('*', 'md_district', null, null);
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
        onemondue:onemonthduereport.suc > 0 ? onemonthduereport.msg[0] : '',
        overelect:overelection.suc> 0 ? overelection.msg[0] : '',
        regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',
        blocklist:blockres.suc > 0 ? blockres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
        soctierlist:soctierres.suc > 0 ? soctierres.msg : '', soctietypelist:soctietype.suc > 0 ? soctietype.msg : '',
        zonereslist:zoneres.suc > 0 ? zoneres.msg : '',distlist:distres.suc > 0 ? distres.msg : '',
        cntr_auth_type:0,zone_code:0,dist_code:0,soc_tier:0,soc_type_id:0,range_code:0,urban_rural_flag:0,
        ulb_catg:0,block_id:0,total:total,socname:'',functional_status:'1',soc_data_status:''
      };
    
      // Render the view with data
      res.render('dashboard/dashboard', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('dashboard/dashboard', res_dt);
    }
})

DashboardRouter.post('/get_society_tot',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    var data = req.body
    var select = `SUM(CASE WHEN a.functional_status = 'Functional' THEN 1 ELSE 0 END) AS func_tot, SUM(CASE WHEN a.functional_status = 'Under Liquidation' THEN 1 ELSE 0 END) AS liquidation_tot, SUM(CASE WHEN a.functional_status = 'Non-Functional / Dormant' THEN 1 ELSE 0 END) AS non_functional`,
    table_name = `md_society a`,
    where = data.range_code > 0 ? `a.range_code ='${data.range_code}'` : ``,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : '', // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
    } catch (err) {
        console.error('Error handling /regauth request:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})
DashboardRouter.post('/get_election_status',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    var data = req.body
    var select = `SUM(CASE WHEN election_status = 'DUE' THEN 1 ELSE 0 END) AS due_tot,SUM(CASE WHEN election_status = 'ONGOING' THEN 1 ELSE 0 END) AS ongoing_tot, SUM(CASE WHEN election_status = 'DONE' THEN 1 ELSE 0 END) AS done_tot`,
    table_name = `md_society`,
   
    where = data.range_code > 0 ? `functional_status = 'Functional' AND range_code ='${data.range_code}'` : `functional_status = 'Functional'`,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : '', // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
    } catch (err) {
        console.error('Error handling /regauth request:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})
   ///  *************  Code for Society Election Result    ****   ////
DashboardRouter.get('/societyelection', async(req, res) => {
  try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var range_code = req.query.range_code;
      
      const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      if(range_id > 0){ 
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.election_status ='ONGOING' AND a.range_code = "${range_id}" LIMIT 25`;
       }else{
        var confor_range = range_code> 0 ? `AND a.range_code = '${range_code}'` : '' ;
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.election_status ='ONGOING' ${confor_range} LIMIT 25`;
       }
      whr = '';
      const order = null;
      if(range_id > 0){
          whr1 = `election_status ='ONGOING' AND functional_status='Functional' AND range_code='${range_id}'`;
      }else{
        var confor_range = range_code> 0 ? `AND a.range_code = '${range_code}'` : '' ;
        whr1 =`election_status ='ONGOING' AND functional_status='Functional' ${confor_range}`;
      }
     
      // Execute database query
      const result = await db_Select(select, table_name, whr, order);
      const select2 = "COUNT(*) as total";
      const countResult = await db_Select(select2, 'md_society', whr1, order);
      const total = countResult.msg[0].total;
      const totalPages = Math.ceil(total / 25);
      var regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
      const zoneres = await db_Select('*', 'md_zone', null, null);
      const ranzeres = await db_Select('*', 'md_range',`range_id=${range_code}`, null);
      console.log(ranzeres);
     if(range_code > 0){
      range_name = ranzeres.msg[0].range_name;
     }else{
      range_name =  'ALL';
     }
      var blockres ;
         blockres = await db_Select('*', 'md_block',  `dist_id='0'`, null);
    
      const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
      const soctierres = await db_Select('*', 'md_soc_tier', null, null);
      const soctietype = await db_Select('*', 'md_society_type', null, null);
      const distres = await db_Select('*', 'md_district', null, null);
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : '',
        page: 1,totalPages:totalPages,confor_range:range_code,range_name:range_name,
        regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',
        blocklist:blockres.suc > 0 ? blockres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
        soctierlist:soctierres.suc > 0 ? soctierres.msg : '', soctietypelist:soctietype.suc > 0 ? soctietype.msg : '',
        zonereslist:zoneres.suc > 0 ? zoneres.msg : '',distlist:distres.suc > 0 ? distres.msg : '',
        cntr_auth_type:0,zone_code:0,dist_code:0,soc_tier:0,soc_type_id:0,range_code:0,urban_rural_flag:0,
        ulb_catg:0,block_id:0,total:total,socname:'',functional_status:'1',soc_data_status:''
      };
      // Render the view with data
      res.render('dashboard/election_result', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('dashboard/election_result', res_dt);
    }
})

DashboardRouter.get('/socLimitListfor_election_status',async(req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 25;
  const offset = (page - 1) * limit;
  
  var con1 = req.query.cntr_auth_type > 0 ? `AND a.cntr_auth_type=${req.query.cntr_auth_type} ` : '';
  var dist_code = req.query.dist_code > 0 ? `AND a.dist_code=${req.query.dist_code} ` : '';
  var zone_code = req.query.zone_code > 0 ? `AND a.zone_code=${req.query.zone_code} ` : '';
  var range_code = req.query.range_code > 0 ? `AND a.range_code=${req.query.range_code} ` : '';
  var con6 = req.query.soc_tier > 0 ? `AND a.soc_tier=${req.query.soc_tier} ` : '';
  var con4 = req.query.urban_rural_flag > 0 ? `AND a.urban_rural_flag=${req.query.urban_rural_flag} ` : '';
  var con7 = req.query.soc_type_id > 0 ? `AND a.soc_type=${req.query.soc_type_id}` : '';
  var soc_data_status =  req.query.soc_data_status > 0 ? `AND a.approve_status=${req.query.soc_data_status} ` : '';

  var functional_status = ` AND a.functional_status='Functional'`;
  var election_status   = ` AND a.election_status='${req.query.election_status}'`;
  var maincon =con1+dist_code+zone_code+range_code+con4+con6+con7 +functional_status+soc_data_status+election_status;
     console.log(maincon);
      const range_id = req.session.user.range_id;
      const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id`;
      if(range_id > 0){
        var whr = `a.functional_status='Functional' AND a.range_code='${range_id}' ${maincon} LIMIT ${offset} , ${limit}`;
      }else{
        var whr = `a.functional_status='Functional' ${maincon} LIMIT ${offset} , ${limit}`;
      }
      
      const order = null;
     
      const select2 = "COUNT(*) as total";
      if(range_id > 0){
        var countResult = await db_Select(select2, table_name,`a.range_code='${range_id}' ${maincon}`, order);
      }else{
        var countResult = await db_Select(select2, table_name,`1 ${maincon}`, order);
      }
    
        const total = countResult.msg[0].total;
       const totalPages = Math.ceil(total / limit);
      // Execute database query
     const result = await db_Select(select, table_name, whr, order);
     res.json({ data: result.suc > 0 ? result.msg : '', page,totalPages:totalPages,total:total });

});

DashboardRouter.post('/get_soctype_detail',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    var data = req.body;
    var soctype = `md_society a,md_society_type b`,
    where = data.range_code > 0 ? `a.soc_type = b.soc_type_id AND a.functional_status = 'Functional' AND a.range_code ='${data.range_code}' group by a.soc_type` : `a.soc_type = b.soc_type_id AND a.functional_status = 'Functional' group by a.soc_type`,
    order = null;
    var soctyperes = await db_Select(`a.soc_type,b.soc_type_name,count(a.cop_soc_name)tot_soc_type`, soctype, where, null);
    const responseData = {
      soctype: soctyperes.suc > 0 ? soctyperes.msg : '', // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
    } catch (err) {
        console.error('Error handling /regauth request:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})

DashboardRouter.post('/get_rular_urban',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    var data = req.body
    var select = `SUM(CASE WHEN urban_rural_flag = 'U' THEN 1 ELSE 0 END) AS urban_tot,SUM(CASE WHEN election_status = 'R' THEN 1 ELSE 0 END) AS rular_tot`,
    table_name = `md_society`,
    where = data.range_code > 0 ? `functional_status = 'Functional' AND range_code ='${data.range_code}'` : `functional_status = 'Functional'`,
    order = null;
    var res_dt = await db_Select(select, table_name, where, order);
    const responseData = {
      soctot: res_dt.suc > 0 ? res_dt.msg[0] : '', // Echoing the received claims
    };
    // Send response back to the client
    res.json(responseData);
    } catch (err) {
        console.error('Error handling /regauth request:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
})

DashboardRouter.get('/society_download', async (req, res) => {
  try {
     var range_id = req.session.user.range_id;
     var range = range_id > 0 ? `AND a.range_code=${range_id} ` : '';
     const select = "a.cop_soc_name, a.reg_no, a.reg_date, b.soc_type_name, f.soc_tier_name, h.controlling_authority_type_name AS reg_cont_auth, g.controlling_authority_name AS returning_officer, st.state_name, c.dist_name, d.zone_name, e.range_name, a.urban_rural_flag, ulcat.ulb_catg_name, ulb.ulb_name, wa.ward_name, mb.block_name, gp.gp_name, vill.vill_name, a.pin_no, a.address, mms.manage_status_name, mot.officer_type_name, a.num_of_memb, a.audit_upto, a.last_elec_date, a.tenure_ends_on, a.contact_name AS key_person, a.contact_designation AS key_person_desig, a.contact_number, a.email, a.case_id, a.case_num, a.functional_status";
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

      const where = `${con + range}`; // Ensure these variables are properly defined
      const res_dt = await db_Select(select, table_name, where,null);

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      // Define column headers
      worksheet.columns = [
          { header: 'Society Name', key: 'cop_soc_name' },
          { header: 'Registration No', key: 'reg_no' },
          { header: 'Registration Date', key: 'reg_date' },
          { header: 'Society Type', key: 'soc_type_name' },
          { header: 'Tier Name', key: 'soc_tier_name' },
          { header: 'Controlling Authority Type', key: 'reg_cont_auth' },
          { header: 'Returning Officer', key: 'returning_officer' },
          { header: 'State', key: 'state_name' },
          { header: 'District', key: 'dist_name' },
          { header: 'Zone', key: 'zone_name' },
          { header: 'Range', key: 'range_name' },
          { header: 'Urban/Rural', key: 'urban_rural_flag' },
          { header: 'ULB Category', key: 'ulb_catg_name' },
          { header: 'ULB Name', key: 'ulb_name' },
          { header: 'Ward', key: 'ward_name' },
          { header: 'Block', key: 'block_name' },
          { header: 'Gram Panchayat', key: 'gp_name' },
          { header: 'Village', key: 'vill_name' },
          { header: 'PIN No', key: 'pin_no' },
          { header: 'Address', key: 'address' },
          { header: 'Management Status', key: 'manage_status_name' },
          { header: 'Officer Type', key: 'officer_type_name' },
          { header: 'Number of Members', key: 'num_of_memb' },
          { header: 'Audit Up To', key: 'audit_upto' },
          { header: 'Last Election Date', key: 'last_elec_date' },
          { header: 'Tenure Ends On', key: 'tenure_ends_on' },
          { header: 'Key Person', key: 'key_person' },
          { header: 'Designation', key: 'key_person_desig' },
          { header: 'Contact Number', key: 'contact_number' },
          { header: 'Email', key: 'email' },
          { header: 'Case ID', key: 'case_id' },
          { header: 'Case Number', key: 'case_num' },
          { header: 'Functional Status', key: 'functional_status' },
      ];
       var result = res_dt.suc > 0 ? res_dt.msg : '';
      // Add rows to the worksheet
      result.forEach(item => {
          worksheet.addRow(item);
      });

      // Set response headers for the Excel file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=report_society_list.xlsx`);

      // Write the Excel file to the response
      await workbook.xlsx.write(res);
      res.end();
  } catch (error) {
      console.error('Error during Excel generation:', error);
      res.status(500).json({ error: 'An error occurred while generating the report.' });
  }
  });

module.exports = {DashboardRouter}