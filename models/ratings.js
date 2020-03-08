module.exports = (sequelize, type) => {
  const ratings = sequelize.define(
    "ratings",
    {
      reception: {
        type: type.STRING,
        defaultValue: "",
        get() {
          return "test";
        },
        set(val) {
          this.setDataValue("reception", val.join(";"));
        }
      },
      teaching: {
        type: type.STRING,
        defaultValue: "",
        get() {
          return this.getDataValue("teaching")
            .split(";")
            .map(val => parseInt(val));
        },
        set(val) {
          this.setDataValue("teaching", val.join(";"));
        }
      },
      liking: {
        type: type.STRING,
        defaultValue: "",
        get() {
          return this.getDataValue("liking")
            .split(";")
            .map(val => parseInt(val));
        },
        set(val) {
          this.setDataValue("liking", val.join(";"));
        }
      },
      humility: {
        type: type.STRING,
        defaultValue: "",
        get() {
          return this.getDataValue("humility")
            .split(";")
            .map(val => parseInt(val));
        },
        set(val) {
          this.setDataValue("humility", val.join(";"));
        }
      },
      honesty: {
        type: type.STRING,
        defaultValue: "",
        get() {
          return this.getDataValue("honesty")
            .split(";")
            .map(val => parseInt(val));
        },
        set(val) {
          this.setDataValue("honesty", val.join(";"));
        }
      },
      speed: {
        type: type.STRING,
        defaultValue: "",
        get() {
          return this.getDataValue("speed")
            .split(";")
            .map(val => parseInt(val));
        },
        set(val) {
          this.setDataValue("speed", val.join(";"));
        }
      },
      profileId: {
        type: type.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false
    }
  );

  return ratings;
};
