const Cronjobrouter = require("express").Router();
const moment = require("moment");
var request = require('request');
const { db_Select, db_Insert } = require("../modules/MasterModule");
const cron = require('node-cron');


cron.schedule('0 8 1 * *', async () => {
  await sendElectionOTPs(3, 1); //  1st day of every month at 6:00 AM.
});

cron.schedule('0 9 1 * *', async () => {
  await sendElectionOTPsdist(3, 1); //  1st day of every month at 6:00 AM.
});


cron.schedule('0 9 2 * *', async () => {
  console.log('Running SMS job on the 2nd day of the month at 9:00 AM');
  await sendElectionpassedsmsrange();
});

cron.schedule('0 9 3 * *', async () => {
  console.log('Running SMS job on the 2nd day of the month at 9:00 AM');
  await sendElectionpassedsmsdist();
});


// cron.schedule('0 18 * * *', () => {
//   console.log('🔔 Running job at 6:00 PM IST');
//   // Your function call here
// });
// cron.schedule('* * * * *', () => {
//   console.log('⏱ Running every minute (for testing)');
// });


async function sendElectionOTPs(month_interval, ctr_auth_type) {
  const select = "a.cop_soc_name,a.range_code,a.tenure_ends_on,b.user_mobile";
 
    const table_name = `
    md_society a 
    JOIN md_user b ON a.range_code = b.range_id 
    WHERE 
      a.functional_status = 'Functional' AND 
      a.approve_status = 'A' AND 
      a.cntr_auth_type = b.cntr_auth_type AND 
      b.user_type = 'M' AND 
      b.user_status = 'A' AND
      b.user_mobile IS NOT NULL AND 
      a.tenure_ends_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
      ORDER BY a.tenure_ends_on`;

  
  const res_dt = await db_Select(select, table_name, null, null);
  const data = res_dt.msg;
 
  if (!Array.isArray(data) || data.length === 0) {
    return { suc: 0, msg: 'No records found', results: [] };
  }

  let sentResults = [];

  for (const row of data) {
    let to = row.user_mobile.toString().slice(-10);
    //let to = '7596067176';
    let otp = Math.floor(1000 + Math.random() * 9000);
    const cop_name = row.cop_soc_name.slice(0, 30);
    const exp_date = moment(row.tenure_ends_on).format('YYYY-MM-DD');
    //console.log('loop');
    if (to.length == 10) {
     // console.log('ok');
      const text = `Due date of election of ${cop_name} Coop. Society will be expired on ${exp_date}. Necessary measures be taken. -Cooperation Department Govt. Of WB (CEC).`;

      const options = {
        method: 'GET',
        url: `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to}&text=${text}`,
        headers: {}
      };
      //console.log(options);
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

async function sendElectionOTPsdist() {
  const select = "a.cop_soc_name,a.range_code,a.tenure_ends_on,b.user_mobile";
 
    const table_name = `
    md_society a 
    INNER JOIN md_user b ON a.dist_code = b.range_id 
    WHERE 
      a.functional_status = 'Functional' AND 
      a.approve_status = 'A' AND 
      b.user_type = 'M' AND 
      b.user_status = 'A' AND
      b.user_mobile IS NOT NULL AND 
      a.tenure_ends_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
      ORDER BY a.tenure_ends_on`;

  
  const res_dt = await db_Select(select, table_name, null, null);
  const data = res_dt.msg;
 
  if (!Array.isArray(data) || data.length === 0) {
    return { suc: 0, msg: 'No records found', results: [] };
  }

  let sentResults = [];

  for (const row of data) {
    let to = row.user_mobile.toString().slice(-10);
    //let to = '7596067176';
    let otp = Math.floor(1000 + Math.random() * 9000);
    const cop_name = row.cop_soc_name.slice(0, 30);
    const exp_date = moment(row.tenure_ends_on).format('YYYY-MM-DD');
    //console.log('loop');
    if (to.length == 10) {
     // console.log('ok');
      const text = `Due date of election of ${cop_name} Coop. Society will be expired on ${exp_date}. Necessary measures be taken. -Cooperation Department Govt. Of WB (CEC).`;

      const options = {
        method: 'GET',
        url: `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to}&text=${text}`,
        headers: {}
      };
      //console.log(options);
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

async function sendElectionpassedsmsrange() {
  const select = "a.id,a.cop_soc_name,a.range_code,a.tenure_ends_on,b.user_mobile";
  
    const table_name = `
    md_society a 
    JOIN md_user b ON a.range_code = b.range_id 
    LEFT JOIN td_sms_send s ON a.id = s.soc_id 
    WHERE 
      s.soc_id IS NULL AND
      a.functional_status = 'Functional' AND 
      a.approve_status = 'A' AND 
      a.cntr_auth_type = b.cntr_auth_type AND 
      b.user_type = 'M' AND 
      b.user_status = 'A' AND
      b.user_mobile IS NOT NULL AND 
      a.election_status='DUE' AND 
      a.elec_due_date <= CURDATE() AND a.elec_due_date > '2025-01-01'
      ORDER BY a.tenure_ends_on`;
  
  const res_dt = await db_Select(select, table_name, null, null);
  const data = res_dt.msg;
 
  if (!Array.isArray(data) || data.length === 0) {
    return { suc: 0, msg: 'No records found', results: [] };
  }

  let sentResults = [];

  for (const row of data) {
    let to = row.user_mobile.toString().slice(-10);
    //let to = '9831887194';
    let otp = Math.floor(1000 + Math.random() * 9000);
    const cop_name = row.cop_soc_name.slice(0, 30);
    const exp_date = moment(row.tenure_ends_on).format('YYYY-MM-DD');
    //console.log('loop');
    if (to.length == 10) {
       
     // console.log('ok');
      const text = `Due date of Election of ${cop_name} Coop. Society has been expired on ${exp_date}. Report of election be uploaded, Please ignore if already done. -Cooperation Department Govt. Of WB (CEC).`;

      const options = {
        method: 'GET',
        url: `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to}&text=${text}`,
        headers: {}
      };
 
      const send_date = moment().format('YYYY-MM-DD');

      var fields = `(sms_send_date,soc_id)`;
      var values = `('${send_date}','${row.id}')`;
      var save_data = await db_Insert("td_sms_send", fields, values, null, 0);
      console.log(options);
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

async function sendElectionpassedsmsdist() {
  const select = "a.id,a.cop_soc_name,a.range_code,a.tenure_ends_on,b.user_mobile";
  
    const table_name = `
    md_society a 
    INNER JOIN md_user b ON a.dist_code = b.range_id 
    LEFT JOIN td_sms_send s ON a.id = s.soc_id 
    WHERE 
      s.soc_id IS NULL AND
      a.functional_status = 'Functional' AND 
      a.approve_status = 'A' AND 
      b.user_type = 'M' AND 
      b.user_status = 'A' AND
      b.user_mobile IS NOT NULL AND 
      a.election_status='DUE' AND 
      a.elec_due_date <= CURDATE() AND a.elec_due_date > '2025-01-01'
      ORDER BY a.tenure_ends_on`;
  
  const res_dt = await db_Select(select, table_name, null, null);
  const data = res_dt.msg;
 
  if (!Array.isArray(data) || data.length === 0) {
    return { suc: 0, msg: 'No records found', results: [] };
  }

  let sentResults = [];

  for (const row of data) {
    let to = row.user_mobile.toString().slice(-10);
    //let to = '9831887194';
    let otp = Math.floor(1000 + Math.random() * 9000);
    const cop_name = row.cop_soc_name.slice(0, 30);
    const exp_date = moment(row.tenure_ends_on).format('YYYY-MM-DD');
    //console.log('loop');
    if (to.length == 10) {
       
     // console.log('ok');
      const text = `Due date of Election of ${cop_name} Coop. Society has been expired on ${exp_date}. Report of election be uploaded, Please ignore if already done. -Cooperation Department Govt. Of WB (CEC).`;

      const options = {
        method: 'GET',
        url: `http://sms.synergicapi.in/api.php?username=COOPWB&apikey=InkZ4tA7r4ve&senderid=COOPWB&route=OTP&mobile=${to}&text=${text}`,
        headers: {}
      };
 
      const send_date = moment().format('YYYY-MM-DD');

      var fields = `(sms_send_date,soc_id)`;
      var values = `('${send_date}','${row.id}')`;
      var save_data = await db_Insert("td_sms_send", fields, values, null, 0);
      console.log(options);
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
