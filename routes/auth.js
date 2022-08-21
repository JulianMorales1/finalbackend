const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
var express = require("express");
var router = express.Router();
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
const { blogsDB } = require("../mongo");

const createUser = async (username, passwordHash, admin) => {

    try {
        const collection = await blogsDB().collection("users")

        const user = {
            username: username,
            password: passwordHash,
            uid: uuid(), // uid stands for User ID. This will be a unique string that we will can to identify our user
            admin: admin
        }

        await collection.insertOne(user);
        // Save user functionality
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

router.post("/register-user", async function (req, res, next) {

    const username = req.body.username
    const password = req.body.password
    const admin = req.body.admin;

    const saltRounds = 5; // In a real application, this number would be somewhere between 5 and 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const userSaveSuccess = await createUser(username, hash, admin);
    if (userSaveSuccess === true) {
        res.json({ success: true });
    }
    if (userSaveSuccess === false) {
        res.json({ success: false });
    }
})

router.post("/login-user", async function (req, res, next) {

    const collection = await blogsDB().collection("users")

    const user = await collection.findOne({
        username: req.body.username
    });
    const match = await bcrypt.compare(req.body.password, user.password);
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const data = {
        time: new Date(),
        userId: user.uid // Note: Double check this line of code to be sure that user.uid is coming from your fetched mongo user 
    }
    const token = jwt.sign(data, jwtSecretKey);

    console.log(match)

    if (match === true) { res.json({ "success": true, token, userid: user._id, user: user }) }

    if (match === false) { res.json({ "success": false }) }
})

router.post("/auth/validate-token", async function (req, res, next) {

    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        const token = req.header(tokenHeaderKey);

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.json({ success: true });
        } else {
            // Access Denied
            throw Error("Access Denied")
        }
    } catch (error) {
        // Access Denied
        console.error(error)
        return res.status(401).json({ success: true, message: String(error) });
    }
})


router.get('/auth/me/', async function (req, res, next) {

    // get curretn logged in user

})


module.exports = router