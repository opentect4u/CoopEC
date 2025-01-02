const db = require("../db/db");
// const dateFormat = require("dateformat");

const db_Select_using_param = (select, table_name, whr, order, params = []) => {
  let tb_whr = whr ? `WHERE ${whr}` : ""; // Don't insert user input directly into SQL
  let tb_order = order ? order : ""; // Same with order

  // Prepare the SQL query with placeholders
  let sql = `SELECT ${select} FROM ${table_name} ${tb_whr} ${tb_order}`;
  console.log(sql);

  // Return a promise for query execution
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      // Pass parameters here
      let data;
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result, sql };
      }
      resolve(data);
    });
  });
};

const db_Select = (select, table_name, whr, order) => {
  var tb_whr = whr ? `WHERE ${whr}` : "";
  var tb_order = order ? order : "";
  let sql = `SELECT ${select} FROM ${table_name} ${tb_whr} ${tb_order}`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result, sql };
      }
      resolve(data);
    });
  });
};

const db_Insert = (table_name, fields, values, whr, flag) => {
  var sql = "",
    msg = "",
    tb_whr = whr ? `WHERE ${whr}` : "";
  // 0 -> INSERT; 1 -> UPDATE
  // IN INSERT flieds ARE TABLE COLOUMN NAME ONLY || IN UPDATE fields ARE TABLE NAME = VALUES
  if (flag > 0) {
    sql = `UPDATE ${table_name} SET ${fields} ${tb_whr}`;
    msg = "Updated Successfully !!";
  } else {
    sql = `INSERT INTO ${table_name} ${fields} VALUES ${values}`;
    msg = "Inserted Successfully !!";
  }
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, lastId) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: msg, lastId };
      }
      resolve(data);
    });
  });
};

const db_Delete = (table_name, whr) => {
  whr = whr ? `WHERE ${whr}` : "";
  var sql = `DELETE FROM ${table_name} ${whr}`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, lastId) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: "Deleted Successfully !!" };
      }
      resolve(data);
    });
  });
};

const db_Check = async (fields, table_name, whr) => {
  var sql = `SELECT ${fields} FROM ${table_name} WHERE ${whr}`;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result.length };
      }
      resolve(data);
    });
  });
};

const SendNotification = async (range_id, user_type) => {
  if (user_type == "M") {
    var sql = `SELECT a.*, b.slug, b.method_ FROM td_notification a LEFT JOIN md_slug b ON a.type = b.noti_type WHERE a.range_id = '${range_id}' AND a.user_type ='M' AND a.type IN('S','V','SE') order by created_at desc`;
  } else if (user_type == "S") {
    var sql = `SELECT a.*, b.slug, b.method_ FROM td_notification a LEFT JOIN md_slug b ON a.type = b.noti_type WHERE a.view_status = 1 AND a.user_type ='S' AND a.type IN('D','G','F','SE') order by created_at desc`;
  } else if (user_type == "A") {
    var sql = `SELECT a.*, b.slug, b.method_ FROM td_notification a LEFT JOIN md_slug b ON a.type = b.noti_type WHERE a.view_status = 1 AND a.user_type ='A' AND a.type IN('SE') order by created_at desc`;
  } else if (user_type == "U") {
    var sql = `SELECT a.*, b.slug, b.method_ FROM td_notification a LEFT JOIN md_slug b ON a.type = b.noti_type WHERE a.range_id = '${range_id}' AND a.view_status = 1 AND a.user_type ='U' AND a.type IN('SE') order by created_at desc`;
  }

  console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result };
      }
      resolve(data);
    });
  });
};
const Notification_cnt = async () => {
  var sql = `SELECT * FROM td_notification`;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result.length };
      }
      resolve(data);
    });
  });
};
const UpdateNotification = async (range_id, user_type) => {
  var sql = `UPDATE td_notification set view_status = 0 WHERE range_id = '${range_id}' AND user_type ='${user_type}' `;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result.length };
      }
      resolve(data);
    });
  });
};

module.exports = {
  db_Select,
  db_Insert,
  db_Delete,
  db_Check,
  SendNotification,
  Notification_cnt,
  UpdateNotification,
  db_Select_using_param,
};
