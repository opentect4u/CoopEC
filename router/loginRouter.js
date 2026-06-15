const LoginRouter = require("express").Router();
const request = require("request");
const bcrypt = require("bcrypt");
const moment = require("moment");
const {
  db_Select,
  db_Insert,
  db_Select_using_param,
} = require("../modules/MasterModule");

LoginRouter.get("/login", (req, res) => {
  res.render("login/login");
});

LoginRouter.post("/logincheck", async (req, res) => {
  var data = req.body,
    result;
  var ip = req.clientIp;
  var date_ob = moment();
  var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
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
  var captchaInput = req.body.captchaInput;
  // Pass user_id and 'A' (for active status) as parameters to bind to the placeholders
  if (captchaInput == req.session.captcha) {
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
          res_dt.msg[0]["session_version_id"] = sessionId;
          req.session.user = res_dt.msg[0];
          var save_data = await db_Insert(
            "md_user",
            `session_version_id='${sessionId}'`,
            null,
            `user_id ='${data.user_id}'`,
            1,
          );
          var logfields = `(operation_unique_id,operation_type,operation_module,operation,created_by,created_at,created_ip)`;
          var logvalues = `('${sessionId}','L','U','Login','${data.user_id}','${formattedDate}','${ip}')`;
          var save_log = await db_Insert(
            "td_log",
            logfields,
            logvalues,
            null,
            0,
          );
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
      res.redirect(
        "/login?error=true&msg=Please check your userid or password",
      );
    }
  } else {
    res.redirect("/login?error=true&msg=CAPTCHA verification failed");
  }
});

//  Code for Sending OTP for Register Email for Forgot Password
LoginRouter.post("/generate-otp", async (req, res) => {
  const { user_id } = req.body;
  const result = await generate_otp(user_id);
  res.json(result);
});
async function generate_otp(user_id) {
  console.log("Generating OTP for user_id:", user_id);
  const select = "user_mobile";
  const table_name = `md_user`;
  const whr = `user_id='${user_id}' AND user_status='A'`;
  const res_dt = await db_Select(select, table_name, whr, null);

  if (!res_dt.msg || res_dt.msg.length === 0) {
    return {
      suc: 0,
      msg: "No User found",
      results: [],
    };
  }
  const data = res_dt.msg[0];

  if (!data.user_mobile) {
    return {
      suc: 0,
      msg: "Mobile number not available for this user",
      results: [],
    };
  }
  let sentResults = [];
  let to = data.user_mobile.toString().slice(-10);
  let otp = Math.floor(1000 + Math.random() * 9000);

  var fields = `reset_otp='${otp}',otp_expiry=DATE_ADD(NOW(), INTERVAL 10 MINUTE)`;
  var sa_data = await db_Insert(table_name, fields, null, whr, 1);

  if (to.length == 10) {
    console.log("Sending OTP to:", to);
    const text = `OTP for mobile verification is ${otp}. This code is valid for 10 minutes. Please do not share this OTP with anyone. -Cooperation Department Govt. Of WB.`;
    const options = {
      method: "GET",
      url: `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to}&text=${text}`,
      headers: {},
    };
    //console.log(options);
    await new Promise((resolve) => {
      request(options, function (error, response) {
        if (error) {
          console.log("SMS Error:", error);
          sentResults.push({ status: "failed" });
        } else {
          console.log("SMS Sent:", response.body);
          sentResults.push({ status: "sent" });
        }
        resolve();
      });
    });
  }

  return { suc: 1, msg: "SMS sending completed", results: sentResults };
}

LoginRouter.post("/verify-otp", async (req, res) => {
  try {
    const { user_id, otp } = req.body;

    const table_name = "md_user";

    const whr = `
            user_id='${user_id}'
            AND reset_otp='${otp}'
            AND otp_expiry > NOW()
            AND user_status='A'
        `;

    const res_dt = await db_Select("*", table_name, whr, null);

    if (res_dt.msg && res_dt.msg.length > 0) {
      return res.json({
        success: true,
        message: "OTP Verified",
      });
    }

    return res.json({
      success: false,
      message: "Invalid or Expired OTP",
    });
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = { LoginRouter };
