module.exports = (sequelize, type) => {
  const event = sequelize.define("event", {
    id: {
      type: type.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: type.STRING(128),
      allowNull: false
    },
    isPrivate: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    // Datetime

    startDatetime: {
      type: type.DATE,
      allowNull: false
    },
    endDatetime: type.DATE,

    // Location

    locationId: {
      type: type.INTEGER.UNSIGNED,
      allowNull: false
    },

    // Players

    userId: {
      type: type.INTEGER.UNSIGNED,
      allowNull: false
    },
    minPlayers: {
      type: type.INTEGER(3).UNSIGNED,
      allowNull: false
    },
    maxPlayers: type.INTEGER(12).UNSIGNED,

    // Details

    description: type.STRING,
    level: type.INTEGER(2).UNSIGNED,
    atmosphere: type.INTEGER(2).UNSIGNED
  });

  return event;
};
