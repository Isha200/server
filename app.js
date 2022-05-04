//Import all dependancies 
const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');


const app = express();

//configure ENV File & Require Connection
dotenv.config({ path: './config.env' });
require('./db/conn');
const port = process.env.PORT;

//Required Models and Schema
const Users = require('./models/userSchema');



//These method is used to get data and cookies from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello World");
})

//Register 
app.post('/register', async (req, res) => {
    try {
        //get body or data
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username: username,
            email: email,
            password: password
        });
        //save method is used to create user or insert user 
        //but before saving or inserting password will hash 
        //because of hashing. After hash it will save to DB
        const created = await createUser.save()
        console.log(created);
        res.status(200).send("Registered");

    } catch (error) {
        res.status(400).send(error)
    }
})

//Login User
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        //find if user already exists
        const user = await Users.findOne({ email: email });
        if(user){
            //verify password
            const isMatch = await bcryptjs.compare(password,user.password);

            if(isMatch){
                //Generate Token which is Define in User Schema
                const token = await user.generateToken();
                res.cookie("jwt",token, {
                    //token expires in 24 hours
                    expires : new Date(Date.now() + 86400000),
                    httpOnly : true
                })
                res.status(200).send("Logged in ")
            }else{
                res.status(400).send("Invalid Credentials");
            }
        }else{
            res.status(400).send("Invalid Credentials");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

//Logout
app.get('logout',(req,res)=>{
    res.clearCookie("jwt",{path : '/'})
    res.status(200).send("User logged out")
})

//Authentication
// app.get('/auth',authenticate,(req,res)=>{

// })

// run Server
app.listen(port, () => {
    console.log("Server is Listening")
})


//Connecting backend with frontend now