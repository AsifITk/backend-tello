const express = require("express");
const authRouter = require("./routes/authRoutes");
const app = express();
var morgan = require("morgan");

const mongoose = require("mongoose");
const uri = `mongodb+srv://admin:admin@cluster0.rg7pw6b.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("Connected to mongodb");
    })
    .catch((err) => console.log("could not connect ", err));






app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRouter);
app.listen(8000, () => {
    console.log("Connected");
});




function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers["authorization"];
    if (authHeaderInfo === undefined) {
        return res.status(401).send("No token was provided");
    }
    const token = authHeaderInfo.split(" ")[1];
    if (token === undefined) {
        return res.status(401).send("Proper token was not provided");
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
        req.userInfo = payload;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).send("Invalid token provided");
    }
}