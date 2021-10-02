const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const userExtractor = require("../utils/middleware").userExtractor;

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .find({})
    .populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = new Blog({ ...request.body, user: user });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();
  response.json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user;

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    return response
      .status(401)
      .json({ error: "unauthorised: permission denied" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const newLikes = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    newLikes,
    {
      new: true,
    }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
