const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection'); 

const checkAuth = (context) => {
  if (!context.user || !context.user.id) {
    throw new Error("Authentication required: Please log in.");
  }
  return context.user;
};

const resolvers = {
  Query: {
    blogs: async () => {
      try {
        return await db.Blogs.findAll({
          include: [{ model: db.Users, as: 'author' }],
        });
      } catch (error) {
        throw new Error("Failed to fetch blogs.");
      }
    },
    blog: async (_, { id }) => {
      const blog = await db.Blogs.findByPk(id, {
          include: [{ model: db.Users, as: 'author' }],
      });
      if (!blog) throw new Error("Blog not found.");
      return blog;
    }
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      const { usersEmail, usersPassword, usersRole } = input;
      let userExists = await db.Users.findOne({ where: { usersEmail } });

      if (userExists) {
        throw new Error("User already exists.");
      }
      
      const hashedPasword = await bcrypt.hash(usersPassword, 10);
      const newUser = await db.Users.create({
        usersEmail,
        usersPassword: hashedPasword,
        usersRole: usersRole || 'user',
      });

      const token = jwt.sign(
        { id: newUser.id, usersRole: newUser.usersRole },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return { token, user: newUser };
    },

    loginUser: async (_, { input }) => {
      const { usersEmail, usersPassword } = input;
      const userExisting = await db.Users.findOne({ where: { usersEmail } });

      if (!userExisting) {
        throw new Error("Invalid credentials.");
      }

      const isMatch = await bcrypt.compare(usersPassword, userExisting.usersPassword);
      if (!isMatch) {
        throw new Error("Invalid credentials.");
      }

      const token = jwt.sign(
        { id: userExisting.id, usersRole: userExisting.usersRole },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return { token, user: userExisting };
    },

    addBlog: async (_, { input }, context) => {
      const { id: userId, usersRole } = checkAuth(context); // Auth check
      const { blogTitle, blogAuthor, blogContent, blogStatus } = input;

      const newBlog = await db.Blogs.create({
        blogTitle, blogAuthor, blogContent, blogStatus,
        userId: userId, 
      });
      
      return await db.Blogs.findByPk(newBlog.id, { include: [{ model: db.Users, as: 'author' }] });
    },

    editBlog: async (_, { id, input }, context) => {
      const { id: userId, usersRole } = checkAuth(context);
      const blog = await db.Blogs.findByPk(id);

      if (!blog) throw new Error("Blog not found.");
      
      if (blog.userId !== userId && usersRole !== "admin") {
          throw new Error("Forbidden: You cannot edit this blog.");
      }

      await db.Blogs.update(input, { where: { id } });
      
      return await db.Blogs.findByPk(id, { include: [{ model: db.Users, as: 'author' }] });
    },

    deleteBlog: async (_, { id }, context) => {
      const { id: userId, usersRole } = checkAuth(context);
      const blog = await db.Blogs.findByPk(id);

      if (!blog) throw new Error("Blog not found.");

      if (blog.userId !== userId && usersRole !== "admin") {
        throw new Error("Forbidden: You cannot delete this blog.");
      }
      
      await db.Blogs.destroy({ where: { id } });
      return "Blog deleted successfully.";
    }
  },
};

module.exports = resolvers;