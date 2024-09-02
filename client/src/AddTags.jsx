import React, { useState } from "react";
import { Navigate, NavLink } from "react-router-dom";

const AddTags = () => {
  const [tags, setTags] = useState({ tags: "" });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;



    setTags({
      ...tags,
      [name]: value,
    });
  };
  console.log(tags,"pushpender yadav")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/blog/add-tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tags),
      });

      const data = await response.json();

      if (response.ok) {
        setTags('')
        alert(data.message);
        
      } else {
        setTags('')
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while adding blog tags: ${error}`);
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tags">Add Tags</label>
          <br />
          <input
            type="text"
            placeholder="Enter tag name....."
            value={tags.tags}
            name="tags"
            onChange={handleInput}
          />
          <button type="submit">Add</button>
        </div>
      </form>
      <div>
        <br />
        <br />
        <br />
        <br />
        <div>
          <NavLink to={"/add"}>
            <button>Add Blogs</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AddTags;
