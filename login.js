const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const client = new MongoClient("mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/?retryWrites=true&w=majority");

router.use(express.urlencoded({ extended: false }));

router.get("/testMongo", async (req, res) => {
    try {
        await client.connect();
        const colli = client.db('logintutorial').collection('users');
        const users = await colli.find({}).toArray();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    } finally {
        await client.close();
    }
});

module.exports = router;
