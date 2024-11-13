// IMPLEMENT DATABASE FUNCTIONS HERE

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqijcwjgiqsztedamstr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxaWpjd2pnaXFzenRlZGFtc3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NDEwOTYsImV4cCI6MjA0NjMxNzA5Nn0.QQcifD-QvG5_WBWAdunp_mGz7SqNerzKs3yoCYhN8cU'
const supabase = createClient(supabaseUrl, supabaseKey);

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
    updateTask
}