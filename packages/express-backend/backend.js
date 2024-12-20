// backend.js
import express, { json } from "express";
import cors from "cors";
import db from "./database.js";
import { authenticateUser, loginUser, registerUser } from "./auth.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || port, () => {
  console.log('Address: http://localhost:'+port);
});

// Dashboard
app.get('/dashboard/all', authenticateUser, (req, res) => {
  const email = req.user_info.email;

  db.get_user_id({email})
    .then((user) => { return db.get_user_domains(user.id); })
    .then((domains) => { const promises = domains.map((domain) => 
      db.get_subdomains_and_tasks(domain.id)
    );
    return Promise.all(promises);
    })
    .then((results) => {
      if (results) { res.status(200).send(results); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.log(error));
});


// Users
app.post('/signup', registerUser);
app.post('/login', loginUser);
app.get('/users', (req, res) => {
  const { "email": email } = req.headers;
  
  db.get_user({ email })
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.get('/user_id', authenticateUser, (req, res) => {
  const email = req.user_info.email;

  db.get_user_id({ email: email })
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
})
app.post('/users', authenticateUser, (req, res) => {
  const { email, password } = req.body;

  db.add_user({ email, password })
    .then((result) => {
      if (result) { res.status(201).send(); }
      else { res.status(409).send(); }
    })
    .catch((error) => console.error(error));
});
app.put('/users/:user_id', authenticateUser, (req, res) => {
  const id = req.params['user_id'];
  const { email, password } = req.body;

  db.update_user(id, { email, password })
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.delete('/users/:user_id', authenticateUser, (req, res) => {
  const id = req.params['user_id'];

  db.remove_user(id)
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});


// User Domains
app.get('/users/:user_id/domains', authenticateUser, (req, res) => {
  const user_id = req.params['user_id'];

  db.get_user_domains(user_id)
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.post('/users/:user_id/domains', authenticateUser, (req, res) => {
  const user_id = req.params['user_id'];
  var { name, end } = req.body;

  if (end) { end = new Date(end); }
  else { res.status(400).send(); }

  db.add_user_domain(user_id, { name, end })
    .then((result) => {
      if (result) { res.status(201).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});


// Domains
app.get('/domains/:domain_id/subdomains', authenticateUser, (req, res) => {
  const domain_id = req.params['domain_id'];

  db.get_domains_by_user_domain(domain_id)
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.get('/domains/:domain_id/tasks', authenticateUser, (req, res) => {
  const domain_id = req.params['domain_id'];
  
  db.get_tasks(domain_id)
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.get('/domains/:domain_id', authenticateUser, (req, res) => {
  const domain_id = req.params["domain_id"];

  db.get_subdomains_and_tasks(domain_id)
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});

app.post('/domains/:domain_id', authenticateUser, (req, res) => {
  const parent_id = req.params['domain_id'];
  var { name, end } = req.body;

  if (end) { end = new Date(end); }
  else { res.status(400).send(); }

  db.add_domain(parent_id, { name, end })
    .then((result) => {
      if (result) { res.status(201).send(result); }
      else { res.status(409).send(); }
    })
    .catch((error) => console.error(error));
});
app.put('/domains/:domain_id', authenticateUser, (req, res) => {
  const domain_id = req.params['domain_id'];
  var { name, end } = req.body;
  end = end ? new Date(end) : end;

  db.update_domain(domain_id, { name, end })
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.delete('/domains/:domain_id', authenticateUser, (req, res) => {
  const domain_id = req.params['domain_id'];

  db.remove_domain(domain_id)
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});


// Tasks
app.get('/tasks/:task_id/list', authenticateUser, (req, res) => {
  const task_id = req.params['task_id'];

  db.get_list_items_by_task(task_id)
    .then((result) => {
      if (result) { res.status(200).send(result); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.post('/domains/:domain_id/tasks/:group?/:order?', authenticateUser, (req, res) => {
  const domain_id = req.params['domain_id'];
  const { group, order } = req.query;
  var { name, notes, do_date, due_date, completed } = req.body;

  if (do_date) { do_date = new Date(do_date); }
  if (due_date) { due_date = new Date(due_date); }
  completed = completed ? true : false;   // 1: true, 0: false
  
  db.add_task(domain_id,
                        { name, notes, do_date, due_date, completed },
                        group, order)
    .then((result) => {
      if (result) { res.status(201).send(result); }
      else { res.status(409).send(); }
    })
    .catch((error) => console.error(error));
});
app.put('/tasks/:task_id/:group?/:order?', authenticateUser, (req, res) => {
  const task_id = req.params['task_id'];
  const { group, order } = req.query;
  var { name, notes, $do, $due, completed } = req.body;

  if ($do) { $do = new Date($do); }
  if ($due) { $due = new Date($due); }
  completed = completed ? true : false;   // 1: true, 0: false

  db.update_task(task_id, { name, notes, $do, $due, completed }, group, order)
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.delete('/tasks/:task_id', authenticateUser, (req, res) => {
  const task_id = req.params['task_id'];

  db.remove_task(task_id)
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});


// List Items
app.post('/tasks/:task_id/items', authenticateUser, (req, res) => {
  const task_id = req.params['task_id'];
  var { name, completed } = req.body;

  completed = completed ? true : false;   // 1: true, 0: false

  db.add_list_item(task_id, { name, completed })
    .then((result) => {
      if (result) { res.status(201).send(); }
      else { res.status(409).send(); }
    })
    .catch((error) => console.error(error));
});
app.put('/items/:item_id', authenticateUser, (req, res) => {
  const item_id = req.params['item_id'];
  var { name, completed } = req.body;

  completed = completed ? true : false;   // 1: true, 0: false

  db.update_list_item(item_id, { name, completed })
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});
app.delete('/items/:item_id', authenticateUser, (req, res) => {
  const item_id = req.params['item_id'];

  db.remove_list_item(item_id)
    .then((result) => {
      if (result) { res.status(204).send(); }
      else { res.status(404).send(); }
    })
    .catch((error) => console.error(error));
});


// Schedule
// app.get('/users/:user_id/schedule', (req, res) => {

// });
// app.post('/users/:user_id/schedule', (req, res) => {

// });
// app.get('/schedule/:schedule_id', (req, res) => {

// });
// app.get('/schedule/:schedule_id', (req, res) => {

// });