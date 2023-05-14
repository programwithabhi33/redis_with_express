const express = require('express')
const axios = require("axios")
const app = express()
const port = 3001
const { urlencoded, json } = require('body-parser')
const Redis = require("redis");

app.use(urlencoded())
const client = Redis.createClient();
client.connect()

app.get('/', async (req, res) => {
    let albumId = req.body.albumId;
    let photos = await getOrSetData(`photos?albumId${albumId}`, async () => {
        let res_json = await axios.get('https://jsonplaceholder.typicode.com/photos', {
            params: { albumId }
        })
        client.set(`photos?albumId${albumId}`, JSON.stringify(res_json.data))
        return res_json.data
    })
    res.json(photos)

})
app.get('/photo/:id', async (req, res) => {
    let photo = await getOrSetData(`photo:${req.params.id}`, async () => {
        let res_json = await axios.get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`)
        client.set(`photo:${req.params.id}`, JSON.stringify(res_json.data))
        return res_json.data
    })

    res.json(photo)
})

async function getOrSetData(key, cb) {

    return new Promise(async (resolve, reject) => {
        let data = await client.get(key);
        if (data != null) resolve(JSON.parse(data))
        else {
            let freshData = await cb();
            resolve(freshData);
        }
    })

}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
