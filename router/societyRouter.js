const SocietyRouter = require('express').Router()
const moment = require('moment');
const {db_Select,db_Insert} = require('../modules/MasterModule');
SocietyRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
});
SocietyRouter.get('/edit', async(req, res) => {
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
        const typelist = await db_Select('*', 'md_society_type', null, null);
        const soctierres = await db_Select('*', 'md_soc_tier', null, null);
        const regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
        const regauthres = await db_Select('*', 'md_controlling_authority', null, null);
        const zoneres = await db_Select('*', 'md_zone', null, null);
        const distres = await db_Select('*', 'md_district', null, null);
        const distcode = result.msg[0].dist_code > 0 ? result.msg[0].dist_code : 0;
        const zone_id = result.msg[0].zone_code > 0 ? result.msg[0].zone_code : 0;
        const ranzeres = await db_Select('*', 'md_range', `dist_id='${distcode}'`, null);
           console.log(ranzeres);
        const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
        const ulbres = await db_Select('*', 'md_ulb', null, null);
        const managementres = await db_Select('*', 'md_management_status', null, null);
        const officertyperes = await db_Select('*', 'md_officer_type', null, null);
        const caseflagres = await db_Select('*', 'md_case_flag', null, null);
        const wardres = await db_Select('*', 'md_ward', null, null);
        const blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
        const gpres = await db_Select('*', 'md_gp',  `dist_id='${distcode}'`, null);
        const villres = await db_Select('*', 'md_village',  `dist_id='${distcode}'`, null);
        const boardmembdtsl = await db_Select('*', 'td_board_member',  `soc_id='${soc_id}'`, null);
        
    
        // Prepare data for rendering
        const res_dt = {
          soc: result.suc > 0 ? result.msg[0] : '',soctypelist: typelist.suc > 0 ? typelist.msg : '',
          soctierlist: soctierres.suc > 0 ? soctierres.msg : '',regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',
          regauthlist: regauthres.suc > 0 ? regauthres.msg : '',moment: moment,
          zonelist: zoneres.suc > 0 ? zoneres.msg : '',districtlist: distres.suc > 0 ? distres.msg : '',
          ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
          ulblist: ulbres.suc > 0 ? ulbres.msg : '',managementlist: managementres.suc > 0 ? managementres.msg : '',
          officertypelist: officertyperes.suc > 0 ? officertyperes.msg : '',caseflaglist: caseflagres.suc > 0 ? caseflagres.msg : '',
          wardlist:wardres.suc > 0 ? wardres.msg : '',blocklist:blockres.suc > 0 ? blockres.msg : '',
          gplist:gpres.suc > 0 ? gpres.msg : '',villlist:villres.suc > 0 ? villres.msg : '',
          boardmembdlist: boardmembdtsl.suc > 0 ? boardmembdtsl.msg : '',
        };
        // Render the view with data
        res.render('society/edit', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('dashboard/edit', res_dt);
      }
})
SocietyRouter.post('/socedit', async(req, res) => {
  try {
      // Extract range_id from session
      var user_id = req.session.user.user_id;
      var date_ob = moment();
    // Format it as YYYY-MM-DD HH:mm:ss
      var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
   
      var data = req.body;
      var table_name = "md_society";
    var values = null;
    var block_id = data.block_id || 0 ;
    var gp_id  = data.gp_id || 0 ;
    var ulb_catg = data.ulb_catg || 0 ;

    var ulb_id  = data.ulb_id || 0 ;
    var fields = `cop_soc_name = '${data.cop_soc_name.split("'").join("\\'")}',reg_no = '${data.reg_no}',reg_date = '${data.reg_date}',soc_tier = '${data.soc_tier}',
    soc_type = '${data.soc_type}',cntr_auth_type='${data.cntr_auth_type}',cntr_auth='${data.cntr_auth}',dist_code='${data.dist_code}',
    ulb_catg = '${ulb_catg}',ulb_id = '${ulb_id}',ward_no = '${data.ward_no}',pin_no = '${data.pin_no}',range_code = '${data.range_code}',
    urban_rural_flag ='${data.urban_rural_flag}',
    block_id = '${block_id}',gp_id = '${gp_id}',vill_id = '${data.vill_id}',mouza = '${data.mouza}',address='${data.address.split("'").join("\\'")}',num_of_memb='${data.num_of_memb}',audit_upto='${data.audit_upto}',
    mgmt_status = '${data.mgmt_status}',officer_type = '${data.officer_type}',last_elec_date = '${data.last_elec_date}',
    tenure_ends_on = '${data.tenure_ends_on}',elec_due_date = '${data.elec_due_date}',contact_name='${data.contact_name}',contact_designation='${data.contact_designation}',
    contact_number = '${data.contact_number}',email = '${data.email}',case_id='${data.case_id}',case_num='${data.case_num}',functional_status='${data.functional_status}',approve_status='E',election_status='${data.election_status}',modified_by='${user_id}',
    modified_dt = '${formattedDate}',modified_ip='${ip}' `;
    var whr = `id = '${data.id}'` ;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);
  
    const board_memb_id = data['board_memb_id[]'];
    const board_memb_name = data['board_memb_name[]'];
    const board_memb_desig = data['board_memb_desig[]'];
    const bm_contact_no = data['bm_contact_no[]'];

    for (let i = 0; i < board_memb_name.length; i++) {
      // Only process if board_memb_name is not empty
      if (board_memb_name[i].length > 0) {
          // Construct the values string for insertion
          const values = `('${data.id}', '${board_memb_name[i]}', '${board_memb_desig[i]}','${bm_contact_no[i]}','${user_id}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`;
  
          if (board_memb_id[i] > 0) {
              // Update existing record
              const fields = `board_memb_name = '${board_memb_name[i]}', board_memb_desig = '${board_memb_desig[i]}',bm_contact_no = '${bm_contact_no[i]}', modified_by = '${user_id}', modified_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}'`;
              await db_Insert('td_board_member', fields, null, `board_memb_id = ${board_memb_id[i]}`, true);
          } else {
              // Insert new record
              const fields = '(`soc_id`, `board_memb_name`, `board_memb_desig`,`bm_contact_no`, `created_by`, `created_dt`)';
              await db_Insert('td_board_member', fields, values, null, false);
          }
      }
    }
      req.flash('success_msg', 'Update successful!');
      res.redirect("/dash/dashboard");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('dashboard/edit', res_dt);
    }
})

  
SocietyRouter.get('/socadd', async(req, res) => {
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
      const typelist = await db_Select('*', 'md_society_type', null, null);
      const soctierres = await db_Select('*', 'md_soc_tier', null, null);
      const regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
      const regauthres = await db_Select('*', 'md_controlling_authority', null, null);
      const zoneres = await db_Select('*', 'md_zone', null, null);
      const distres = await db_Select('*', 'md_district', null, null);
      if(range_id > 0){
        var ranzeres = await db_Select('*', 'md_range', `range_id='${range_id}'`, null);
        var distcode = ranzeres.msg[0].dist_id > 0 ? ranzeres.msg[0].dist_id : 0;
      }else{
        var ranzeres = await db_Select('*', 'md_range', null, null);
        var distcode =  0;
      }
      
     
      const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
      const ulbres = await db_Select('*', 'md_ulb', null, null);
      const managementres = await db_Select('*', 'md_management_status', null, null);
      const officertyperes = await db_Select('*', 'md_officer_type', null, null);
      const caseflagres = await db_Select('*', 'md_case_flag', null, null);
      const wardres = await db_Select('*', 'md_ward', null, null);
      const blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
      const gpres = await db_Select('*', 'md_gp',  `dist_id='${distcode}'`, null);
      const villres = await db_Select('*', 'md_village',  `dist_id='${distcode}'`, null);
      const boardmembdtsl = await db_Select('*', 'td_board_member',  `soc_id='${soc_id}'`, null);
      
  
      // Prepare data for rendering
      const res_dt = {
        soctypelist: typelist.suc > 0 ? typelist.msg : '',soc:'',
        soctierlist: soctierres.suc > 0 ? soctierres.msg : '',regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',
        regauthlist: regauthres.suc > 0 ? regauthres.msg : '',moment: moment,
        zonelist: zoneres.suc > 0 ? zoneres.msg : '',districtlist: distres.suc > 0 ? distres.msg : '',
        ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
        ulblist: ulbres.suc > 0 ? ulbres.msg : '',managementlist: managementres.suc > 0 ? managementres.msg : '',
        officertypelist: officertyperes.suc > 0 ? officertyperes.msg : '',caseflaglist: caseflagres.suc > 0 ? caseflagres.msg : '',
        wardlist:wardres.suc > 0 ? wardres.msg : '',blocklist:blockres.suc > 0 ? blockres.msg : '',
        gplist:gpres.suc > 0 ? gpres.msg : '',villlist:villres.suc > 0 ? villres.msg : '',
        boardmembdlist: boardmembdtsl.suc > 0 ? boardmembdtsl.msg : '',
      };
      // Render the view with data
      res.render('society/add', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
     // res.render('dashboard/edit', res_dt);
    }
})
SocietyRouter.post('/socadddata', async(req, res) => {
  try {
      // Extract range_id from session
      var user_id = req.session.user.user_id;
      var datetime = moment().format('YYYY-MM-DD HH:mm:ss');
      var data = req.body;
      var table_name = "md_society";
    var values = null;
    var block_id = data.block_id || 0 ;
    var gp_id  = data.gp_id || 0 ;
    var ulb_catg = data.ulb_catg || 0 ;
    var ulb_id  = data.ulb_id || 0 ;

            
    var fields = `(cop_soc_name,reg_no,reg_date,soc_type,soc_tier,cntr_auth_type,cntr_auth,zone_code,dist_code,range_code,urban_rural_flag,ulb_catg,ulb_id,ward_no,block_id,gp_id,vill_id,pin_no,address,mouza,num_of_memb,audit_upto,mgmt_status,officer_type,last_elec_date,tenure_ends_on,elec_due_date,contact_name,contact_designation,contact_number,email,case_id,case_num,functional_status,created_by,created_dt)`;
  
    var values = `('${data.cop_soc_name.split("'").join("\\'")}','${data.reg_no}','${data.reg_date}','${data.soc_type}','${data.soc_tier}','${data.cntr_auth_type}','${data.cntr_auth}','${data.zone_code}','${data.dist_code}','${data.range_code}','${data.urban_rural_flag}','${ulb_catg}','${ulb_id}','${data.ward_no}','${block_id}','${gp_id}','${data.vill_id}','${data.pin_no}','${data.address}','${data.mouza}','${data.num_of_memb}','${data.audit_upto}','${data.mgmt_status}','${data.officer_type}','${data.last_elec_date}','${data.tenure_ends_on}','${data.elec_due_date}','${data.contact_name}','${data.contact_designation}','${data.contact_number}','${data.email}','${data.case_id}','${data.case_num}','${data.functional_status}','${user_id}','${datetime}')`;
    var whr = null;
    var save_data = await db_Insert(table_name, fields, values, whr, 0);
  
    var soc_id = save_data.lastId.insertId;

    //   Save Data for Election Audit  
   var fields1 = `(soc_id,mgmt_status,officer_type,audit_upto,last_elec_date,tenure_ends_on,elec_due_date,contact_name,created_by,created_dt)`;
   var values1 =`('${soc_id}','${data.mgmt_status}','${data.officer_type}','${data.audit_upto}','${data.last_elec_date}','${data.tenure_ends_on}','${data.elec_due_date}','${data.contact_name}','${data.user_id}','${datetime}')`;
    var election_res = await db_Insert('td_election_details', fields1, values1, null, 0);

    const board_memb_id = data['board_memb_id[]'];
    const board_memb_name = data['board_memb_name[]'];
    const board_memb_desig = data['board_memb_desig[]'];
    const bm_contact_no = data['bm_contact_no[]'];

    for (let i = 0; i < board_memb_name.length; i++) {
      // Only process if board_memb_name is not empty
      if (board_memb_name[i].length > 0) {
          // Construct the values string for insertion
          const values = `('${soc_id}', '${board_memb_name[i]}', '${board_memb_desig[i]}','${bm_contact_no[i]}','${user_id}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`;
  
          if (board_memb_id[i] > 0) {
              // Update existing record
              const fields = `board_memb_name = '${board_memb_name[i]}', board_memb_desig = '${board_memb_desig[i]}',bm_contact_no = '${bm_contact_no[i]}', modified_by = '${user_id}', modified_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}'`;
              await db_Insert('td_board_member', fields, null, `board_memb_id = ${board_memb_id[i]}`, true);
          } else {
              // Insert new record
              const fields = '(`soc_id`, `board_memb_name`, `board_memb_desig`,`bm_contact_no`, `created_by`, `created_dt`)';
              await db_Insert('td_board_member', fields, values, null, false);
          }
      }
  }
     console.log(save_data.lastId.insertId);
      res.redirect("/dash/dashboard");
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('dashboard/edit', res_dt);
    }
})
SocietyRouter.get('/regauth',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    const contr_auth_type_id = req.query.contr_auth_type_id;
    // In a real application, you might query a database or perform other operations
    const contauthres = await db_Select('controlling_authority_id,controlling_authority_name', 'md_controlling_authority',  `contr_auth_type_id='${contr_auth_type_id}'`, null);
    const responseData = {
        contauthlist: contauthres.suc > 0 ? contauthres.msg : '', // Echoing the received claims
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
SocietyRouter.get('/ulblist',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    const ulb_catg = req.query.ulb_catg;
    const dist_code = req.query.dist_code;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select('ulb_id,ulb_name', 'md_ulb',  `ulb_catg_id='${ulb_catg}' AND dist_code='${dist_code}'`, null);
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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
SocietyRouter.get('/wardlist',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    const ulb_catg = req.query.ulb_catg;
    const ulb_id = req.query.ulb_id;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select('ward_id,ward_name', 'md_ward',  `ulb_catg_id='${ulb_catg}' AND ulb_id='${ulb_id}'`, null);
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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
SocietyRouter.get('/blocklist',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    const dist_code = req.query.dist_code;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select('block_id,block_name', 'md_block',  `dist_id='${dist_code}'`, null);
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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
SocietyRouter.get('/gplist',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    const block_id = req.query.block_id;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select('gp_id,gp_name', 'md_gp',  `block_id='${block_id}'`, null);
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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

SocietyRouter.get('/villlist',async(req,res)=>{
  try {
    // Extract query parameter 'claims'
    const block_id = req.query.block_id;
    const gp_id = req.query.gp_id;
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select('vill_id,vill_name', 'md_village',  `block_id='${block_id}' AND gp_id='${gp_id}'`, null);
    const responseData = {
      datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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
  SocietyRouter.get('/zonelist',async(req,res)=>{
    try {
      // Extract query parameter 'claims'
      const dist_code = req.query.dist_code;
      const datahres = await db_Select('a.zone_id,b.zone_name','md_range a,md_zone b',`a.zone_id= b.zone_id AND a.dist_id='${dist_code}'`, null);
      const responseData = {
        datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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
  SocietyRouter.get('/rangelist',async(req,res)=>{
    try {
      // Extract query parameter 'claims'
      const dist_code = req.query.dist_code;
      const datahres = await db_Select('range_id,range_name','md_range',`dist_id='${dist_code}'`, null);
      const responseData = {
        datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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
  SocietyRouter.get('/getsuggestions',async(req,res)=>{
    try {
      // Extract query parameter 'claims'
      const sugname = req.query.name;
      const range_id = req.session.user.range_id;
      if(range_id > 0){
        var datahres = await db_Select('cop_soc_name','md_society',`range_code='${range_id}' AND cop_soc_name LIKE '%${sugname.split("'").join("\\'")}%'`, null);
      }else{
        var datahres = await db_Select('cop_soc_name','md_society',`cop_soc_name LIKE '%${sugname.split("'").join("\\'")}%'`, null);
      }
      
      const responseData = {
        datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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

  SocietyRouter.get('/distlist',async(req,res)=>{
    try {
      // Extract query parameter 'claims'
      const zone_code = req.query.zone_code;
      const datahres = await db_Select('DISTINCT b.*','md_range a,md_district b',`a.dist_id = b.dist_code AND a.zone_id='${zone_code}'`, null);
      const responseData = {
        datahlist: datahres.suc > 0 ? datahres.msg : '', // Echoing the received claims
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

SocietyRouter.get('/modifiedlist', async(req, res) => {
    try {
        // Extract range_id from session
        const range_id = req.session.user.range_id;
        const select = "a.id,a.cop_soc_name,a.reg_no,a.functional_status,b.soc_type_name,c.dist_name,d.zone_name,e.range_name,f.soc_tier_name";
        if(range_id > 0){ 
        var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND a.range_code = "${range_id}" AND approve_status ='E' `;
         }else{
          var table_name = `md_society a LEFT JOIN md_society_type b ON a.soc_type = b.soc_type_id LEFT JOIN md_district c ON a.dist_code = c.dist_code LEFT JOIN md_zone d ON a.zone_code = d.zone_id LEFT JOIN md_range e ON a.range_code = e.range_id LEFT JOIN md_soc_tier f ON a.soc_tier = f.soc_tier_id WHERE a.functional_status='Functional' AND approve_status ='E'`;
         }
        whr = '';
        const order = null;
        if(range_id > 0){
            whr1 = `functional_status='Functional' AND range_code='${range_id}' AND approve_status ='E'`;
        }else{
          whr1 =`functional_status='Functional' AND approve_status ='E' `;
        }
       
        // Execute database query
        const result = await db_Select(select, table_name, whr, order);
        const select2 = "COUNT(*) as total";
        const countResult = await db_Select(select2, 'md_society', whr1, order);
        const total = countResult.msg[0].total;
        const totalPages = Math.ceil(total / 25);
      
        // Prepare data for rendering
        const res_dt = {
          data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages,
          cntr_auth_type:0,zone_code:0,dist_code:0,soc_tier:0,soc_type_id:0,range_code:0,urban_rural_flag:0,
          ulb_catg:0,block_id:0,total:total,socname:'',functional_status:'1'
        };
        // Render the view with data
        res.render('society/modified_list', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('society/modified_list', res_dt);
      }
})

  SocietyRouter.get('/approve', async(req, res) => {
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
      const typelist = await db_Select('*', 'md_society_type', null, null);
      const soctierres = await db_Select('*', 'md_soc_tier', null, null);
      const regauttypehres = await db_Select('*', 'md_controlling_authority_type', null, null);
      const regauthres = await db_Select('*', 'md_controlling_authority', null, null);
      const zoneres = await db_Select('*', 'md_zone', null, null);
      const distres = await db_Select('*', 'md_district', null, null);
      const distcode = result.msg[0].dist_code > 0 ? result.msg[0].dist_code : 0;
      const zone_id = result.msg[0].zone_code > 0 ? result.msg[0].zone_code : 0;
      const ranzeres = await db_Select('*', 'md_range', `dist_id='${distcode}'`, null);
        console.log(ranzeres);
      const ulbcatgres = await db_Select('*', 'md_ulb_catg', null, null);
      const ulbres = await db_Select('*', 'md_ulb', null, null);
      const managementres = await db_Select('*', 'md_management_status', null, null);
      const officertyperes = await db_Select('*', 'md_officer_type', null, null);
      const caseflagres = await db_Select('*', 'md_case_flag', null, null);
      const wardres = await db_Select('*', 'md_ward', null, null);
      const blockres = await db_Select('*', 'md_block',  `dist_id='${distcode}'`, null);
      const gpres = await db_Select('*', 'md_gp',  `dist_id='${distcode}'`, null);
      const villres = await db_Select('*', 'md_village',  `dist_id='${distcode}'`, null);
      const boardmembdtsl = await db_Select('*', 'td_board_member',  `soc_id='${soc_id}'`, null);
      
  
      // Prepare data for rendering
      const res_dt = {
        soc: result.suc > 0 ? result.msg[0] : '',soctypelist: typelist.suc > 0 ? typelist.msg : '',
        soctierlist: soctierres.suc > 0 ? soctierres.msg : '',regauthtypelist: regauttypehres.suc > 0 ? regauttypehres.msg : '',
        regauthlist: regauthres.suc > 0 ? regauthres.msg : '',moment: moment,
        zonelist: zoneres.suc > 0 ? zoneres.msg : '',districtlist: distres.suc > 0 ? distres.msg : '',
        ranzelist: ranzeres.suc > 0 ? ranzeres.msg : '',ulbcatglist: ulbcatgres.suc > 0 ? ulbcatgres.msg : '',
        ulblist: ulbres.suc > 0 ? ulbres.msg : '',managementlist: managementres.suc > 0 ? managementres.msg : '',
        officertypelist: officertyperes.suc > 0 ? officertyperes.msg : '',caseflaglist: caseflagres.suc > 0 ? caseflagres.msg : '',
        wardlist:wardres.suc > 0 ? wardres.msg : '',blocklist:blockres.suc > 0 ? blockres.msg : '',
        gplist:gpres.suc > 0 ? gpres.msg : '',villlist:villres.suc > 0 ? villres.msg : '',
        boardmembdlist: boardmembdtsl.suc > 0 ? boardmembdtsl.msg : '',
      };
      // Render the view with data
      res.render('society/approve', res_dt);
    } catch (error) {
      // Log the error and send an appropriate response
      console.error('Error during dashboard rendering:', error);
      //res.status(500).send('An error occurred while loading the dashboard.');
      res.render('dashboard/approve', res_dt);
    }
  })

  SocietyRouter.post('/approve', async(req, res) => {
    try {
        // Extract range_id from session
        var user_id = req.session.user.user_id;
        var date_ob = moment();
      // Format it as YYYY-MM-DD HH:mm:ss
        var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        var data = req.body;
        var table_name = "md_society";
      var values = null;
      
      var fields = `approve_status='A',approve_by='${user_id}',
      approve_dt = '${formattedDate}',approve_ip='${ip}' `;
      var whr = `id = '${data.id}'` ;
      var flag = 1;
      var save_data = await db_Insert(table_name, fields, values, whr, flag);
    
      
        req.flash('success_msg', 'Update successful!');
        res.redirect("/dash/dashboard");
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
        res.render('dashboard/edit', res_dt);
      }
  })
   
  // ********  Village Add code 
  SocietyRouter.get('/managevillage', async(req, res) => {
    try {
        // Extract range_id from session
        const distres = await db_Select('*', 'md_district', null, null);
        // Prepare data for rendering
        const res_dt = {
           moment: moment,
           districtlist: distres.suc > 0 ? distres.msg : '',
        };
        // Render the view with data
        res.render('village/manage_village', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
      }
  })
  SocietyRouter.post('/managevillage', async(req, res) => {
    try {
        // Extract range_id from session
        var data = req.body;
        var dist_id = data.dist_code, block = data.block_id,gp_id = data.gp_id;
        var whr =` AND a.dist_id = ${dist_id} AND a.block_id = ${block} AND a.gp_id = ${gp_id} `;
        const villlist = await db_Select('a.vill_id,a.vill_name,b.block_name,c.gp_name', `md_village a,md_block b,md_gp c where a.block_id=b.block_id AND a.gp_id =c.gp_id ${whr}`, null, null);
        const res_dt = {
          villlist: villlist.suc > 0 ? villlist.msg : '',
        };
        // Render the view with data
        res.render('village/list', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
      }
  })
  SocietyRouter.get('/addvillage', async(req, res) => {
    try {
        // Extract range_id from session
        const distres = await db_Select('*', 'md_district', null, null);
        // Prepare data for rendering
        const res_dt = {
           moment: moment,
           districtlist: distres.suc > 0 ? distres.msg : '',
        };
        // Render the view with data
        res.render('village/add', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
      }
  })
  SocietyRouter.get('/editvillage', async(req, res) => {
    try {
        // Extract range_id from session
        const distres = await db_Select('*', 'md_district', null, null);
        const id = req.query.id;
        // Prepare data for rendering
        var whr =` AND a.vill_id = ${id}`;
        var village = await db_Select('a.vill_id,a.dist_id,a.vill_name,b.block_name,c.gp_name', `md_village a,md_block b,md_gp c where a.block_id=b.block_id AND a.gp_id =c.gp_id ${whr}`,null, null);
        const res_dt = {
           moment: moment,
           districtlist: distres.suc > 0 ? distres.msg : '',
           villag: village.suc > 0 ? village.msg[0] : '',
        };
        // Render the view with data
        res.render('village/edit', res_dt);
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
      }
  })
  SocietyRouter.post('/editvillage', async(req, res) => {
    try {
        // Extract range_id from session
        var user_id = req.session.user.user_id;
        var date_ob = moment();
      // Format it as YYYY-MM-DD HH:mm:ss
        var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        var data = req.body;
        var table_name = "md_village";
      var values = null;
      
      var fields = `vill_name='${data.vill_name}',modified_by='${user_id}',
      modified_at = '${formattedDate}',modified_ip='${ip}' `;
      var whr = `vill_id = '${data.vill_id}'` ;
      var flag = 1;
      var save_data = await db_Insert(table_name, fields, values, whr, flag);
    
      
        req.flash('success_msg', 'Update successful!');
        res.redirect("/society/managevillage");
        // Render the view with data
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
      }
  })

  SocietyRouter.post('/villageadddata', async(req, res) => {
    try {
            var user_id = req.session.user.user_id;
            var date_ob = moment();
          // Format it as YYYY-MM-DD HH:mm:ss
            var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            var data = req.body;
            var table_name = "md_village";
          var values = `('${data.dist_code}','${data.block_id}','${data.gp_id}','${data.vill_name}','${user_id}','${formattedDate}')`;
          var fields = `(dist_id,block_id,gp_id,vill_name,created_by,created_at)`;
          var save_data = await db_Insert(table_name, fields, values, whr,0);
        
            req.flash('success_msg', 'Village Added successful!');
            res.redirect("/dash/dashboard");
      } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        //res.status(500).send('An error occurred while loading the dashboard.');
      }
  })

module.exports = {SocietyRouter}