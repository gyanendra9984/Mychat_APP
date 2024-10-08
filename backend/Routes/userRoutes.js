const express = require("express");
const { registerUser, authUser, allUsers } = require("../Controllers/userControllers");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post('/login', authUser);
 
module.exports = router;