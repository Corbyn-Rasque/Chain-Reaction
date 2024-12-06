import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './database.js';


export async function registerUser(req, res) {
    const { email, password } = req.body;

    if ( !email || !password ) {
        res.status(400).send("Bad request: Invalid input data");
    }
    else if (await db.get_user({ email }).then((user) =>  user)) {
        res.status(409).send("Username already taken");
    }
    else {
        bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(password, salt))
            .then(async (hashedPassword) => {
                const id = await db.add_user({ email: email, password: hashedPassword })
                    .then((id) => id)
                    .catch((error) => console.error(error));

                if (!id) { res.status(500).send("Failed to create user"); }
                else {
                    const token = generateAccessToken(email);
                    res.status(201).send({ token: token });
                }
            });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await db.get_user({ email, password });

    if(!user) { res.status(401).send("Unauthorized"); }
    else {
        bcrypt.compare(password, user.password)
            .then((match) => {
                if(match) {
                    

                    generateAccessToken(email).then((token) => {
                        res.status(200).send({ token: token });
                    });
                }
                else {
                    res.status(401).send("Unauthorized");
                }
            })
            .catch(() => {
                res.status(401).send("Unauthorized");
            });
    }
}

export function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log("No token received");
        res.status(401).end();
    }
    else {
        jwt.verify(
            token,
            process.env.TOKEN_SECRET,
            (error, decoded) => {
                if (decoded) {
                    req.user_info = {
                        email: decoded.email
                    };
                    next();
                }
                else {
                    console.log("JWT error:", error);
                    res.status(401).end();
                }
            }
        );
    }
}

function generateAccessToken (email) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { email: email },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) { reject(error); }
                else { resolve(token); }
            }
        );
    });
}