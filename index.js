
const express = require('express')
const app = express()
const port = 3000
const Redis = require("redis");

const client = Redis.createClient();
client.connect()

app.get('/photos', async (req, res) => {

    // find the key photos in the redis database using get function the first parameter is the key want to search and the second parameter is the callback function 
    let key = await client.get("photos",(err,data)=>{
        return data;
    })

    // if key is present in the database just return it 
    if(key != null) res.send(key)
    else{
        // if not make http call and get it 
        let resp = await fetch("https://jsonplaceholder.typicode.com/photos",{
            method:"GET",
        })
        let res_json = await resp.json();
        // and store in the database with key photos Note: store as string
        await client.set("photos",JSON.stringify(res_json))
        res.send(res_json);
    }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})