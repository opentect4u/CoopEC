const LoginRouter = require('express').Router()
const bcrypt = require('bcrypt');

const {db_Select} = require('../modules/MasterModule');

LoginRouter.get('/login', (req, res) => {
    res.render('login/login')
})

LoginRouter.post('/logincheck', async(req, res) => {
    var data = req.body,result ;
        var select = "*",table_name = "md_user",
          whr = `user_id='${data.user_id}' `,
          order = null;
        var res_dt = await db_Select(select, table_name, whr, order);
        if (res_dt.suc > 0) {
          if (res_dt.msg.length > 0) {
            if (await bcrypt.compare(data.password, res_dt.msg[0].password)) {
                req.session.user = res_dt.msg[0];
            
              res.redirect("/dashboard");
            } else {
              result = {
                suc: 0,
                msg: "Please check your userid or password",
                dt: res_dt
              };
              // res.send(result)
              res.redirect("/login");
            }
          } else {
            result = { suc: 0, msg: "No data found", dt: res_dt };
            // res.send(result)
            res.redirect("/login");
          }
        } else {
          result = { suc: 0, msg: res_dt.msg, dt: res_dt };
          // res.send(result)
          res.redirect("/login");
        }
    //res.redirect('/dashboard')
})

module.exports = {LoginRouter}