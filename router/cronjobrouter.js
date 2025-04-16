const Cronjobrouter = require("express").Router();
const moment = require("moment");
var request = require('request');
const { db_Select, db_Insert } = require("../modules/MasterModule");
const cron = require('node-cron');

// cron.schedule('* * * * *', async () => {
//   await sendElectionOTPs(6, 1); // example: every day at 10:00 AM
// });

// cron.schedule('0 18 * * *', () => {
//   console.log('🔔 Running job at 6:00 PM IST');
//   // Your function call here
// });
// cron.schedule('* * * * *', () => {
//   console.log('⏱ Running every minute (for testing)');
// });

Cronjobrouter.get("/get_society_ele_due_monthwise", async (req, res) => {
  var date_ob = moment();
  var formattedDate = date_ob.format("YYYY-MM-DD HH:mm:ss");
  try {
    // Extract query parameter 'claims'
    var month_interval = 1;
    const select = "cop_soc_name,range_code,tenure_ends_on";
    var table_name = `md_society a WHERE a.functional_status='Functional' AND a.approve_status = 'A' AND a.tenure_ends_on >= CURDATE() AND a.tenure_ends_on < DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) `;
    var res_dt = await db_Select(select, table_name, null, null);
    //  console.log(res_dt.msg);
    res_dt.msg.forEach(async (society) => {
      if (society.tenure_ends_on) {
        // Format the date as needed (using native Date object here)
        let formattedEndDate = new Date(society.tenure_ends_on)
          .toISOString()
          .split("T")[0]; // Format as YYYY-MM-DD
        let message = `${society.cop_soc_name} has an election on ${formattedEndDate}.`;
        // Define notification fields
        var noti_fields = `(type, message, wrk_releated_id, user_type, view_status, range_id, created_by, created_at, created_ip)`;
        let ip = "0.0.0.0"; // Assuming you're getting the IP from the request or environment
        // Insert data into td_notification
        var noti_values = `('SE', '${message}', '0', 'M', '1', '${society.range_code}', 'SYSTEM', '${formattedDate}', '${ip}')`;
        await db_Insert(
          "td_notification",
          noti_fields,
          noti_values,
          null,
          false,
        );
        var noti_values1 = `('SE', '${message}', '0', 'U', '1', '${society.range_code}', 'SYSTEM', '${formattedDate}', '${ip}')`;
        await db_Insert(
          "td_notification",
          noti_fields,
          noti_values1,
          null,
          false,
        );
        var noti_values2 = `('SE', '${message}', '0', 'A', '1', '${society.range_code}', 'SYSTEM', '${formattedDate}', '${ip}')`;
        await db_Insert(
          "td_notification",
          noti_fields,
          noti_values2,
          null,
          false,
        );
        var noti_values3 = `('SE', '${message}', '0', 'S', '1', '${society.range_code}', 'SYSTEM', '${formattedDate}', '${ip}')`;
        await db_Insert(
          "td_notification",
          noti_fields,
          noti_values3,
          null,
          false,
        );
        // console.log(`Notification for ${society.cop_soc_name} has been inserted.`);
      } else {
      }
    });
    // const responseData = {
    //   soctot: res_dt.suc > 0 ? res_dt.msg[0] : '', // Echoing the received claims
    // };
    // Send response back to the client
    res.json("ok");
  } catch (err) {
    console.error("Error handling /regauth request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

Cronjobrouter.get("/send_otp", async (req, res) => {
  // var month_interval = 6;
  // var ctr_auth_type = 1;
   var month_interval = req.query.month_interval;
   var ctr_auth_type = req.query.ctr_auth_type;
  
  const select = "cop_soc_name,range_code,tenure_ends_on,user_mobile";
  var table_name = `md_society a  JOIN md_user b ON a.range_code = b.range_id WHERE a.functional_status ='Functional' AND a.approve_status = 'A' AND a.approve_status = 'A' AND a.cntr_auth_type = b.cntr_auth_type AND b.cntr_auth_type = ${ctr_auth_type} AND b.user_type = 'M' AND b.user_status ='A' AND a.tenure_ends_on = DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH) `;
  var res_dt = await db_Select(select, table_name, null, null);
  const data = res_dt.msg; //  this is your actual result array

  if (!Array.isArray(data) || data.length === 0) {
    return res.send({ suc: 0, msg: 'No records found' });
  }
  let sentResults = [];
  for (const row of data) {
    let to = row.user_mobile.toString();
      to = to.length > 10 ? to.slice(-10) : to
      var otp = Math.floor(1000 + Math.random() * 9000);
      const cop_name = row.cop_soc_name.slice(0, 30);
      const exp_date = moment(row.tenure_ends_on).format('YYYY-MM-DD');
       if(to.length == 10) {
            var text = `Due date of election of ${cop_name} Coop. Society will be expired on ${exp_date}. Necessary measures be taken. -Cooperation Department Govt. Of WB (CEC).`;
            
          //console.log('Election OTP: ', to, otp,text);
              var options = {
                'method': 'GET',
                'url': `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to.split(' ').join('')}&text=${text}`,
                'headers': {
                }
              };
              //res.send({ suc: 1, msg: 'Otp Not Sent', otp })
            request(options, function (error, response) {
              if (error) {
                console.log(err);
                //res.send({ suc: 0, msg: 'Otp Not Sent', otp })
                sentResults.push({ to, status: 'failed', otp });
              }
              else {
                console.log('OTP Console', response.body, otp);
              //  res.send({ suc: 1, msg: 'Otp Sent', otp })
                sentResults.push({ to, status: 'sent', otp });
              }
            });
         }
    };
    res.send({ suc: 1, msg: 'SMS sending completed', results: sentResults });

})

async function sendElectionOTPs(month_interval, ctr_auth_type) {
  const select = "cop_soc_name,range_code,tenure_ends_on,user_mobile";
  const table_name = `
    md_society a 
    JOIN md_user b ON a.range_code = b.range_id 
    WHERE 
      a.functional_status = 'Functional' AND 
      a.approve_status = 'A' AND 
      a.cntr_auth_type = b.cntr_auth_type AND 
      b.cntr_auth_type = ${ctr_auth_type} AND 
      b.user_type = 'M' AND 
      b.user_status = 'A' AND 
      a.tenure_ends_on = DATE_ADD(CURDATE(), INTERVAL ${month_interval} MONTH)
  `;

  const res_dt = await db_Select(select, table_name, null, null);
  const data = res_dt.msg;

  if (!Array.isArray(data) || data.length === 0) {
    return { suc: 0, msg: 'No records found', results: [] };
  }

  let sentResults = [];

  for (const row of data) {
    let to = row.user_mobile.toString().slice(-10);
    let otp = Math.floor(1000 + Math.random() * 9000);
    const cop_name = row.cop_soc_name.slice(0, 30);
    const exp_date = moment(row.tenure_ends_on).format('YYYY-MM-DD');

    if (to.length === 10) {
      const text = `Due date of election of ${cop_name} Coop. Society will be expired on ${exp_date}. Necessary measures be taken. -Cooperation Department Govt. Of WB (CEC).`;

      const options = {
        method: 'GET',
        url: `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to}&text=${text}`,
        headers: {}
      };

      await new Promise((resolve) => {
        request(options, function (error, response) {
          if (error) {
            console.log('SMS Error:', error);
            sentResults.push({ to, status: 'failed', otp });
          } else {
            console.log('SMS Sent:', response.body);
            sentResults.push({ to, status: 'sent', otp });
          }
          resolve();
        });
      });
    }
  }

  return { suc: 1, msg: 'SMS sending completed', results: sentResults };
}

module.exports = { Cronjobrouter };
