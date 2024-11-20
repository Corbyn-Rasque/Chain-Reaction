// backend.js
import express, { json } from "express"; //Is an ES module
import cors from "cors";
import taskServices from "./taskServices.js";

const app = express();
const port = 8004;

app.use(cors()); //different ports, different origins
app.use(express.json());

app.listen(process.env.PORT || port, () => {
  console.log(
    `REST API is listening`
  );
});

// Gets all Domains by level in the Domain tree.
app.get("/users/:user/domains/:level?", (req, res) => {
  const user = req.params["user"];
  const { level } = req.query;

  taskServices.get_user_domains(user, level)
    .then((result) => {
      if (result === null) {
        res.status(204).send("No Domains");
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    });
});

// Get Task List Items by Task ID
app.get("/users/:user/tasks/:task", (req, res) => {
  const user = req.params["user"];
  const task = req.params["task"];
  const { domain } = req.query;

  taskServices.get_list_items_by_task(task)
    .then((result) => {
      if (result === null) {
        res.status(204).send("No List Items");
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    });
});

// Get User Tasks by Domain ID
app.get("/users/:user/tasks/:domain?", (req, res) => {
  const user = req.params["user"];
  const { domain } = req.query;

  taskServices.get_tasks_by_domain(domain)
    .then((result) => {
      if (result === null) {
        res.status(204).send("No Tasks");
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    });
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


