module.exports = (sequelize, type) => {
  const location = sequelize.define(
    "location",
    {
      id: {
        type: type.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: type.STRING(48),
        allowNull: false
      },
      isDisabled: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isDefault: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isPublic: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      // Address

      address1: type.STRING(36),
      address2: type.STRING(36),
      zipCode: type.INTEGER(8).UNSIGNED,
      district: type.STRING(36),
      city: type.STRING(36),
      country: type.STRING(3),

      // Coordinates

      latitude: {
        type: type.DOUBLE(10, 7),
        allowNull: true,
        defaultValue: null,
        validate: { min: -90, max: 90 }
      },
      longitude: {
        type: type.DOUBLE(11, 7),
        allowNull: true,
        defaultValue: null,
        validate: { min: -180, max: 180 }
      },
      accuracy: type.INTEGER(5).UNSIGNED,

      // Details

      description: type.STRING,
      isAllowedSmoking: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isAccessible: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      validate: {
        bothCoordsOrNone: function() {
          if ((this.latitude === null) !== (this.longitude === null)) {
            throw new Error(
              "Require either both latitude and longitude or neither"
            );
          }
        }
      }
    }
  );

  return location;
};
