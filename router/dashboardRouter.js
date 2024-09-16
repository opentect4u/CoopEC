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
        const select = "a.id,a.cop_soc_name,a.reg_no,b.soc_type_name";
        const table_name = "md_society a,md_society_type b";
        const whr = `a.soc_type=b.soc_type_id AND a.range_code='${range_id}' LIMIT 25`;
        const order = null;
    
        // Execute database query
        const result = await db_Select(select, table_name, whr, order);
        const select2 = "COUNT(*) as total";
        const countResult = await db_Select(select2, table_name, whr, order);
      
        const total = countResult.msg[0].total;
        const totalPages = Math.ceil(total / 25);
        const regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
        const zoneres = await db_Select('*', 'md_zone', null, null);
        const ranzeres = await db_Select('*', 'md_range', null, null);
        let blockres = { suc: 0, msg: [] };
        if(range_id > 0){
          const results = await db_Select('*', 'md_range', `range_id = '${range_id}'`, null);
          const distcode = results.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
          const blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
        
        }else{
          const blockres = await db_Select('*', 'md_block',  'dist_id=0', null);
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
          cntr_auth_type:0,zone_code:0,dist_code:0,soc_tier:0,soc_type_id:0
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
      const select = "a.id,a.cop_soc_name,a.reg_no,b.soc_type_name";
      const table_name = "md_society a,md_society_type b";
      console.log(formdata);
      var con1 = formdata.cntr_auth_type > 0 ? `AND cntr_auth_type=${formdata.cntr_auth_type} ` : '';
      var con2 = formdata.range_code > 0 ? `AND range_code=${formdata.range_code} ` : '';
      var con3 = formdata.urban_rural_flag > 0 ? `AND urban_rural_flag=${formdata.urban_rural_flag} ` : '';
      var con4 = formdata.block_id > 0 ? `AND block_id=${formdata.block_id} ` : '';
      var con5 = formdata.ulb_catg > 0 ? `AND ulb_catg=${formdata.ulb_catg} ` : '';
      var con6 = formdata.soc_tier > 0 ? `AND soc_tier=${formdata.soc_tier} ` : '';
      var con7 = formdata.soc_type_id > 0 ? `AND soc_type=${formdata.soc_type_id} ` : '';
      
      if (formdata.socname && formdata.socname.trim() !== '') {
        var con8 = `AND cop_soc_name LIKE '%${formdata.socname}%' `;
      }else{
        var con8 = '';
      }
   
    var con9 = formdata.zone_code > 0 ? `AND zone_code=${formdata.zone_code} ` : '';
     // Example checking and converting object properties
            if (formdata && formdata.dist_code) {
           
              var con10 = formdata.dist_code > 0 ? `AND dist_code='${formdata.dist_code}' ` : '';
             
            } else {
              var con10 = '';
            }
     
      var maincon = con1+con2+con3+con4+con5+con6+con7+con8+con9+con10;
      if(range_id > 0 ){
        var whr = `a.soc_type=b.soc_type_id AND a.range_code='${range_id}' ${maincon} LIMIT 25`;
      }else{
        var whr = `a.soc_type=b.soc_type_id ${maincon} LIMIT 25`;
      }
      
      const order = null;
  
      // Execute database query
      const result = await db_Select(select, table_name, whr, order);
      const select2 = "COUNT(*) as total";
      const countResult = await db_Select(select2, table_name, whr, order);
    
    
      const total = countResult.msg[0].total;
      const totalPages = Math.ceil(total / 25);
      const regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
      const ranzeres = await db_Select('*', 'md_range', `range_id='${range_id}'`, null);
      const results = await db_Select('*', 'md_range', null, null);
      let blockres = { suc: 0, msg: [] };
      if(range_id > 0){
      const distcode = ranzeres.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
      const blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
      }else{
        const blockres = await db_Select('*', 'md_block',  null, null);
      }
      const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
      const zoneres = await db_Select('*', 'md_zone', null, null);
      const distres = await db_Select('*', 'md_district', null, null);
      const soctierres = await db_Select('*', 'md_soc_tier', null, null);
      const soctietype = await db_Select('*', 'md_society_type', null, null);
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
        regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',
        blocklist:blockres.suc > 0 ? blockres.msg : '',zonereslist:zoneres.suc > 0 ? zoneres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
        distlist:distres.suc > 0 ? distres.msg : '',soctierlist:soctierres.suc > 0 ? soctierres.msg : '', soctietypelist:soctietype.suc > 0 ? soctietype.msg : '',
        cntr_auth_type:formdata.cntr_auth_type > 0 ? formdata.cntr_auth_type :0,
        zone_code:formdata.zone_code > 0 ? formdata.zone_code :0,
        dist_code:formdata.dist_code > 0 ? formdata.dist_code :0,
        soc_type_id:formdata.soc_type_id > 0 ? formdata.soc_type_id :0,
        soc_tier:formdata.soc_tier > 0 ? formdata.soc_tier :0,
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
  
  var con1 = req.query.cntr_auth_type > 0 ? `AND cntr_auth_type=${req.query.cntr_auth_type} ` : '';
  var con2 = req.query.zone_code > 0 ? `AND zone_code=${eq.query.zone_code} ` : '';
  var con3 = req.query.dist_code > 0 ? `AND dist_code=${req.query.dist_code} ` : '';
  var con6 = req.query.soc_tier > 0 ? `AND soc_tier=${req.query.soc_tier} ` : '';

  // var con2 = formdata.range_code > 0 ? `AND range_code=${formdata.range_code} ` : '';
  // var con3 = formdata.urban_rural_flag > 0 ? `AND urban_rural_flag=${formdata.urban_rural_flag} ` : '';
  // var con4 = formdata.block_id > 0 ? `AND block_id=${formdata.block_id} ` : '';
  // var con5 = formdata.ulb_catg > 0 ? `AND ulb_catg=${formdata.ulb_catg} ` : '';
  // var con6 = formdata.soc_tier > 0 ? `AND soc_tier=${formdata.soc_tier} ` : '';
 

  var con7 = req.query.soc_type_id > 0 ? `AND soc_type=${req.query.soc_type_id}` : '';
 
  var maincon =con1+con2+con3+con6+con7;
     const sql = 'SELECT * FROM items LIMIT ? OFFSET ?';
      const range_id = req.session.user.range_id;
      const select = "a.id,a.cop_soc_name,a.reg_no,b.soc_type_name";
      const table_name = "md_society a,md_society_type b";
      if(range_id > 0){
        var whr = `a.soc_type=b.soc_type_id AND a.range_code='${range_id}' ${maincon} LIMIT ${offset} , ${limit}`;
      }else{
        var whr = `a.soc_type=b.soc_type_id  ${maincon} LIMIT ${offset} , ${limit}`;
      }
      
      const order = null;
     
      const select2 = "COUNT(*) as total";
      if(range_id > 0){
        var countResult = await db_Select(select2, table_name,` a.soc_type=b.soc_type_id AND a.range_code='${range_id}' ${maincon}`, order);
      }else{
        var countResult = await db_Select(select2, table_name,` a.soc_type=b.soc_type_id ${maincon}`, order);
      }
    
        const total = countResult.msg[0].total;
       const totalPages = Math.ceil(total / limit);
      // Execute database query
     const result = await db_Select(select, table_name, whr, order);
     res.json({ data: result.suc > 0 ? result.msg : '', page,totalPages:totalPages });

});

module.exports = {DashboardRouter}