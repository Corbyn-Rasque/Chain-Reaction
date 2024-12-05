import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "./database.js";

// const creds = [];

export function registerUser(req, res) {
    const { username, pwd } = req.body; // from form (frontend)
  
    if (!username || !pwd) {
      res.status(400).send("Bad request: Invalid input data.");
    } else if (creds.find((c) => c.username === username)) {
      res.status(409).send("Username already taken");
    } else {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(pwd, salt))
        .then((hashedPassword) => {
          generateAccessToken(username).then((token) => {
            console.log("Token:", token);
            console.log(creds)
            res.status(201).send({ token: token });
           
            database.add_user({'email': username, 'password' :hashedPassword})

          });
        });
    }
  }

function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { username: username },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" },
        (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token);
          }
        }
      );
    });
  }
export function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    //Getting the 2nd part of the auth header (the token)
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      console.log("No token received");
      res.status(401).end();
    } else {
      jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (error, decoded) => {
          if (decoded) {
            next();
          } else {
            console.log("JWT error:", error);
            res.status(401).end();
          }
        }
      );
    }
  }

export function loginUser(req, res) {
    const { username, pwd } = req.body; // from form
    
    database.get_user({'email':username})
      .then((retrievedUser) => {
        if (!retrievedUser) {
          // invalid username
          res.status(401).send("Unauthorized");
        } else {
          // since database.get_user returns an array, must index [0] (emails are unique)
          bcrypt
            .compare(pwd, retrievedUser[0].password)
            .then((matched) => {
              if (matched) {
                generateAccessToken(username).then((token) => {
                  res.status(200).send({ token: token });
                });
              } else {
                // invalid password
                res.status(401).send("Unauthorized");
              }
            })
            .catch(() => {
              console.log("Error")
              res.status(401).send("Unauthorized");
            });
        } 
      });
  }
export default {registerUser, authenticateUser,loginUser}