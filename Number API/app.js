const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const port = 5000;
const app = express();

const number = async des => {
    try {
        const response = await fetch(des);
        const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, 500);
    });
  
        const data = await Promise.race([response.json(), timeoutPromise]);
    
        return data;
    } catch (err) {
        console.log(err);
        // throw err;
    }
};
  
let findCommonElements = (arr1, arr2) => {
    const commonElements = [];  
    for (const element1 of arr1) {
        for (const element2 of arr2) {
            if (element1 === element2) {
            commonElements.push(element1);
            }
        }
    }

    const out ={
        numbers:commonElements
    }
    return out;
}


app.use(bodyParser.urlencoded({extended:true}));

app.get("/numbers", async (req, res) => {
    try {
        const arr = req.query.url;
        let out = [];
    
        out = await number(arr[0]);
        console.log(arr[0],out);
    
        for (const url of arr.slice(1)) {
            const data = await number(url);
            out = await findCommonElements(data.numbers, out.numbers);
            console.log(url,out);
        }
    
        res.send(out);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("Error occurred");
    }
  });
  
  

app.listen(port,() => {
    console.log("The server is running");
});