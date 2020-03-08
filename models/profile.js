module.exports = (sequelize, type) => {
  const profile = sequelize.define(
    "profile",
    {
      id: {
        type: type.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      isActive: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      name: type.STRING(36),
      email: {
        type: type.STRING(100),
        allowNull: false
      },
      // Details
      avatar: type.STRING(128),
      gender: type.ENUM("MALE", "FEMALE", "OTHER"),
      description: type.STRING,
      birthdate: type.DATE,
      // Address
      district: type.STRING(36),
      city: type.STRING(36),
      country: type.STRING(3),
      bggName: type.STRING(36),
      phoneNumber: type.STRING(24),
      website: type.STRING(36),

      // Foreign Keys

      userId: {
        type: type.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true
      }
    },
    {
      paranoid: true
    }
  );

  return profile;
};
