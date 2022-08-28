const express = require("express");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// process.env.TOKEN_SECRET; 
let generateAccessToken = (username) => {
    let accessToken = jwt.sign({ data: username }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '1800s' });
    let refreshToken = jwt.sign({ data: username }, process.env.REFRESHTOKEN_SECRET, { expiresIn: '3h' });

    // jwt.sign({ data: 'foobar' }, 'secret', { expiresIn: '1h' });

    return { accessToken, refreshToken }
}





router.post("/signup", async (req, res) => {
    const { username, email, password, } = req.body;

    console.log(username, email, password);
    if (!email || !password || !username) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword, "hashed pass");
    const newUser = new UserModel({
        username: username,
        email: email,
        password: hashedPassword,
    });

    await newUser.save((err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log(user);
            let sendUser = { ...newUser }
            delete sendUser._doc.password;
            let { refreshToken, accessToken } = generateAccessToken(username)

            res.send({
                msg: "User created",
                user: sendUser._doc,
                refreshToken: refreshToken,
                accessToken: accessToken


            });

        }
    });

    console.log(req.body);

});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }
    let sendUser = { ...user }
    let { refreshToken, accessToken } = generateAccessToken(email);
    delete sendUser._doc.password;
    console.log(refreshToken, accessToken)
    res.send({
        msg: "login",
        user: sendUser._doc,
        refreshToken: refreshToken,
        accessToken: accessToken
    });
});

router.post("/token", async (req, res) => {

    const refeshToken = req.body.token;
    if (!refreshToken) {
        return res.status(401).send("Please provide refresh token")

    }
    // if (!refreshTokens.includes(refreshToken)) {
    //     return res.status(401).send("Invalid token provided");
    // }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
        delete payload.exp;
        const accessToken = jwt.sign(payload, process.env.ACCESSTOKEN_SECRET, {
            expiresIn: '1800s'
        });
        return res.status(200).json({ accessToken })

        catch (error) {
            return res.status(401).send(error.message)
        }


    }
)











module.exports = router;
