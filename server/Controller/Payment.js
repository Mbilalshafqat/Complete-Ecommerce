const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  paymentProcessStripe: async (req, res) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "YourShop",
        },
      });
      res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  //   --------------- get stripe api key
  getStripeApiKey: async (req, res) => {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_API_KEY,
    });
  },
};
