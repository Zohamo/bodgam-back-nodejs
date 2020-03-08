module.exports = (app, models, passport, jwt, jwtOptions) => {
  const prepareUserRes = user =>
    Object.assign({
      id: user.id,
      email: user.email,
      name: user.name,
      token: jwt.sign(
        { id: user.id, email: user.email },
        jwtOptions.secretOrKey
      )
    });

  // register route
  app.post("/api/register", (req, res) => {
    console.log("register body", req.body);
    models.user.create(req.body).then(user => {
      res.json(prepareUserRes(user.dataValues));
    });
  });

  // login route
  app.post("/api/login", (req, res) => {
    console.log("login body", req.body);
    const { email, password } = req.body;
    if (email && password) {
      models.user
        .findOne({
          where: { email: email },
          attributes: ["id", "name", "email", "password"]
        })
        .then(user => {
          console.log("login findOne user", user.dataValues);
          if (!user) {
            res.status(401).json({ msg: "No such user found", user });
          } else if (user.password === password) {
            res.json(prepareUserRes(user.dataValues));
          } else {
            res.status(401).json({ msg: "Password is incorrect" });
          }
        });
    }
  });

  // protected route
  app.get(
    "/api/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json({
        msg: "Congrats! You are seeing this because you are authorized"
      });
    }
  );
};
