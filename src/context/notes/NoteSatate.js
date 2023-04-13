import React from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes);
  //get note
  const getNote = async () => {
    //To do api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQyY2ZkNTI0NjE2YjVkNDJlNTFiODk0In0sImlhdCI6MTY4MDg0NDEyOX0.ZTD9fN9j85FFlwIWRVxsTglc95qEPeYmX_saPsBvPVY",
      },
    });
    const json = await response.json()
    
    setNotes(json)
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    //To do api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQyY2ZkNTI0NjE2YjVkNDJlNTFiODk0In0sImlhdCI6MTY4MDg0NDEyOX0.ZTD9fN9j85FFlwIWRVxsTglc95qEPeYmX_saPsBvPVY",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note= await response.json();
       
    setNotes(notes.concat(note));
  };
  //Delete a Note
  const deleteNote = async(id) => {
    console.log("deleting the note with id " + id);
    //To Do API call..
    
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
  
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQyY2ZkNTI0NjE2YjVkNDJlNTFiODk0In0sImlhdCI6MTY4MDg0NDEyOX0.ZTD9fN9j85FFlwIWRVxsTglc95qEPeYmX_saPsBvPVY",
        },
        
      });
      const json = response.json();
      
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  }
  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQyY2ZkNTI0NjE2YjVkNDJlNTFiODk0In0sImlhdCI6MTY4MDg0NDEyOX0.ZTD9fN9j85FFlwIWRVxsTglc95qEPeYmX_saPsBvPVY",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    


    let newNotes = JSON.parse(JSON.stringify(notes))
    //logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes)
  };
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
