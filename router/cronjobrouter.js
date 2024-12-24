const Cronjobrouter = require("express").Router();
const moment = require("moment");
const { db_Select, db_Insert } = require("../modules/MasterModule");

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

module.exports = { Cronjobrouter };
