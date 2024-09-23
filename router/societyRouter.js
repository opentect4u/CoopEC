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
        const ranzeres = await db_Select('*', 'md_range', `dist_id='${distcode}' AND zone_id ='${zone_id}'`, null);
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
      var data = req.body;
      var table_name = "md_society";
    var values = null;
    var fields = `cop_soc_name = '${data.cop_soc_name}',reg_no = '${data.reg_no}',reg_date = '${data.reg_date}',soc_tier = '${data.soc_tier}',
    soc_type = '${data.soc_type}',cntr_auth_type='${data.cntr_auth_type}',cntr_auth='${data.cntr_auth}',
    ulb_catg = '${data.ulb_catg}',ulb_id = '${data.ulb_id}',ward_no = '${data.ward_no}',pin_no = '${data.pin_no}',range_code = '${data.range_code}',
    urban_rural_flag ='${data.urban_rural_flag}',
    block_id = '${data.block_id}',gp_id = '${data.gp_id}',vill_id = '${data.vill_id}',address='${data.address}',audit_upto='${data.audit_upto}',
    mgmt_status = '${data.mgmt_status}',officer_type = '${data.officer_type}',last_elec_date = '${data.last_elec_date}',
    elec_due_date = '${data.elec_due_date}',contact_name='${data.contact_name}',contact_designation='${data.contact_designation}',
    contact_number = '${data.contact_number}',email = '${data.email}',case_id='${data.case_id}' `;
    var whr = `id = '${data.id}'` ;
    var flag = 1;
    var save_data = await db_Insert(table_name, fields, values, whr, flag);
  
   
    const board_memb_id = data['board_memb_id[]'];
    const board_memb_name = data['board_memb_name[]'];
    const board_memb_desig = data['board_memb_desig[]'];

    for (let i = 0; i < board_memb_name.length; i++) {
      // Only process if board_memb_name is not empty
      if (board_memb_name[i].length > 0) {
          // Construct the values string for insertion
          const values = `('${data.id}', '${board_memb_name[i]}', '${board_memb_desig[i]}', '${user_id}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`;
  
          if (board_memb_id[i] > 0) {
              // Update existing record
              const fields = `board_memb_name = '${board_memb_name[i]}', board_memb_desig = '${board_memb_desig[i]}', modified_by = '${user_id}', modified_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}'`;
              await db_Insert('td_board_member', fields, null, `board_memb_id = ${board_memb_id[i]}`, true);
          } else {
              // Insert new record
              const fields = '(`soc_id`, `board_memb_name`, `board_memb_desig`, `created_by`, `created_dt`)';
              await db_Insert('td_board_member', fields, values, null, false);
          }
      }
  }
     console.log(data);
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
    // In a real application, you might query a database or perform other operations
    const datahres = await db_Select('ulb_id,ulb_name', 'md_ulb',  `ulb_catg_id='${ulb_catg}'`, null);
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
      const datahres = await db_Select('cop_soc_name','md_society',`cop_soc_name LIKE '%${sugname}%'`, null);
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

  


  



module.exports = {SocietyRouter}