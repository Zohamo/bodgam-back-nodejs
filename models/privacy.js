module.exports = (sequelize, type) => {
  const privacy = sequelize.define(
    "privacy",
    {
      showBggName: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      showBirthdate: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      showEmail: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      showPhoneNumber: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      showWebsite: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      profileId: {
        type: type.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true
      }
    },
    {
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false
    }
  );

  return privacy;
};
