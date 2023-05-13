
const express = require('express')
const app = express()
const port = 3000
const Redis = require("redis");

const client = Redis.createClient();
client.connect()

app.get('/', async (req, res) => {
    let key = await client.get("name",(err,data)=>{
        return data;
    })
    if(key != null) res.send(key)
    else {
        await client.set("name","abhishek")
        let key = await client.get("name",(err,data)=> data)
        res.send(key);
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})