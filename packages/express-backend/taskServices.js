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
      console.log('Tasks:', data);
    }
  }
  

export default{
    getTasks
}