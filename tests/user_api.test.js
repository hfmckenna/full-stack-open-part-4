const bcrypt = require("bcrypt");
const User = require("../models/user");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const mongoose = require("mongoose");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("user must have a user name and password, minimum 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserShortUsername = {
      username: "M",
      name: "Mark",
      password: "abc123",
    };
    const newUserShortPassword = {
      username: "JaneP",
      name: "Jane",
      password: "ab",
    };
    const newUserNoUsername = {
      username: "I",
      name: "Iain",
      password: "a",
    };

    await api
      .post("/api/users")
      .send(newUserShortUsername)
      .expect(({ statusCode, error }) => {
        expect(statusCode).toBe(400);
        expect(error.text).toContain("shorter than the minimum allowed length");
      });
    await api
      .post("/api/users")
      .send(newUserShortPassword)
      .expect(({ statusCode, error }) => {
        expect(statusCode).toBe(400);
        expect(error.text).toContain("shorter than the minimum allowed length");
      });
    await api
      .post("/api/users")
      .send(newUserNoUsername)
      .expect(({ statusCode, error }) => {
        expect(statusCode).toBe(400);
        expect(error.text).toContain("shorter than the minimum allowed length");
      });

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
