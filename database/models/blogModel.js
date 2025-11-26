const blogModel = (sequelize, DataTypes) => {
    const blogs = sequelize.define("Blogs", {
       
        blogTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        blogAuthor: { 
          type: DataTypes.STRING,
        },
        blogContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        blogStatus: {
            type: DataTypes.STRING,
            defaultValue: "active"
        },
        blogPublishDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        
    }, {
        tableName: 'Blogs',
    });
    return blogs;
};

module.exports = blogModel;