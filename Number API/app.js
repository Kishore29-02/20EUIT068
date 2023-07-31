const express = require("express");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const port = 5000;
const app = express();

const number = async des => {
    try {
        const response = await fetch(des);
        // console.log(response.ok,"Response");
        if(!response.ok){
            // console.log("Invalid Url:",des);
            let out = {
                numbers:[-1]
            };
            return out;
        }
        const startTime = Date.now();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timeout'));
            }, 500);
        });
        
        const endTime = Date.now();
  
        const data = await Promise.race([response.json(), timeoutPromise]);

        console.log(des,startTime-endTime,"ms");
        return data;
    } catch (err) {
        console.log("Error--",err.message);
        let out = {
            numbers:[-1]
        };
        return out;
    }
};
  
let mergeElements = (arr1, arr2) => {
    const uniqueSet = new Set([...arr1, ...arr2]);
    let out = Array.from(uniqueSet).sort((a, b) => a - b);
    const m = {
        numbers : out
    }
    return m;
}


app.use(bodyParser.urlencoded({extended:true}));

app.get("/numbers", async (req, res) => {
    try {
        const arr = req.query.url;
        let out;
    
        // out = await number(arr[0]);
        let num = 0;
        
        for(const url of arr){
            out = await number(url);
            // console.log(url,out);
            num++;
            if(out.numbers[0] !== -1){
                // console.log("out",out);
                break;
            }
        }
        // console.log(arr[num],out);
    
        for (const url of arr.slice(num)) {
            const data = await number(url);
            // console.log(out,data,"Hellon");
            // console.log("data",data);
            if(data.numbers[0] === -1){
                continue;
            }
            out = await mergeElements(data.numbers, out.numbers);
            // console.log(url,out);
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