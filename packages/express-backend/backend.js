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


// Add task to list
// Request should be in format to match task schema
app.post("/tasks", (req, res) => {
  const taskToAdd = req.body;
  taskServices.addTask(taskToAdd)
    .then((result) => {
      if (result !== undefined){
        console.log(result +' was added succesfully')
        res.status(201).json(result); // will be null, maybe instead do a GET after to update list
      }
    })
    .catch((error) => {
      console.log(error)
    })
  
});


// Delete a task given a task id  
app.delete("/tasks/:id",(req, res) => {
  const taskId = req.params["id"];
  taskServices.deleteTask(taskId)
    .then((result) => {
      if (result !== "success"){
        res.status(404).send("Task not Found")
      } else {
        res.status(204).send("Task Deleted Successfully")
      }
    })
});


// Update a task given a task id
app.post("/tasks/:id",(req,res) => {
  const taskId = req.params["id"];
  const updates = req.body;
  taskServices.updateTask(taskId, updates)
    .then((result) => {
      if (result === "success"){
        res.status(200).send("Task Updated Successfully")
      }
    })

})


// //User get request with given query string
// app.get("/users", (req, res) => {
//   const name = req.query.name;
//   const job = req.query.job;
//   // Covers both query strings

//   userServices.getUsers(name, job)
//     .then((user) => {
//       if (user !== undefined){
//         res.send(user)
//       }
//     })
//     .catch((error) => {
//       console.log(error)
//     })
// }); 

