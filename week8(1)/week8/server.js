const exp = require("express");
const app = exp();
const mongoose = require("mongoose");
const handlebars= require("express-handlebars");
const bodyparser= require("body-parser")



app.use(bodyparser.urlenvoded({extended:true}));
app.engine(".hbs",handelbars.engine({extname:" .hbs"}))
app.set("view engine","hbs");


//mongoose.connect("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/db3?retryWrites=true&w=majority");

const db1 = mongoose.createConnection("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/database1?retryWrites=true&w=majority");
const db2 = mongoose.createConnection("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/db2?retryWrites=true&w=majority");
const db3 = mongoose.createConnection("mongodb+srv://admin:xQn3esp24wrwBvmH@cluster0.pccp8.mongodb.net/db3?retryWrites=true&w=majority");



const customers_schema = new mongoose.Schema({
    "first_name": String,
    "last_name": String,
    "email": String
},{strict:true});

const products_schema = new mongoose.Schema({
    "product_name": String,
    "price": Number
})

const customers = db3.model("customers", customers_schema);

let c1 = new customers({
    fname: "Alex",
    lname: "Davad",
    email: "dddd@gmail.com"
}).save((e, data) => {
    if (e) {
        console.log(e);
    } else {
        console.log(data);
    }
});


app.get("/", function (req, res) {
    res.render("Home",{layout:false});
});

app.post("/user_delete",function(req,res){
    var fname = req.body.fname;
    customers.deleteOne().exec().then((data)=>{
        console.log(data)
        res.render("home",{layout: false});
        res.render("home",{layout:false})})
    })
app.post("/user_update",function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    customers.updateOne({first_name:fname},{
        $set: {
            first_name:fname,
            last_name: lname,
            email:email
        }
    }).exec().then(data=>{
        console.log(data);
        res.render("home",{data:data,layout:false})
    });

})
app.post("/user_search",function(req,res){
    var fname = req.body.fname
    if(fname){
            customers.find({first_name: fname}).exec().then((data)=>{
                console.log(data);
                res.render("home",{data: data,layout:false});
            });           //is for dynamically search the value
            //find one is for searching unique one

    //SQU: SELECT * FROM customers;
    //customers.find();

    //SQL: SELECT * FROM customers WHERE first_name = "yeonsu"                      --pass condition
    //customers.find({first_name:"yeonsu"})

    //SQL: SELECT * FROM customers WHERE first_name = "yeonsu" and last_name= "park"
    //customers.find({first_name:"yeonsu",last_name: "park"});

    //SQL: SELECT first_name,last_name FROM customers WHERE first_name = "yeonsu"
    //customers.find({first_name: "yeonsu"},["first_name","last_name"])             --[] is for passing parameter

    //SQL: SELECT * FROM customers WHERE first_name = "yeonsu" OR first_name = "haytham"
    //customers.find({
//  $or:[{fisrt_name:"yeonsu"},{first_name:"haytham"}],                             -- should be array
//  email:"something@naver.com"
    //})
    }else{
        res.render("home",{layout:false});
    }
})


app.listen(8080);