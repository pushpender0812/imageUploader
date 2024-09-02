import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Add = () => {
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: [], 
    slug: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const viewTags = async () => {
    try {
      const response = await fetch("http://localhost:8000/blog/view-tags", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTags(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while fetching tags: ${error}`);
    }
  };

  // const handleInput = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;

  //   if (name === "tag") {
      
  //     const options = e.target.options;
  //     const selectedTags = [];
  //     for (let i = 0; i < options.length; i++) {
  //       if (options[i].selected) {
  //         selectedTags.push(options[i].value);
  //       }
  //     }
  //     setFormData({
  //       ...formData,
  //       [name]: selectedTags,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };

  const handleFileChange = (e) => {
    if (e.target.name === "images") {
      setImages(e.target.files);
    } else if (e.target.name === "video") {
      setVideo(e.target.files[0]); 
    }
  };

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
  
    if (name === "tag") {
      const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({
        ...formData,
        [name]: selectedTags,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    for (let i = 0; i < images.length; i++) {
      formDataToSend.append("image", images[i]);
    }
  
    if (video) {
      formDataToSend.append("videos", video);
    }
  
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tag", JSON.stringify(formData.tag));
    formDataToSend.append("slug", formData.slug);
  
    try {
      const response = await fetch("http://localhost:8000/blog/add-blog", {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        setFormData({
          title: "",
          description: "",
          tag: [],
          slug: "",
        });
        setImages([]);
        setVideo(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while adding blog ${error}`);
    }
  };
  

  useEffect(() => {
    viewTags();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Enter Title</label>
          <input
            type="text"
            placeholder="Enter title for blog..."
            value={formData.title}
            onChange={handleInput}
            name="title"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="description">Enter Description</label>
          <input
            type="text"
            placeholder="Enter description for blog..."
            value={formData.description}
            onChange={handleInput}
            name="description"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="tag">Select Tags</label>
          <select
            value={formData.tag}
            onChange={handleInput}
            name="tag"
            multiple 
            required
          >
            {tags.map(tag => (
              <option key={tag._id} value={tag.tags}>
                {tag.tags}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            onChange={handleFileChange}
            name="images"
            multiple
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="video">Upload Video</label>
          <input
            type="file"
            onChange={handleFileChange}
            name="video"
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="slug">Enter Slug</label>
          <input
            type="text"
            placeholder="Add Slug"
            value={formData.slug}
            onChange={handleInput}
            name="slug"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <NavLink to={"/view"}>
        <button>View Blogs</button>
      </NavLink>
    </div>
  );
};

export default Add;
