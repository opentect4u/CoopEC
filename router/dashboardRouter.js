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
        const whr = `a.soc_type=b.soc_type_id AND a.range_code='${range_id}' LIMIT 10`;
        const order = null;
       // const total = countResult[0].total;
    //    const totalPages = Math.ceil(total / limit);
        // Execute database query
        const result = await db_Select(select, table_name, whr, order);

        const select2 = "COUNT(*) as total";
        const countResult = await db_Select(select2, table_name, whr, order);
      
          const total = countResult.msg[0].total;
         const totalPages = Math.ceil(total / 10);
        // Prepare data for rendering
        const res_dt = {
          data: result.suc > 0 ? result.msg : '',page: 1,totalPages:totalPages
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
// DashboardRouter.get('/dashboard', async(req, res) => {
//   try {
//       // Extract range_id from session
//       const range_id = req.session.user.range_id;
//       const select = "a.id,a.cop_soc_name,a.reg_no,b.soc_type_name";
//       const table_name = "md_society a,md_society_type b";
//       const whr = `a.soc_type=b.soc_type_id AND a.range_code='${range_id}'`;
//       const order = null;
      
//       // Execute database query
//       const result = await db_Select(select, table_name, whr, order);
      
//       // Prepare data for rendering
//       const res_dt = {
//         data: result.suc > 0 ? result.msg : '',page: 1
//       };
//       // Render the view with data
//       res.render('dashboard/landing', res_dt);
//     } catch (error) {
//       // Log the error and send an appropriate response
//       console.error('Error during dashboard rendering:', error);
//       //res.status(500).send('An error occurred while loading the dashboard.');
//       res.render('dashboard/landing', res_dt);
//     }
// })

DashboardRouter.get('/socLimitList',async(req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

     const sql = 'SELECT * FROM items LIMIT ? OFFSET ?';
      const range_id = req.session.user.range_id;
      const select = "a.id,a.cop_soc_name,a.reg_no,b.soc_type_name";
      const table_name = "md_society a,md_society_type b";
      const whr = `a.soc_type=b.soc_type_id AND a.range_code='${range_id}' LIMIT ${offset} , ${limit}`;
      const order = null;
     
      const select2 = "COUNT(*) as total";
      const countResult = await db_Select(select2, table_name,` a.soc_type=b.soc_type_id AND a.range_code='${range_id}'`, order);
    
        const total = countResult.msg[0].total;
       const totalPages = Math.ceil(total / 10);
      // Execute database query
     const result = await db_Select(select, table_name, whr, order);
     res.json({ data: result.suc > 0 ? result.msg : '', page,totalPages:totalPages });

});

module.exports = {DashboardRouter}