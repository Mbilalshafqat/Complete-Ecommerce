const express = require("express");
const router = express.Router();
const TokenVerfy = require("../middleware/VerifyToken");
const ShopTokenVerify = require("../middleware/ShopOwner");
const controller = require("../Controller/OrderController");

router.post("/createOrder", TokenVerfy, controller.createOrder);

router.get("/userOrder", TokenVerfy, controller.getUserOrder);

router.get("/user/single/order/:id", TokenVerfy, controller.getSingleUserOrder);

router.get("/owner/order", ShopTokenVerify, controller.ownerOrder);

router.put(
  "/orderStatusUpdate/:id",
  ShopTokenVerify,
  controller.changeOrderStatus
);

module.exports = router;
