const mongoose = require("mongoose");

const db = process.env.DATABASE;

mongoose.connect(db,{
    // userNewUrlParser : true,
    // userUnifiedTopology : true
}).then(()=>{
    console.log("Successful connection");
}).catch((e)=>{
    console.log(e);
})

