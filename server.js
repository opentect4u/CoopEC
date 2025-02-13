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
const MemoryStore = require('express-session').MemoryStore;
const { db_Select,db_Insert } = require("./modules/MasterModule");
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
var corsOptions = {
  origin: 'http://localhost',
}
//app.use(cors());

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("trust proxy", 1);
// Set up the session middleware
app.use(
  session({
    secret: "WB_CB_ELE_COMM", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 ,          // Only send over HTTPS
    secure: true,            // Ensures cookies are only sent over HTTPS
    httpOnly: true,          // Prevents JavaScript access (Mitigates XSS)
    sameSite: "Lax"       // Prevent JavaScript access
     }
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
  res.set('Cache-Control', 'no-store');
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

const { validateSession } = require("./middleware/authMiddleware");
const { checkUserInput } = require("./middleware/chekUserInputMiddleware");


app.use("/login", LoginRouter);
app.use("/dash", validateSession,checkUserInput, DashboardRouter);
app.use("/dashn", validateSession,checkUserInput, DashboardnRouter);
app.use("/society",validateSession,checkUserInput, SocietyRouter);
app.use("/wdtls",validateSession,checkUserInput, WdtlsRouter);
app.use("/report",validateSession,checkUserInput, reportRouter);
app.use("/crn", Cronjobrouter);
app.use("/rangeR", validateSession,checkUserInput, rangeRouter);

app.use("/wapi",cors(corsOptions) ,WapiRouter);

app.get("/dashboard", async (req, res) => {
  var res_dt = {
    user_data: req.session.user,
  };
  var user = req.session.user;

  if (user) {
    res.redirect("dash/dashboard");
  } else {
    res.redirect("/login");
  }
});

function generateCaptcha() {
  const length = 4;  // Length of CAPTCHA
  //const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Letters and Numbers
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
  // if (!hasLetter) {
  //   const randomLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 52));
  //   captcha = captcha.substring(0, Math.floor(Math.random() * length)) + randomLetter + captcha.substring(Math.floor(Math.random() * length) + 1);
  // }
  return captcha;
}
app.get("/login", (req, res) => {
  //const captchaNumber = Math.floor(1000 + Math.random() * 9000);
  const captchaNumber = generateCaptcha();
  // Store the CAPTCHA number in the session for later validation
  req.session.captcha = captchaNumber;
  console.log(req.session.captcha);
  // Render the login page and pass the CAPTCHA image data to the view
  res.render("login/login", { captcha: captchaNumber });
});
app.get("/logout", async (req, res) => {
  
  if (req.session.user) {
  var user_id = req.session.user.user_id;
  var save_data = await db_Insert("md_user", `session_version_id='NULL'`, null, `user_id ='${user_id}'`, 1);
  }
  req.session.destroy();
  res.redirect("/login");
});
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("*", function (req, res) {
  res.redirect("404");
});
// io.use((socket, next) => {
//   const sessionID = socket.handshake.headers['cookie']; // Assuming cookie contains sessionID
//   if (sessionID) {
//     // Get session object from the store using sessionID
//     const session = socket.request.session;
//     socket.session = session; // Attach session to the socket object
//   }
//   next();
// });
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
    if (socket.session) {
      socket.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        } else {
          console.log("Session destroyed");
        }
      });
    } else {
      console.log("Session not found");
    }
  });
});

server.listen(port, (err) => {
  if (err) throw err;
  else console.log(`App is running at port ${port}`);
});
