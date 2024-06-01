const fs = require("fs");

// fs.writeFile("message.txt", "Hello from NodeJS!", (err) => {
//     if(err) throw err;
//     console.log("The file has been saved");
// });
// fs.readFileSync("message.txt","utf-8", (err,data) => {
//     if(err) throw err;
//     console.log("The file has been read");
//     console.log(data);
// });
try {
    const str = fs.readFileSync("message.txt","utf8");
    console.log(str);
} catch(err) {
    console.log(err);
}
