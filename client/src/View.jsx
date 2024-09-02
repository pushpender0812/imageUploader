import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './App.css'; // Make sure to create this CSS file or adjust according to your CSS setup

const View = () => {
  const [blog, setBlog] = useState([]);

  const viewBlogs = async () => {
    try {
      const response = await fetch("http://localhost:8000/blog/view-blog", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBlog(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while fetching blogs: ${error}`);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/blog/delete-blog?id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setBlog((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        alert('Blog deleted successfully');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while deleting blog: ${error}`);
    }
  };

  console.log(blog,"djflg;iyg ");
  

  useEffect(() => {
    viewBlogs();
  }, []);

  return (
    <div className="blog-container">
      {blog.map((item, index) => (
        <div key={index} className="blog-card">
          <h3 className="blog-title">{item.title}</h3>
          <p className="blog-description">{item.description}</p>
          <p className="blog-tag">Tag: {item.tag}</p>
          <p>Images :</p>
          <div className="blog-images">
            {item.image.image.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:8000/uploads/images/${img}`}
                alt={`Blog image ${i}`}
                className="blog-image"
              />
            ))}
          </div>
          <p>Video</p>
          {item.videos && (
            <div className="blog-video">
              <video controls style={{height:'150px'}}>
                <source
                
                  src={`http://localhost:8000/uploads/videos/${item.videos}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <p className="blog-slug">Blog Slug: {item.slug}</p>
          <button
            className="delete-button"
            onClick={() => deleteBlog(item._id)}
          >
            Delete this blog
          </button>
          <NavLink to={`/edit/${item._id}`}>
            <button className="edit-button">Edit</button>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default View;
