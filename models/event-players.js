module.exports = (sequelize, type) => {
  const Event_Players = sequelize.define(
    "event_players",
    {
      selfGranted: type.BOOLEAN
    },
    { timestamps: false }
  );

  return Event_Players;
};
