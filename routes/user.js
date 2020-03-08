const argon2 = require("argon2");

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
    console.log("REGISTER body", req.body);
    const userReq = Object.assign({}, req.body);
    argon2.hash(req.body.password).then(passwordHashed => {
      userReq.password = passwordHashed;
      console.log("REGISTER userReq", userReq);

      models.user.create(userReq).then(user => {
        res.json(prepareUserRes(user.dataValues));
      });
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
        .then(userRes => {
          console.log("login findOne user", userRes.dataValues);
          if (!userRes) {
            res.status(401).json({ msg: "No such user found", userRes });
          } else {
            argon2.verify(userRes.password, password).then(correctPassword => {
              if (!correctPassword) {
                res.status(401).json({ msg: "Password is incorrect" });
              } else {
                res.json(prepareUserRes(userRes.dataValues));
              }
            });
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
