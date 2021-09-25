const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("the first note is about houses", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].title).toContain("Houses");
});

test("expect blog entry ids to be defined", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "Theory Of Relativity",
    author: "Julie Anson",
    url: "https://example.com/relativity",
    likes: 7,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain("Theory Of Relativity");
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "Test Delete",
    author: "Will delete soon",
    likes: 0,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("likes value defaults to zero if missing", async () => {
  const newBlog = {
    title: "Windsor Castle",
    author: "Giles Brandreth",
    url: "https://example.com/windsor",
  };

  const blog = await api.post("/api/blogs").send(newBlog);
  expect(blog.body.likes).toEqual(0);
});

afterAll(() => {
  mongoose.connection.close();
});