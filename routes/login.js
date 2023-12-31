const express = require('express');
const router = express.Router();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const client = new MongoClient("mongodb+srv://login:test123@cluster0.ayowtk8.mongodb.net/?retryWrites=true&w=majority");

router.use(express.urlencoded({ extended: false }));
router.use(cors());
router.use(express.json());
router.use(cookieParser());

// GET route to test MongoDB connection
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

// POST route to register a new user
router.post("/register", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).send({
            status: "Bad Request",
            message: "Some fields are missing: username, email, password"
        });
        return;
    }

    try {
        await client.connect();
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            uuid: uuidv4()
        };
        const colli = client.db('logintutorial').collection('users');
        const insertedUser = await colli.insertOne(user);
        res.status(201).send({
            status: "Saved",
            message: "User has been saved!",
            data: insertedUser
        });
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

// POST route for user login
router.post("/login", async (req, res) => {
    // Check if email and password are provided
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            status: "Bad Request",
            message: "Some fields are missing: email, password"
        });
        return;
    }

    try {
        await client.connect();
        const loginuser = {
            email: req.body.email,
            password: req.body.password,
        };
        const colli = client.db('logintutorial').collection('users');
        const query = { email: loginuser.email };
        const user = await colli.findOne(query);

        if (user) {
            // Check if the provided password matches the stored password
            if (user.password == loginuser.password) {
                res.status(200).send({
                    status: "Authentication successful!",
                    message: "You are logged in!",
                    data: {
                        username: user.username,
                        email: user.email,
                        uuid: user.uuid,
                    }
                });
            } else {
                res.status(401).send({
                    status: "Authentication error",
                    message: "Password is incorrect!"
                });
            }
        } else {
            res.status(401).send({
                status: "Authentication error",
                message: "No user with this email has been found! Make sure you register first."
            });
        }
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

// POST route to verify user ID (UUID)
router.post("/verifyID", async (req, res) => {
    // Check if UUID is provided
    if (!req.body.uuid) {
        res.status(400).send({
            status: "Bad Request",
            message: "ID is missing"
        });
        return;
    } else {
        // Check if the provided UUID is valid
        if (!uuidValidate(req.body.uuid)) {
            res.status(400).send({
                status: "Bad Request",
                message: "ID is not a valid UUID"
            });
            return;
        }
    }
    try {
        await client.connect();
        const colli = client.db('logintutorial').collection('users');
        const query = { uuid: req.body.uuid };
        const user = await colli.findOne(query);

        if (user) {
            res.status(200).send({
                status: "Verified",
                message: "Your UUID is valid.",
                data: {
                    username: user.username,
                    email: user.email,
                    uuid: user.uuid,
                }
            });
        } else {
            res.status(401).send({
                status: "Verify error",
                message: `No user exists with uuid ${req.body.uuid}`
            });
        }
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

// POST route to handle user logout
router.post('/logout', (req, res) => {
    res.clearCookie('session');
    res.send('Logout successful');
});

module.exports = router;
