// backend.js
import express from "express";

const app = express();
const port = 8001;

app.use(express.json());

//Temporary task data structure
const tasks ={
    tasks_list: [
        {
            id: "abc123",
            task: "do homework",
            link: "1",
            category: "Sprint 1"
        },
        {
            id: "1",
            task:"do next weeks homework",
            link: "none",
            category: "Sprint 1"
        }
    ]
}


// Get all tasks
app.get("/tasks/", (req, res) => {
  res.send(tasks);
});


// Adds tasks to tasks_list (no persistance since no db) 
const addTask = (task) => {
    tasks["tasks_list"].push(task);
    return task;
  };
  app.post("/tasks", (req, res) => {
    const taskToAdd = req.body;
    addTask(taskToAdd);
    res.send(201);
  });


  const findTaskById = (id) =>
    tasks["tasks_list"].find((task) => task["id"] === id);


// Delete task given a task id
const deleteTask = (id) => {
   let found = findTaskById(id)
   const index = tasks["tasks_list"].indexOf(found)
   tasks["tasks_list"].splice(index,1) // delete item from arrary
 };  
 app.delete("tasks/:id",(req, res) => {
   const id = req.params["id"]
   deleteTask(id)
   res.send(204)
 });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});