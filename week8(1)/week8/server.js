// const exp = require("express");
// const app = exp();
// const mongoose = require("mongoose");
// const handlebars= require("express-handlebars");
// const bodyparser= require("body-parser")



// app.use(bodyparser.urlenvoded({extended:true}));
// app.engine(".hbs",handelbars.engine({extname:" .hbs"}))
// app.set("view engine","hbs");


// //mongoose.connect("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/db3?retryWrites=true&w=majority");

// const db1 = mongoose.createConnection("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/database1?retryWrites=true&w=majority");
// const db2 = mongoose.createConnection("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/db2?retryWrites=true&w=majority");
// const db3 = mongoose.createConnection("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/db3?retryWrites=true&w=majority");



// const customers_schema = new mongoose.Schema({
//     "first_name": String,
//     "last_name": String,
//     "email": String
// },{strict:true});

// const products_schema = new mongoose.Schema({
//     "product_name": String,
//     "price": Number
// })

// const customers = db3.model("customers", customers_schema);

// let c1 = new customers({
//     fname: "Alex",
//     lname: "Davad",
//     email: "dddd@gmail.com"
// }).save((e, data) => {
//     if (e) {
//         console.log(e);
//     } else {
//         console.log(data);
//     }
// });


// app.get("/", function (req, res) {
//     res.render("Home",{layout:false});
// });

// app.post("/user_delete",function(req,res){
//     var fname = req.body.fname;
//     customers.deleteOne().exec().then((data)=>{
//         console.log(data)
//         res.render("home",{layout: false});
//         res.render("home",{layout:false})})
//     })
// app.post("/user_update",function(req,res){
//     var fname = req.body.fname;
//     var lname = req.body.lname;
//     var email = req.body.email;

//     customers.updateOne({first_name:fname},{
//         $set: {
//             first_name:fname,
//             last_name: lname,
//             email:email
//         }
//     }).exec().then(data=>{
//         console.log(data);
//         res.render("home",{data:data,layout:false})
//     });

// })
// app.post("/user_search",function(req,res){
//     var fname = req.body.fname
//     if(fname){
//             customers.find({first_name: fname}).exec().then((data)=>{
//                 console.log(data);
//                 res.render("home",{data: data,layout:false});
//             });           //is for dynamically search the value
//             //find one is for searching unique one

//     //SQU: SELECT * FROM customers;
//     //customers.find();

//     //SQL: SELECT * FROM customers WHERE first_name = "yeonsu"                      --pass condition
//     //customers.find({first_name:"yeonsu"})

//     //SQL: SELECT * FROM customers WHERE first_name = "yeonsu" and last_name= "park"
//     //customers.find({first_name:"yeonsu",last_name: "park"});

//     //SQL: SELECT first_name,last_name FROM customers WHERE first_name = "yeonsu"
//     //customers.find({first_name: "yeonsu"},["first_name","last_name"])             --[] is for passing parameter

//     //SQL: SELECT * FROM customers WHERE first_name = "yeonsu" OR first_name = "haytham"
//     //customers.find({
// //  $or:[{fisrt_name:"yeonsu"},{first_name:"haytham"}],                             -- should be array
// //  email:"something@naver.com"
//     //})
//     }else{
//         res.render("home",{layout:false});
//     }
// })


// app.listen(8080);




const exp = require("express");
const app = exp();
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {

    let message = { msg: "Welcome!"};

    res.json(message);
});

app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
});

var myRequest = new Request('https://reqres.in/api/users/', { 
                    method: 'POST',
                    body: JSON.stringify({user:"John Doe", job:"unknown"}),
                    headers: {
                        'Content-Type': 'application/json'
                    } 
                });

app.use(express.json());

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/login.html"));
});

app.get("/user_dashboard", ensureLogin, (req, res) => {
    res.render("user_dashboard", {user: req.session.user, layout: false});
  });
  app.get("/admin_dashboard", ensureLogin, (req, res) => {
    res.render("admin_dashboard", {user: req.session.user, layout: false});
  });
app.get("/api/users", (req, res) => {
    res.json({message: "fetch all users"});
});

app.post("/api/users", (req, res) => {
        res.json({message: "add the user: " + req.body.fName + " " + req.body.lName});
        if (!user.username) {
            res.render("login", { data: user, layout: false });
            return;
        }
        if (!user.password) {
            res.render("login", { data: user, layout: false });
            return;
        }
        else {
            res.render("login_dashboard", {layout: false});
        }
});

app.get("/api/users/:userId", (req, res) => {
    res.json({message: "Get user with new Id: " + req.params.userId});
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
}

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if(username === "" || password === "") {
      return res.render("login", { errorMsg: "Missing credentials.", layout: false });
    }
  
    if(username === user.username && password === user.password){
  
      req.session.user = {
        username: user.username,
        email: user.email
      };
  
      res.redirect("/admin_dashboard");
    } else {
      res.render("login", { errorMsg: "Invalid username or password!", layout: false});
    }
  });

  app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/login");
  });
  
app.listen(HTTP_PORT, onHttpStart);


























