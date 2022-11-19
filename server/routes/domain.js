const router = require("express").Router();
const { getDomain } = require("../controllers/domain");

module.exports = router;

router.get("/:domain", getDomain);
