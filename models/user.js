module.exports = (sequelize, type) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: type.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: type.STRING(128),
        allowNull: false
      },
      email: {
        type: type.STRING(128),
        allowNull: false
      },
      password: {
        type: type.STRING(128),
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  );

  return user;
};
