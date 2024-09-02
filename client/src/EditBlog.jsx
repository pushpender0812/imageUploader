import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploading from 'react-images-uploading';
import { FaEdit, FaTimes } from 'react-icons/fa';

const EditBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [tags, setTags] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);
  const maxNumber = 69;
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:8000/blog/view-singleBlog/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setBlog(data);
          const fetchedImages = data.image.image.map((item) => ({
            data_url: `http://localhost:8000/uploads/images/${item}`,
          }));
          setImages(fetchedImages);
          setVideoName(data.videos || '');
          setSelectedTags(data.tag || []);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(`Error while fetching blog: ${error}`);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:8000/blog/view-tags', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

    fetchBlog();
    fetchTags();
  }, [id]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setBlog(prevBlog => ({
      ...prevBlog,
      [name]: value,
    }));
  };

  const handleTagChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedTags(selectedValues);
  };

  const handleFileChange = (e) => {
    if (e.target.name === "images") {
      setImages(e.target.files);
    } else if (e.target.name === "video") {
      setVideo(e.target.files[0]);
    }
  };

  const handleImageDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/blog/delete-image/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while deleting image: ${error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('title', blog.title);
    formDataToSend.append('description', blog.description);
    formDataToSend.append('slug', blog.slug);

    images.forEach((image) => {
      if (image.file) {
        formDataToSend.append('image', image.file);
      } else {
        formDataToSend.append('image', image.data_url);
      }
    });

    if (video) {
      formDataToSend.append('videos', video);
    }

    selectedTags.forEach(tag => {
      formDataToSend.append('tag', tag);
    });

    try {
      const response = await fetch(`http://localhost:8000/blog/update-blog/${id}`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/view');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(`Error while updating blog: ${error}`);
    }
  };

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  return (
    <div>
      <h3>Edit Blog</h3>
      {blog ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Enter Title</label>
            <input
              type="text"
              placeholder="Enter title for blog..."
              value={blog.title || ''}
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
              value={blog.description || ''}
              onChange={handleInput}
              name="description"
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="tag">Select Tag</label>
            <select
              value={selectedTags}
              onChange={handleTagChange}
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
            <br />
            <br />
            <div className="container mt-4">
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper text-center">
                    <p
                      className={`btn btn-${isDragging ? 'danger' : 'primary'} mb-2`}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      Click or Drop here
                    </p>
                    &nbsp;
                    <p className="btn btn-secondary mb-2" onClick={onImageRemoveAll}>
                      Remove all images
                    </p>

                    <div className="d-flex flex-wrap justify-content-start mt-3">
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item position-relative m-2">
                          <img
                            src={
                              image.data_url.startsWith('http')
                                ? image.data_url
                                : URL.createObjectURL(image.file)
                            }
                            alt=""
                            className="img-thumbnail fixed-size"
                          />
                          <div className="overlay d-flex justify-content-center align-items-center">
                            <p
                              onClick={() => onImageUpdate(index)}
                              className="btn btn-sm btn-outline-primary me-1"
                            >
                              <FaEdit />
                            </p>
                            <p
                              onClick={() => onImageRemove(index)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <FaTimes />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>
            </div>
          </div>
          <div>
            <label htmlFor="video">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              name="video"
            />
          </div>
          <br />
          <div>
            <label htmlFor="slug">Enter Slug</label>
            <input
              type="text"
              placeholder="Add Slug"
              value={blog.slug || ''}
              onChange={handleInput}
              name="slug"
              required
            />
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditBlog;
