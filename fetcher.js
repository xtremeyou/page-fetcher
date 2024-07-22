//Problem to solve:
//Given x input, what are the steps to necessary to return ouput y?
//create if statement that checks if the first terminal input is a url, and if the second terminal input is a file path.
//if true, it'll create the needle function, and a write function to get the data and download it to index.html then output a message

//allows access to local file system, terminal inputs, needle module and path
//requires filesystem
const fs = require("fs");
//requires local path
const path = require("path");
//lets us use terminal arguments
const args = process.argv.slice(2);
//allows us to use needle module
const needle = require("needle");
//creates variables when use as command line arguments 
const url = args[0];
const filePath = args[1];

//need to create function for writeFile to be used as callback function
const writeFileFunction = (filePath, data) => {
    //allows data to be created where the terminal command path points to
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  //writes file upon given data from fetchWebPage
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log("Error writing file:", err);
    } else {
      //checks and updates fileSize with the size of the file in bytes
      const fileSize = Buffer.byteLength(data);
      console.log(`Downloaded and saved ${fileSize} bytes to ${filePath} `);
    }
  });
};

//needs to handle the conditional logic, and use writeFileFunction as a callback
const fetchWebPage = (url, filePath, callback) => {
  if (url && filePath) {
    //gets url info, checks for errors and statuscodes
    needle.get(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        //joins current directory and filePath to allow easier use of the writeFile function
        const absoluteFilePath = path.join(__dirname, filePath);
        callback(absoluteFilePath, body);
      } else {
        console.log("error:", error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode);
      }
    });
  }
};

fetchWebPage(url, filePath, writeFileFunction);
