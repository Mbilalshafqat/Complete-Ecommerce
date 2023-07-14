const express = require("express");
const router = express.Router();
const controller = require("../Controller/Payment");

router.post("/stripepaymentProcess", controller.paymentProcessStripe);
router.get("/getStripiApiKey", controller.getStripeApiKey);

module.exports = router;
