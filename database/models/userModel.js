const userModel = (sequelize, DataTypes) => {
    const users = sequelize.define("Users", {
     
       usersEmail: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
        allowNull: false,
       },
       usersPassword: {
        type: DataTypes.STRING,
        allowNull: false,
       },
       usersRole: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false,
       }
    }, {
        tableName: 'Users',
    });
    return users;
};

module.exports = userModel;