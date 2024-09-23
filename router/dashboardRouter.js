const DashboardRouter = require('express').Router()
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
        const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        if(range_id > 0){ 
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.range_code = "${range_id}" LIMIT 25`;
         }else{
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id LIMIT 25`;
         }
        whr = '';
        const order = null;
        if(range_id > 0){
            whr1 = `range_code='${range_id}'`;
        }else{
          whr1 ='';
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
          const distcode = results.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
           blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
        
        }else{
           blockres = await db_Select('*', 'md_block',  'dist_id=0', null);
        }
        const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
        const soctierres = await db_Select('*', 'md_soc_tier', null, null);
        const soctietype = await db_Select('*', 'md_society_type', null, null);
        const distres = await db_Select('*', 'md_district', null, null);
        // Prepare data for rendering
        const res_dt = {
          data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
          regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',
          blocklist:blockres.suc > 0 ? blockres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
          soctierlist:soctierres.suc > 0 ? soctierres.msg : '', soctietypelist:soctietype.suc > 0 ? soctietype.msg : '',
          zonereslist:zoneres.suc > 0 ? zoneres.msg : '',distlist:distres.suc > 0 ? distres.msg : '',
          cntr_auth_type:0,zone_code:0,dist_code:0,soc_tier:0,soc_type_id:0,range_code:0,urban_rural_flag:0,
          ulb_catg:0,block_id:0,total:total
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
        var con8 = `AND a.cop_soc_name LIKE '%${formdata.socname}%' `;
      }else{
        var con8 = '';
      }
   
      var con9 = formdata.zone_code > 0 ? `AND a.zone_code=${formdata.zone_code} ` : '';
      if (formdata && formdata.dist_code) {
        var con10 = formdata.dist_code > 0 ? `AND a.dist_code='${formdata.dist_code}' ` : '';
      } else {
        var con10 = '';
      }
     
      var maincon = con1+con2+con3+con4+con5+con6+con7+con8+con9+con10;
      if(range_id > 0 ){
        var whr = `a.range_code='${range_id}' ${maincon} LIMIT 25`;
      }else{
        var whr = `1 ${maincon} LIMIT 25`;
      }
      const order = null;
       console.log(whr);
       console.log('chack');
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
        urban_rural_flag,
        ulb_catg:formdata.ulb_catg > 0 ? formdata.ulb_catg :0,
        block_id:formdata.block_id > 0 ? formdata.block_id :0,
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
  var maincon =con1+dist_code+zone_code+range_code+con4+con6+con7;
     
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
     res.json({ data: result.suc > 0 ? result.msg : '', page,totalPages:totalPages });

});

module.exports = {DashboardRouter}