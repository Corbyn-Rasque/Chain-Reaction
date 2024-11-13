// backend.js
import express, { json } from "express"; //Is an ES module
import cors from "cors";
import taskServices from "./taskServices.js";

const app = express();
const port = 8001;

app.use(cors()); //different ports, different origins
app.use(express.json());

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

//User get request with given query string
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  // Covers both query strings

  userServices.getUsers(name, job)
    .then((user) => {
      if (user !== undefined){
        res.send(user)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}); 


//Search by unique id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userServices.findUserById(id)
    .then((result) => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(200).send(result);
      }
    })
    .catch((error) => {
      console.log(error)
    })
});


app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
    .then((result) => {
      if (result !== undefined){
        res.status(201).json(result);
      }
    })
    .catch((error) => {
      console.log(error)
    })
  
});


  
app.delete("/tasks/:id",(req, res) => {
  const taskId = req.params["id"];
  taskServices.deleteUser(id)
    .then((result) => {
      if (result === null){
        res.status(404).send("User not Found")
      } else {
        res.status(204).send("No Content")
      }
    })
  
});



// Get all current tasks
app.get("/tasks", (req, res) => {
  taskServices.getTasks()
    .then((result) =>{
      if (result === null){
        res.status(204).send("No content")
      } else {
        console.log(result)
        res.status(200).send(result)
      }
    })
});


