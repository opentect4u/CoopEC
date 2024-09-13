const express = require("express"),
    app = express(),
    session = require("express-session"),
    expressLayouts = require("express-ejs-layouts"),
    path = require("path"),
    port = process.env.PORT || 3000;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// SET VIEW ENGINE AND PATH //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);

app.set("layout", "templates/layout");

// SET ASSETS AS A STATIC PATH //
app.use(express.static(path.join(__dirname, "assets/")));

// Set up the session middleware
app.use(
  session({
    secret: "WB_CB_ELE_COMM", // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie : {
      maxAge: 3600000
    }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.path = req.path;
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

const { DashboardRouter } = require("./router/dashboardRouter");
const { LoginRouter } = require("./router/loginRouter");
const { SocietyRouter } = require("./router/societyRouter");

app.use("/login",LoginRouter)
app.use("/dash",DashboardRouter)
app.use("/society",SocietyRouter)
//app.use(DashboardRouter)

// app.get("/",async (req, res) => {
// //   var user = req.session.user;
// //   if (!user) {
// //     res.redirect("/login");
// //   } else {
//     res.redirect("/login");
// //   }
// // res.send('Welcome')
// });
app.get("/dashboard", async (req, res) => {
  
    var res_dt = {
        user_data:req.session.user
    };
    var user = req.session.user;

     if (user) {
      // res.render("dashboard/landing",res_dt);
       res.redirect("dash/dashboard");
     }else{
      res.redirect("/login");
     }
    
 });
app.get("/login", (req, res) => {
  res.render("login/login");
});
app.get("/logout", (req, res) => {
  req.session.destroy();
 res.redirect("/login");
});
app.get('/404', (req, res) => {
  res.render('pages/404')
})

app.get('*', function(req, res){
  res.redirect('404')
})


app.listen(port, (err) => {
    if (err) throw new Error(err);
    else console.log(`App is running at http://localhost:${port}`);
});