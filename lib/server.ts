import * as express from "express"
import { allRoutes } from "./routes";
import * as mongoose from "mongoose";
import { mongoUrl } from "./conf/mongo.conf"
import { sessionKey } from "./conf/auth.conf"
import * as cors from "cors";
import passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local"
const bodyParser = require("body-parser");
import { User } from "./controllers/user.controller"
import cookieSession = require("cookie-session");
import { Request, Response, NextFunction } from "express";



const http = require('http');
const app = express();

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:4200',
    preflightContinue: true,
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

mongoose.connect(mongoUrl, { useNewUrlParser: true }, function (err) {
    if (!err) {
        console.log("Successfully connected to Taylor's Server");
    } else {
        console.log("Failed to connect to Taylor's Server");
    }
})

app.use(bodyParser.json({ extended: false }));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [sessionKey]
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: { _id: string }, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        delete user?._doc?.password
        done(err, user?._doc);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, userResult) {
            if (err) { return done(err); }
            let user: { username: string, password: string } = userResult?._doc;

            if (!user && !user?.username) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!user?.password || password !== user?.password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
))

app.post('/login',
    (req: Request, res: Response, next: NextFunction) => {
        console.log("Hello");
        next();
    },
    passport.authenticate('local'),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return res.status(200).send("Logged In");
        }
        return res.status(401).end();
    }
);

app.use(allRoutes);
app.listen(1800, () => {
    console.log('Node server running on port 1800');
});