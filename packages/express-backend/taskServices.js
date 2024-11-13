// IMPLEMENT DATABASE FUNCTIONS HERE

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'

dotenv.config();

const supabaseUrl = 'https://dqijcwjgiqsztedamstr.supabase.co'
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


async function get_user_domains(user_id, level) {
  const { data, error } = await supabase
    .rpc('get_domains_by_level', { userid: user_id, domain_level: level });

  if (error) {
    console.error('Error fetching Domains:', error);
  } else {
    return data;
  }
}

async function get_tasks_by_domain(domain) {
  const { data, error } = await supabase
    .rpc('get_tasks_by_domain', { domain: domain});

  if (error) {
    console.error('Error fetching Tasks:', error);
  } else {
    return data;
  }
}

async function get_list_items_by_task(task) {
  const { data, error } = await supabase
    .rpc('get_list_items_by_task', { task: task });

    if (error) {
      console.error('Error fetching List Items:', error);
    } else {
      return data;
    }
}

async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('name')

    if (error) {
    console.error('Error fetching tasks:', error);
  } else {
    return data
  }
}

async function addTask(taskToAdd) {
  const {data, error} = await supabase
    .from('tasks')
    .insert(
      [{name:taskToAdd.name}]
    ); // should fit schema

    if (error) {
      console.error('Error adding task:', error);
    } else {
      return data
      // Will return null
    }
} 

async function deleteTask(taskId){
    const {data, error} = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId); //"where value =" clause
    if (error) {
      console.error('Error deleting task:', error)
    } else {
      return "success"
    }
}

async function updateTask(taskId, updates){
    const {data, error} = await supabase
      .from('tasks')
      .update({name: updates.name})
      .eq('id', taskId);
    if (error) {
      console.error('Error updating task:', error)
    } else {
      return "success"
    }
}

export default{
    getTasks,
    addTask,
    deleteTask,
    updateTask,
    get_user_domains,
    get_tasks_by_domain,
    get_list_items_by_task
}