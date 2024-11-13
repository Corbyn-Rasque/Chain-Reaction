// src/MyApp.jsx (Empty State)
// eslint-disable-next-line no-unused-vars
import React, {useState,useEffect} from "react";
import Table from "./table";
import Form from "./Form"; //Needs to be after table

function MyApp() {
  const [characters, setCharacters] = useState([]);  

 

  function updateList(person) {
    postUser(person) //Contains the promise
      .then((res) => {
        if (res.status === 201){
          return res.json()  // Parse the JSON from the response
        } else {
          return undefined
        }
      })                                 
      .then((user) => {  
        if (user !== undefined){
          setCharacters([...characters,user]) //changes state of response from backend, not the promise
        }
      })  
      .catch((error) => {
        console.log(error);
      });
  } 
  
  function fetchUsers(){
    const promise = fetch("http://localhost:8000/users");
    return promise
  }

  function postUser(person){
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",//tells server is a json object
      },
      body: JSON.stringify(person), //Serialize JSON to string to pass (Only name + job)
    })
    
    return promise
  }



  function removeOneCharacter(index){
    const userToDelete = characters[index];
    deleteUser(userToDelete)
      .then((response) => {
        if (response.status === 204){
          console.log("No Content")
          const updated = characters.filter((character, i) => { //Only update state if backend sends 204
            return i !== index;
          });
          setCharacters(updated);
        } else if (response.status === 404){
          console.log("Resource Not Found")
        }
      })
      .catch((error) => {
        console.log(error)
      });
    
  } 

  function deleteUser(person){
    let partialLink = "http://localhost:8000/users/"
    const personId = person["_id"]
    let uri = partialLink.concat(personId);
    const promise = fetch(uri, {
      method: "DELETE"
    })
    return promise
  // before fetch, make a string of the url for string interpolarization, and then do fetch on said string
  }


  //Fetch Users from backend and load into state (Refresh)
  //Runs when Promise Fullfilled Successfully  
  useEffect(() => {
    fetchUsers()
            .then((res) => res.json()) //Is a promise to return once decoded
            .then((json) => setCharacters(json))
            .catch((error) => { console.log(error); });
  },[]); //[] argument to ensure only runs at first mount (do not touch main data once in state)
  

  
  
  //Display
  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit = {updateList} />
    </div>
  );
}

//Allows component to be importable
export default MyApp;