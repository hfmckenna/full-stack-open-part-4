const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  author: {
    type: String,
    required: true,
    minlength: 2,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: false,
    default: 0,
  },
});

// Apply the uniqueValidator plugin to blogSchema.
blogSchema.plugin(uniqueValidator);

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
