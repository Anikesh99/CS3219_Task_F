const express = require("express")
const cors = require("cors")
const mongoose = require('mongoose')

const app = express()
const Redis = require('redis')
const client = Redis.createClient()
comments = require("./model")

app.use(cors())
mongoose.connect("mongodb+srv://Anikesh:99johnny@fakedata.ssuwy.mongodb.net/sample_mflix?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true})
var db = mongoose.connection

if (!db) {
    console.log("Error")
} else {
    console.log("Here i stand")
}

app.get("/", (req, res) => {
    client.get('comments', (error, data) => {
        if (error) console.log(error)
        if (data != null) {
            return res.json({data})
        } else {
            comments.get((err, comment) => {
                if(err) {
                    res.json({
                        message: "Failure"
                    })
                } else {
                    client.setex('comments', 7200, JSON.stringify(comment))
                    res.json({comment})
                }
            })
        }
    })
})

app.get("/name/", (req, res) => {
    console.log(req.query)
    client.get(`comments?name=${req.query.name}`, (error, data) => {
        if (error) console.log(error)
        if (data != null) {
            return res.json(data)
        } else {
            comments.findOne({'name': req.query.name}, (err, comment) => {
                if (err || comment == null) return res.json({"message": "Failure"})
                client.setex(
                    `comments?name=${req.query.name}`,
                    7200, JSON.stringify(comment)
                )
                res.json({comment})
            })
        }
    })
})

app.listen(5000, () => {
    console.log("up and running")
})

module.exports = app