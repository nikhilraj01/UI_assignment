const express = require( "express" );
const filemanager = require( "rich-filemanager-node" );
var path = require("path");
var fs = require("fs");
const config = "C:/Users/Lenovo/Documents/UI Assignment/UI_Assignment_1/config.json";	//Change this to the actual location of your config file
var app = express();

//Filemanager route
app.use( '/filemanager', filemanager( "./MyStorage", config ) );
// '/filemanager' is the connector url. 
// Don't forget to set it in the api.connectorUrl of `filemanager.config.json` for the frontend

//Listen for requests
const port = process.env.PORT || 9000;
app.listen( port, function(){
	console.log ( 'App listening on port ' + port );
})

app.get('/view', function(req, res){
    sendFileContent(res, "index.html", "text/html");
});

app.get('/main.js', function(req, res){
    sendFileContent(res, "main.js", "text/javascript");
});

app.get('/main.css', function(req, res){
    sendFileContent(res, "main.js", "text/css");
});

function sendFileContent(response, fileName, contentType){
    fs.readFile(fileName, function(err, data){
      if(err){
        response.writeHead(404);
        response.write("Not Found!");
      }
      else{
        response.writeHead(200, {'Content-Type': contentType});
        response.write(data);
      }
      response.end();
    });
  }