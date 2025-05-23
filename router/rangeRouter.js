const rangeRouter = require('express').Router()
const ExcelJS = require('exceljs');
const requestIp = require('request-ip');
const moment = require('moment');
const {db_Select,db_Insert} = require('../modules/MasterModule');
rangeRouter.use((req, res, next) => {
    var user = req.session.user;
    if (!user) {
      res.redirect("/login");
    } else {
      next();
    }
});
    ////     ********  Code start for User Management      *******   /// 
    rangeRouter.get('/rangedtllist', async(req, res) => {
        try {
          const range_id = req.session.user.range_id;
          //  const suc_msg = req.flash('success_msg') ;
            if(range_id > 0){ 
               var table = `td_range_detail a JOIN md_range b ON a.range_id = b.range_id AND a.range_id='${range_id}'`;
            }else{
              var table = `td_range_detail a LEFT JOIN md_range b ON a.range_id = b.range_id `;
            }
            const faqllist = await db_Select('a.*,b.range_name', table, null, null);
            // Prepare data for rendering
            const res_dt = {
              data:faqllist.suc > 0 ? faqllist.msg : '',
            };
            res.render('range_detail/list',res_dt);
          } catch (error) {
            // Log the error and send an appropriate response
            console.error('Error during dashboard rendering:', error);
            //res.status(500).send('An error occurred while loading the dashboard.');
            res.render('range_detail/list');
          }
    })
    rangeRouter.get('/addrangedtl', async(req, res) => {
    try {
        var ranze = await db_Select('*', 'md_range', null, null);
        var cnt_type = await db_Select('*', 'md_controlling_authority_type', null, null);
        const res_dt = {
            data:ranze.suc > 0 ? ranze.msg : '',cnt_type:cnt_type.suc > 0 ? cnt_type.msg : ''
        };
        res.render('range_detail/add',res_dt);
        } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        }
    })
    rangeRouter.post('/saverangedtl', async(req, res) => {
    try {
        var data = req.body;
        var user = req.session.user;
        var date_ob = moment();
        var formattedDate = date_ob.format('YYYY-MM-DD HH:mm:ss');
        var ipresult = '0.0.0.0';
        var ip = ipresult.ipdata;
         var range_id =  req.session.user.range_id;
        var values = `('${range_id}','${data.address}','${data.range_email}','${data.range_email}','${data.contact_no}','${data.ro_name}',,'${data.ro_contact}','${formattedDate}','${user.user_id}','${ip}')`
        
        var table_name = "td_range_detail";
        var fields = data.id > 0 ? `address = '${data.address}',range_email = '${data.range_email}',contact_no = '${data.contact_no}',ro_name = '${data.ro_name}',ro_contact='${data.ro_contact}',modified_by='${user.user_id}',modified_dt='${formattedDate}',modified_ip = '${ip}' ` :`(range_id,address,range_email,contact_no,ro_name,ro_contact,created_by,created_at,created_ip)`;
        var whr = `id = '${data.id}'` ;
        var flag = data.id > 0 ? 1 : 0;
        var save_data = await db_Insert(table_name, fields, values, whr, flag);
        res.redirect("/rangeR/rangedtllist");
    } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
    }
    })
    rangeRouter.get('/editrangedtl', async(req, res) => {
        var id = req.query.id;
        try {
          var ranze = await db_Select('*', 'md_range', null, null);
          var rdtls = await db_Select('*', 'td_range_detail', `id='${id}'`, null);
            const res_dt = {
              data:ranze.suc > 0 ? ranze.msg : '',rdtl: rdtls.suc > 0 ? rdtls.msg[0] : ''
            };
            res.render('range_detail/edit',res_dt);
          } catch (error) {
            // Log the error and send an appropriate response
            console.error('Error during dashboard rendering:', error);
          }
    })
    rangeRouter.get('/deluser', async(req, res) => {
    try {
        var data = req.body;
        var id = req.query.id,where=`id = '${id}' `;
        var res_dt = await db_Delete("td_faq", where);
        res.redirect("/wdtls/faqlist");
    } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error during dashboard rendering:', error);
        res.redirect("/wdtls/faqlist");
    }
    })
        ////     ********  Code End for User Management      *******   /// 
module.exports = {rangeRouter}