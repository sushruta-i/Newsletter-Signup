const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public")) //all css and images must go in a static folder for express to use them.
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {  //This is what you want the landing page to display
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;

  const data = {     //we need to put our values in an object the same way mailchimp does
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data); //minify the data

  const url = "https://us18.api.mailchimp.com/3.0/lists/f9b55027e4"; //from mailchimp dev site. the last part is the unique list id
 //the nodejs https.request can take options. the auth needs to be formatted the way mailchimp wants it.
  const options = {
    method: "POST",
    auth: "sush1:35161bb4ca7efd1409fab173b4e630d5-us18" //this is how mailchimp api needs to be formatted
  };


  const request = https.request(url, options, function(response) { //this request is different from req

    (response.statusCode === 200) ? res.sendFile(__dirname + "/success.html") : res.sendFile(__dirname + "/failure.html");

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData); //this passes the json data to the mailchimp server
  request.end();
});


app.post("/failure", function(req,res){
  //Redirects user to homepage after clicking the Try Agian button,
  res.redirect("/");
});


app.post("/success", function(req,res){
  //Redirects user to homepage after clicking the Go Back button,
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});


//apikey: 35161bb4ca7efd1409fab173b4e630d5-us18
//list id: f9b55027e4
