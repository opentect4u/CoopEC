const LoginRouter = require("express").Router();
const bcrypt = require("bcrypt");

const { db_Select,db_Insert,db_Select_using_param } = require("../modules/MasterModule");

LoginRouter.get("/login", (req, res) => {
  res.render("login/login");
});

LoginRouter.post("/logincheck", async (req, res) => {
  var data = req.body,
    result;
  var select = "*",
    table_name = "md_user",
    // Use a placeholder for `user_id` in the `whr` clause
    whr = "user_id = ? AND user_status = ?",
    order = null;
  var params = [data.user_id, "A"];
  var res_dt = await db_Select_using_param(
    select,
    table_name,
    whr,
    order,
    params,
  );
  var captchaInput = req.body.captchaInput
  var captchaSto= req.body.captchaStored
       //req.session.captcha
       //console.log('dhdhdhdhhd');
      // console.log(captchaInput,captchaSto)
       //console.log('dhdhdhdhhd');
  // Pass user_id and 'A' (for active status) as parameters to bind to the placeholders
  if (captchaInput == captchaSto) {
 
  if (res_dt.suc > 0) {
        if (res_dt.msg.length > 0) {
            if (await bcrypt.compare(data.password, res_dt.msg[0].password)) {
              if (res_dt.msg[0].range_id > 0) {
                var range_dtl = await db_Select(
                  "range_name",
                  "md_range",
                  `range_id='${res_dt.msg[0].range_id}'`,
                  order,
                );
                //req.session.range_name_for_topbar = range_dtl.msg[0].range_name;
              } else {
                req.session.range_name_for_topbar = "Head Office";
              }
              const sessionId = req.sessionID;
              res_dt.msg[0]['session_version_id']= sessionId
              req.session.user = res_dt.msg[0];
              var save_data = await db_Insert("md_user", `session_version_id='${sessionId}'`, null, `user_id ='${data.user_id}'`, 1);
              res.redirect("/dashn/dash");
            } else {
              result = {
                suc: 0,
                msg: "Please check your userid or password",
                dt: res_dt,
              };
              // res.send(result)
              req.session.errorMsg = "Please check your userid or password";
              res.redirect(
                "/login?error=true&msg=Please check your userid or password",
              );
            }
          } else {
            //  result = { suc: 0, msg: "No data found", dt: res_dt };
            req.session.errorMsg = "Please check your userid or password";
            res.redirect(
              "/login?error=true&msg=Please check your userid or password",
            );
          }
      } else {
        // result = { suc: 0, msg: res_dt.msg, dt: res_dt };
        req.session.errorMsg = "Please check your userid or password";
        res.redirect("/login?error=true&msg=Please check your userid or password");
      }
    }else {
      res.redirect("/login?error=true&msg=CAPTCHA verification failed");
    }
  
});

module.exports = { LoginRouter };
