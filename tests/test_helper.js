const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Test Houses",
    author: "John Morrison",
    url: "https://example.com/test",
    likes: 2,
  },
  {
    title: "Test Crianlarich",
    author: "Johnson McGuire",
    url: "https://example.com/crianlarich",
    likes: 4,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "Test Delete",
    author: "Will delete soon",
    url: "https://example.com",
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};