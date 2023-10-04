require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("assets"));

app.get("/", function(_req, res){
    res.sendFile(__dirname + "/signup.html")

});

app.post("/", function(req, res){

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email
    // console.log(firstName, lastName, email);
    const data ={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);// to convert to flatpack json
    const url = process.env.URL;
    const options = {
        method: "POST",
        AUTH : process.env.AUTH
    }
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        // "There was an error with signing up, please try again!"
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
            
        });
    });
    request.write(jsonData);
    request.end();
});

// POST REQUEST FOR FAILURE ROUTE/PAGE REDIRECT
app.post("/failure", function(_req, res){
    res.redirect("/");

});


app.listen(process.env.PORT || 3001, function(){
    console.log("Server running at port 3001.");
    
});

