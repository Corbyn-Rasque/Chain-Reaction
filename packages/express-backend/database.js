import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config();
const { Pool, Client } = pg
const connectionString = process.env.POSTGRES_URI;
const db = new Pool({ connectionString, })


// User
async function get_user(user) {
  const query =  'SELECT id \
                  FROM users \
                  WHERE email = $1'

  try {
    const id = await db.query(query, [user.email])
    if (id.rowCount) { return id.rows; }
    else { return false}; 
  }
  catch (error) {
    console.error('Error adding user:', error);
  }
}
async function add_user(user) {
  const query =  'INSERT INTO Users (email, password) \
                  VALUES ($1, $2) \
                  ON CONFLICT (email) DO NOTHING \
                  RETURNING id'

  try {
    const id = await db.query(query, [user.email, user.password])
    if (id.rowCount) { return id.rows; }
    else { return false}; 
  }
  catch (error) {
    console.error('Error adding user:', error);
  }
}
async function update_user(user_id, user) {
  const query =  'UPDATE Users \
                  SET email     = COALESCE($2, email), \
                      password  = COALESCE($3, password) \
                  WHERE id = $1 AND \
                    ROW(COALESCE($2, email), COALESCE($3, password)) \
                    IS DISTINCT FROM \
                    ROW(email, password)'
  
  try {
    const res = await db.query(query, [user_id, user.email, user.password]);
    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error updating email or password:', error);
  }
}
async function remove_user(user_id) {
  const query =  'DELETE FROM Users \
                  WHERE id = $1'

  try {
    const res = await db.query(query, [user_id]);
    if (res.rowCount) { return true; }
    else { return false; }; 
  }
  catch (error) {
    console.error('Error removing user:', error);
  }   
}


// User Domains
async function get_user_domains(user_id) {
  const query =  'SELECT domains.id AS id, domains.name AS name, domains.end AS end \
                  FROM user_domains \
                  JOIN domains ON domains.id = user_domains.domain_id \
                  WHERE id = $1'
  try {
    const domains = await db.query(query, [user_id]);
    if (domains.rowCount) { return domains.rows; }
    else { return []; }
  }
  catch (error) {
    console.error('Error fetching domains:', error);
  }
}
async function add_user_domain(user_id, domain) {
  const query =  'WITH new_domain AS (INSERT INTO domains (name, "end") \
                                      VALUES($2, $3) \
                                      RETURNING id) \
                  INSERT INTO user_domains (user_id, domain_id) \
                  SELECT $1, id \
                  FROM new_domain \
                  RETURNING domain_id;';
  
  try {
    const res = await db.query(query, [user_id, domain.name, domain.end])
    if (res.rowCount) { return res.rows; }
    else { return false; }
  }
  catch (error) {
    console.error('Error adding domain:', error);
  }
}


// Domains
async function get_domains_by_user_domain(user_domain_id) {
  const query =  'SELECT id, name, "end" \
                  FROM domain_relations \
                  JOIN domains ON domains.id = domain_relations.child_id \
                  WHERE domain_relations.parent_id = $1'

  try{
    const res = await db.query(query, [user_domain_id]);
    return res.rows;
  }
  catch (error) {
    console.error('Error fetching subdomains:', error);
  }
}
async function get_subdomains_and_tasks(user_domain_id) {
  const query =  'WITH RECURSIVE all_domains AS ( SELECT parent_id, \
                                                         child_id, \
                                                         1 AS depth \
                                                  FROM users \
                                                  JOIN user_domains ON user_domains.user_id = users.id \
                                                  JOIN domain_relations ON domain_relations.parent_id = user_domains.domain_id \
                                                  WHERE domain_relations.parent_id = $1 \
                                                  \
                                                  UNION ALL \
                                                  \
                                                  SELECT domain_relations.parent_id, \
                                                         domain_relations.child_id, \
                                                         all_domains.depth + 1 \
                                                  FROM domain_relations \
                                                  JOIN all_domains ON domain_relations.parent_id = all_domains.child_id ), \
                                                  \
                             tasks_by_domain AS ( SELECT domain_id, id, \
                                                         tasks."group", "order", \
                                                         name, notes, \
                                                         "do", due, \
                                                         completed \
                                                  FROM tasks \
                                                  JOIN domain_tasks ON domain_tasks."group" = tasks."group" ), \
                                                  \
                        tasks_grouped_sorted AS ( SELECT domain_id, \
                                                         jsonb_agg(jsonb_build_object(\'id\',         id, \
                                                                                      \'group\',      "group", \
                                                                                      \'order\',      "order", \
                                                                                      \'name\',       name, \
                                                                                      \'notes\',      notes, \
                                                                                      \'do\',         "do", \
                                                                                      \'due\',        due, \
                                                                                      \'completed\',  completed )\
                                                  ORDER BY "group" ASC, "order" ASC) AS tasks \
                                                  FROM tasks_by_domain \
                                                  GROUP BY domain_id ) \
                  SELECT all_domains.parent_id, \
                         domains.id, \
                         domains.name, \
                         domains.end, \
                         CASE \
                            WHEN bool_and(tasks_grouped_sorted.tasks IS NULL) THEN NULL \
                            ELSE tasks_grouped_sorted.tasks \
                         END AS tasks \
                  FROM all_domains \
                  JOIN domains ON all_domains.child_id = domains.id \
                  LEFT JOIN tasks_grouped_sorted ON tasks_grouped_sorted.domain_id = domains.id \
                  GROUP BY tasks_grouped_sorted.tasks, \
                           all_domains.parent_id, \
                           domains.id, \
                           domains.name, \
                           domains.end \
                  ORDER BY domains.id;'

  try {
    const res = await db.query(query, [user_domain_id])

    if (res.rowCount) { return res.rows; }
    else { return false; }
  }
  catch(error) {
    console.error('Error getting domains & tasks:', error);
  }
}
async function get_tasks(domain_id) {
  const query =  'SELECT id, tasks."group", "order", name, notes, "do", due, completed \
                  FROM domain_tasks \
                  JOIN tasks ON tasks.group = domain_tasks.group\
                  WHERE domain_tasks.domain_id = $1 \
                  GROUP BY id, tasks."group" \
                  ORDER BY "group" ASC, "order" ASC'

  try{
    const tasks = await db.query(query, [domain_id]);
    return tasks.rows;
  }
  catch (error) {
    console.error('Error fetching subdomains:', error);
  }
}
async function add_domain(parent_id, domain) {
  const query =  'WITH new_domain AS (INSERT INTO domains (name, "end") \
                                      VALUES ($2, $3) \
                                      RETURNING id) \
                  INSERT INTO domain_relations (parent_id, child_id) \
                  SELECT $1, id \
                  FROM new_domain \
                  RETURNING child_id;';

  try {
    const res = await db.query(query, [parent_id, domain.name, domain.end])
    if (res.rowCount) { return res.rows; }
    else { return false; }
  }
  catch (error) {
    console.error('Error adding domain:', error);
  }
}
async function update_domain(domain_id, domain) {
  const query =  'UPDATE domains \
                  SET name = COALESCE($2, name), "end" = COALESCE($3, "end") \
                  WHERE id = $1 AND \
                    ROW(COALESCE($2, name), COALESCE($3, "end")) \
                    IS DISTINCT FROM \
                    ROW(name, "end")'

  try {
    const res = await db.query(query, [domain_id, domain.name, domain.end])
    if (res.rowCount) { return res.rowCount; }
    else { return res.rowCount; }
  }
  catch (error) {
    console.error('Error updating domain:', error);
  }
}
async function remove_domain(domain_id) {
  const query =  'DELETE FROM domains \
                  WHERE id = $1';

  try{
    const res = await db.query(query, [domain_id]);
    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error deleting domain:', error);
  }
}


// Tasks
async function add_task(domain_id, task, group, order) {
  const new_group =  'WITH new_group AS (INSERT INTO domain_tasks (domain_id, "group") \
                                         VALUES ($1, DEFAULT) \
                                         RETURNING "group") \
                      INSERT INTO tasks ("group", "order", \
                                          name, notes, "do", due, completed) \
                      SELECT new_group."group", 1, $2, $3, $4, $5, $6 \
                      FROM new_group \
                      RETURNING id';

  const cur_group =  'INSERT INTO tasks ("group", "order", \
                                          name, notes, "do", due, completed) \
                      SELECT $1, (SELECT MAX("order") + 1 \
                                  FROM tasks \
                                  GROUP BY "group" \
                                  HAVING "group" = $1 \
                                  LIMIT 1), $2, $3, $4, $5, $6 \
                      RETURNING id';

  const ordering = 'UPDATE tasks \
                    SET "order" = "order" + 1 \
                    WHERE "group" = $1 AND "order" >= $2';

  const insert = 'INSERT INTO tasks ("group", "order", \
                                      name, notes, "do", due, completed) \
                  VALUES ($1, $2, $3, $4, $5, $6, $7)';

  try{
    var res, res1;
    if (!group && !order) {
      res = await db.query(new_group, [domain_id,
                                       task.name, task.notes,
                                       task.do, task.due,
                                       task.completed]);
      res = res.rowCount
    }
    else if (!order) {
      res = await db.query(cur_group, [group,
                                       task.name, task.notes,
                                       task.do, task.due,
                                       task.completed]);
    }
    else {
      res = await db.query(ordering, [group, order]);
      res1 = await db.query(insert,  [group, order,
                                      task.name, task.notes,
                                      task.do, task.due,
                                      task.completed]);
      res = res.rowCount && res1.rowCount;
    }
    if (res) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error adding task:', error);
  }                                   
}
async function update_task(task_id, updated_task, group, order) {
  const get_order =  'SELECT "order" \
                      FROM tasks \
                      WHERE id = $1';

  const down_list = 'UPDATE tasks \
                     SET "order" = "order" + 1 \
                     WHERE "group" = $2 AND id != $1 \
                       AND "order" >= $4 AND "order" < $3';
                    
  const up_list = 'UPDATE tasks \
                   SET "order" = "order" - 1 \
                   WHERE "group" = $2 AND id != $1 \
                     AND "order" > $3 AND "order" <= $4';
  
  const insert = 'UPDATE tasks \
                  SET "group"   = COALESCE($2, "group"), \
                      "order"   = COALESCE($3, "order"), \
                      name      = COALESCE($4, name), \
                      notes     = COALESCE($5, notes), \
                      "do"      = COALESCE($6, "do"), \
                      due       = COALESCE($7, due), \
                      completed = COALESCE($8, completed) \
                  WHERE id = $1 \
                    AND ROW(COALESCE($2, "group"), \
                            COALESCE($3, "order"), \
                            COALESCE($4, name), \
                            COALESCE($5, notes), \
                            COALESCE($6, "do"), \
                            COALESCE($7, due), \
                            COALESCE($8, completed)) \
                        IS DISTINCT FROM \
                        ROW("group", "order", \
                            name, notes, "do", due, completed)';

  try {
    const current_order = ((await db.query(get_order, [task_id])).rows)[0].order;

    if (order < current_order) {
      await db.query(down_list, [task_id, group, current_order, order]);
    }
    else if (order > current_order) {
      await db.query(up_list, [task_id, group, current_order, order]);
    }

    const res = await db.query(insert, [task_id, group, order,
                                        updated_task.name,  updated_task.notes,
                                        updated_task.do,    updated_task.due,
                                        updated_task.completed]);

    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error updating task:', error);
  }
}
async function remove_task(task_id) {
  const get_info = 'SELECT "group", "order" \
                    FROM tasks \
                    WHERE id = $1';
  
  const drop_orders =  'UPDATE tasks \
                        SET "order" = "order" - 1 \
                        WHERE "group" = $1 AND "order" > $2';
  
  const remove = 'DELETE FROM tasks \
                  WHERE id = $1'

  try {
    var current_info = ((await db.query(get_info, [task_id])).rows)[0];
    await db.query(drop_orders, [current_info.group, current_info.order]);
    const res = await db.query(remove, [task_id]);

    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error removing task:', error);
  }
}
async function get_list_items_by_task(task_id) {
  const query =  'SELECT id, name, completed \
                  FROM list_items \
                  WHERE task_id = $1'
  try {
    const res = await db.query(query, [task_id]);

    if (res.rowCount) { return res.rows; }
    else { return false; }
  }
  catch (error) {
    console.error('Error removing task:', error);
  }
}


// List Items
async function add_list_item(task_id, list_item) {
  const query =  'INSERT INTO list_items (task_id, name, completed) \
                  VALUES ($1, $2, FALSE) \
                  RETURNING id'

  try {
    const res = await db.query(query, [task_id, list_item.name]);

    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error adding list item:', error);
  }
}
async function update_list_item(list_item_id, updated_list_item) {
  const query =  'UPDATE list_items \
                  SET name = COALESCE($2, name), completed = COALESCE($3, completed) \
                  WHERE id = $1 AND ROW(COALESCE($2, name), COALESCE($3, completed)) \
                                    IS DISTINCT FROM \
                                    ROW(name, completed)';

  try {
    const res = await db.query(query, [list_item_id,
                                       updated_list_item.name,
                                       updated_list_item.completed]);

    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch (error) {
    console.error('Error updating list item:', error);
  }
}
async function remove_list_item(list_item_id) {
  const query =  'DELETE FROM list_items \
                  WHERE id = $1';

  try {
    const res = await db.query(query, [list_item_id])

    if (res.rowCount) { return true; }
    else { return false; }
  }
  catch(error) {
    console.error('Error removing list item:', error);
  }
}


// Schedule
async function get_free_time(user_id){ return; }
async function add_free_time(user_id, schedule) { return; }
async function update_free_time(schedule_id, schedule) { return; }
async function remove_free_time(schedule_id) { return; }


export default{
  get_user,
  add_user,
  update_user,
  remove_user,

  get_user_domains,
  add_user_domain,

  get_domains_by_user_domain,
  get_subdomains_and_tasks,
  get_tasks,
  add_domain,
  update_domain,
  remove_domain,

  add_task,
  update_task,
  remove_task,
  get_list_items_by_task,

  add_list_item,
  update_list_item,
  remove_list_item,

  get_free_time,
  add_free_time,
  update_free_time,
  remove_free_time
}