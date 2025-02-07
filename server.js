const express = require("express"),
  session = require("express-session"),
  app = express(),
  expressLayouts = require("express-ejs-layouts"),
  path = require("path"),
  https = require("http"),
  fs = require("fs"),
  cors = require("cors"),
  port = process.env.PORT || 3013;
const flash = require("connect-flash");
//const svgCaptcha = require('svg-captcha');
const socketIo = require("socket.io");
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up the session middleware
app.use(
  session({
    secret: "WB_CB_ELE_COMM", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  }),
);
var server = https.createServer(app);
const {
  SendNotification,
  Notification_cnt,
  UpdateNotification,
} = require("./modules/MasterModule");
const io = socketIo(server);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.range_name_for_topbar =
    req.session.range_name_for_topbar || "Head Office";
  res.locals.path = req.path;
  res.locals.message = req.session.message;

  //   Code for Flash Message
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  req.io = io;
  delete req.session.message;

  next();
});

const { DashboardRouter } = require("./router/dashboardRouter");
const { DashboardnRouter } = require("./router/dashboardnRouter");
const { LoginRouter } = require("./router/loginRouter");
const { SocietyRouter } = require("./router/societyRouter");
const { WapiRouter } = require("./router/WapiRouter");
const { WdtlsRouter } = require("./router/WdtlsRouter");
const { reportRouter } = require("./router/reportRouter");
const { Cronjobrouter } = require("./router/cronjobrouter");
const { rangeRouter } = require("./router/rangeRouter");

app.use("/login", LoginRouter);
app.use("/dash", DashboardRouter);
app.use("/dashn", DashboardnRouter);
app.use("/society", SocietyRouter);
app.use("/wapi", WapiRouter);
app.use("/wdtls", WdtlsRouter);
app.use("/report", reportRouter);
app.use("/crn", Cronjobrouter);
app.use("/rangeR", rangeRouter);

// app.get("/", async (req, res) => {
//   const captcha = svgCaptcha.create();
//   // Store the CAPTCHA text in a session or a temporary store for verification later
//   req.session.captcha = captcha.text; 
//   res.type('svg');
  
//   const res_dt = {captcha : captcha.data}
//   res.redirect("/login",res_dt);
// });
// app.get('/captcha', (req, res) => {
//   const captcha = svgCaptcha.create();
//   // Store the CAPTCHA text in a session or a temporary store for verification later
//   req.session.captcha = captcha.text; 
//   res.type('svg');
//   res.send(captcha.data);
// });
app.get("/dashboard", async (req, res) => {
  var res_dt = {
    user_data: req.session.user,
  };
  var user = req.session.user;

  if (user) {
    // res.render("dashboard/landing",res_dt);
    res.redirect("dash/dashboard");
  } else {
    res.redirect("/login");
  }
});
// app.get("/login", (req, res) => {
//   const captcha = svgCaptcha.create();
//   // Store the CAPTCHA text in a session or a temporary store for verification later
//   req.session.captcha = captcha.text; 
//   res.type('svg');
  
//   const res_dt = {captcha : captcha.data}
//   res.render("login/login",res_dt);
// });
function generateCaptcha() {
  const length = 5;  // Length of CAPTCHA
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Letters and Numbers
  let captcha = '';

  // Ensure that the CAPTCHA has at least one letter
  let hasLetter = false;

  // Generate the CAPTCHA
  for (let i = 0; i < length; i++) {
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    captcha += randomChar;

    if (/[a-zA-Z]/.test(randomChar)) { // Check if the character is a letter
      hasLetter = true;
    }
  }

  // If there is no letter, replace one character with a random letter
  if (!hasLetter) {
    const randomLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 52));
    captcha = captcha.substring(0, Math.floor(Math.random() * length)) + randomLetter + captcha.substring(Math.floor(Math.random() * length) + 1);
  }

  return captcha;
}
app.get("/login", (req, res) => {
  
  //const captchaNumber = Math.floor(1000 + Math.random() * 9000);
  const captchaNumber = generateCaptcha();
  // Store the CAPTCHA number in the session for later validation
  req.session.captcha = captchaNumber;
  // Render the login page and pass the CAPTCHA image data to the view
  res.render("login/login", { captcha: captchaNumber });
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
app.get("/404", (req, res) => {
  res.render("pages/404");
});

app.get("*", function (req, res) {
  res.redirect("404");
});

io.on("connection", (socket) => {
  console.log(`Connected socket ID: ${socket.id}`);
  socket.on("notification-request", async (data) => {
    const range_id = data.range_code;
    const user_type = data.user_type;
    try {
      // Simulate getting some data asynchronously
      const res_dt = await SendNotification(range_id, user_type);
      console.log(`Sending notification to socket ID: ${socket.id}`);
      socket.emit("notification", { message: res_dt.msg });
    } catch (err) {
      console.error("Error while sending notification:", err);
    }
  });
  socket.on("markassread", async (data) => {
    const range_id = data.range_code;
    const user_type = data.user_type;
    console.log(`Sending Mark As Red to socket ID: ${socket.id}`);
    try {
      // Simulate getting some data asynchronously
      const dataupdate = await UpdateNotification(range_id, user_type);
      const res_dt = await SendNotification(range_id, user_type);
      // console.log(`Sending notification to socket ID: ${socket.id}`);
      socket.emit("notification", { message: res_dt.msg });
    } catch (err) {
      console.error("Error while sending notification:", err);
    }
  });

  // socket.emit('notification-request', {});
  // Handle client disconnecting
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, (err) => {
  if (err) throw err;
  else console.log(`App is running at port ${port}`);
});
