const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const sequelize = new Sequelize(CONNECTION_STRING);

const blogs = require('./models/blogModel')(sequelize, DataTypes);
const users = require('./models/userModel')(sequelize, DataTypes);

blogs.belongsTo(users, {
    as: 'author',      
    foreignKey: 'userId' 
});

users.hasMany(blogs, {
    as: 'blogs'        
});

sequelize.authenticate()
    .then(() => {
        console.log("Supabase Connection Done");
    })
    .catch((err) => {
        console.log("Connection Error:", err);
    });

sequelize.sync({ force: false, alter: true }).then(() => {
    console.log(" Database Synced");
});

// Exporting the models to be used in resolvers
const db = {
    sequelize,
    Blogs: blogs,
    Users: users,
};

module.exports = db;