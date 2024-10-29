const reportRouter = require('express').Router()
const {db_Select} = require('../modules/MasterModule');
reportRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
});

   ///  *************  Code for Society Election Result    ****   ////
reportRouter.get('/election_due', async(req, res) => {
  try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var range_code = req.query.range_code;
      var title = 'Election Due';
      const select = "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      if(range_id > 0){ 
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on < CURDATE() AND a.range_code = "${range_id}" `;
       }else{
        var confor_range = range_code> 0 ? `AND a.range_code = '${range_code}'` : '' ;
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on < CURDATE() `;
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
      range_name =  'ALL Range';
     }
      
    
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : '',
        page: 1,totalPages:totalPages,confor_range:range_code,range_name:range_name,
        total:total,socname:'',title:title,soc_data_status:''
      };
      // Render the view with data
      res.render('report/election_result', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('report/election_result', res_dt);
    }
})
reportRouter.get('/election_upcoming', async(req, res) => {
  try {
      // Extract range_id from session
      const range_id = req.session.user.range_id;
      var range_code = req.query.range_code;
      var title = 'Election Upcoming';
      const select = "a.id,a.cop_soc_name,a.last_elec_date,a.tenure_ends_on,a.elec_due_date,a.reg_no,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
      if(range_id > 0){ 
      var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 2 MONTH) AND a.range_code = "${range_id}" `;
       }else{
        var confor_range = range_code> 0 ? `AND a.range_code = '${range_code}'` : '' ;
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL 2 MONTH) `;
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
      const ranzeres = await db_Select('*', 'md_range',`range_id=${range_code}`, null);
     if(range_code > 0){
      range_name = ranzeres.msg[0].range_name;
     }else{
      range_name =  'ALL Range';
     }
     
    
      // Prepare data for rendering
      const res_dt = {
        data: result.suc > 0 ? result.msg : '',
        page: 1,totalPages:totalPages,confor_range:range_code,range_name:range_name,
        total:total,socname:'',title:title,soc_data_status:''
      };
      // Render the view with data
      res.render('report/election_result', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('report/election_result', res_dt);
    }
})

module.exports = {reportRouter}