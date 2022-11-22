const router = require("express").Router();
const { getDomain } = require("../controllers/domain");

router.get("/:domain", getDomain);

module.exports = router;
