const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const newLikes = {
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newLikes, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
