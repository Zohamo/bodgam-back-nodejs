const SignUpController = require("email/SignUpController");
const VerificationController = require("email/VerificationController");

//POST /signup
router.post("/signup", SignUpController);

// POST /verication?token=[string]&email=[string]
router.post("/verification", VerificationController);
