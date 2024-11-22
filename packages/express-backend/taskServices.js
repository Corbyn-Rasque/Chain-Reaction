import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config();
const { Pool, Client } = pg
const connectionString = process.env.POSTGRES_URI;
const db = new Pool({ connectionString, })

// User
async function add_user(email, password) { return; }
async function update(user_id, email, password) { return; }


// User Domains
async function get_user_domains(user_id) { return domain_obj_list; }
async function add_user_domain(user_id, domain) { return; }
async function remove_user_domain(user_id, domain) { return; }

// Domains
async function get_domains_by_level(user_id, level) {
  const { data, error } = await supabase
    .rpc('get_domains_by_level', { userid: user_id, domain_level: level });

  if (error) {
    console.error('Error fetching domains:', error);
  } else {
    return data;
  }
}
async function get_tasks(domain) {
  const { data, error } = await supabase
    .rpc('get_tasks_by_domain', { domain: domain});

  if (error) {
    console.error('Error fetching tasks:', error);
  } else {
    return data;
  }
}
async function add_domain(user_id, domain_obj_w_relation) { return; }
async function update_domain(user_id, domain_obj) { return; }
async function remove_domain(user_id, domain_id) { return; }

// Domain Tasks
async function add_domain_task(domain_id) { return tasks_obj; }
async function remove_domain_task(domain_id, task_id) { return; }

// Tasks
async function add_task(task_obj, domain_id) { return; }
async function update_task(task_id) { return; }
async function remove_task(task_id) { return; } // Make sure domain_tasks entry is also removed.
async function get_list_items_by_task(task) {
  const { data, error } = await supabase
    .rpc('get_list_items_by_task', { task: task });

    if (error) {
      console.error('Error fetching list items:', error);
    } else {
      return data;
    }
}

// Schedule
async function add_free_time(schedule_obj) { return; }
async function update_free_time(schedule_obj) { return; }
async function remove_free_time(schedule_obj) { return; }


export default{
  add_user,
  update,

  get_user_domains,
  add_user_domain,
  remove_user_domain,

  get_domains_by_level,
  get_tasks,
  add_domain,
  update_domain,
  remove_domain,

  add_domain_task,
  remove_domain_task,

  add_task,
  update_task,
  remove_task,
  get_list_items_by_task,

  add_free_time,
  update_free_time,
  remove_free_time
}