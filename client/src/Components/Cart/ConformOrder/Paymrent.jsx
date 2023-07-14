import React, { useEffect, useState } from "react";
import "./Payment.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UseUserContext } from "../../../ContextAoi/Context/UserContext";
import { CreateOrder } from "../../../redux/actions/OrderAction";
import Loading from "../../Loading/Loading";
import { ClearCart } from "../../../redux/actions/CartAction";
import {
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import server from "../../../redux/server";

const Paymrent = ({ select, setSelect }) => {
  const [method, setmethods] = useState(6);
  const { Authanticated, user } = UseUserContext();
  const stripe = useStripe();
  const element = useElements();
  const [open, setOpen] = useState(false);
  // ------------------- cart
  const cart = useSelector((state) => state.cart.cart);

  // ------------------- totalItemQuantity
  const totalItemQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ----------------- sub total
  const Subtotal =
    cart &&
    cart.reduce((acc, item) => acc + item.discountPrice * item.quantity, 0);

  // -------------------- shippingcharges
  var shippingcharges = 2;

  // ----------------- total
  var total = Subtotal + shippingcharges;

  const navigate = useNavigate();
  useEffect(() => {
    if (!Authanticated) {
      navigate("/login");
    }
  }, []);
  const ShippingInfouser = JSON.parse(localStorage.getItem("shippingInfo"));

  const dispatch = useDispatch();

  const CODFUNC = async () => {
    setmethods(1);
    var shippingInfo = {
      Adress: ShippingInfouser.Adress,
      city: ShippingInfouser.city,
      country: ShippingInfouser.country,
      number: ShippingInfouser.number,
      name: ShippingInfouser.name,
      email: ShippingInfouser.email,
    };
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    // const itemquantity = cart.map((item) => );
    // const ownershop = cartItems && cartItems.map((item)=>  item.owner._id)
    // console.log(ownershop);

    const alldata = {
      shippingAddress: shippingInfo && shippingInfo,
      cart: cart && cart,
      totalPrice: ShippingInfouser.total,
      // owner: ownershop,
    };

    await dispatch(CreateOrder(alldata, setSelect));
    await dispatch(ClearCart());
  };

  const orderLoading = useSelector((state) => state.order.orderLoading);

  const submitPaymentdata = async () => {
    const ShippingInfouser = JSON.parse(localStorage.getItem("shippingInfo"));
    setmethods(1);
    var shippingInfo = {
      Adress: ShippingInfouser.Adress,
      city: ShippingInfouser.city,
      country: ShippingInfouser.country,
      number: ShippingInfouser.number,
      name: ShippingInfouser.name,
      email: ShippingInfouser.email,
    };
    try {
      const res = await fetch(`${server}/payment/stripepaymentProcess`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
        }),
      });
      const data = await res.json();
      const client_secret = data.client_secret;
      const cardElement = element.getElement(CardNumberElement);
      console.log(cardElement);
      if (!stripe || !element) return;
      console.log(data);
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          var alldatacard = {
            shippingAddress: shippingInfo && shippingInfo,
            cart: cart && cart,
            totalPrice: ShippingInfouser.total,
            Orderstatus: "Paid",
            paymentstatus: "by debit/credit card",
          };
          await dispatch(CreateOrder(alldatacard, setSelect));
          await dispatch(ClearCart());
          setOpen(false);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {orderLoading ? (
        <Loading />
      ) : (
        <div className="payment">
          <div className="methos_payment">
            <div className="card_payment">
              {/* <button onClick={() => setmethods(0)}>
                {" "}
                Pay With Debit/Credit card{" "}
              </button> */}
              {method === 0 ? (
                <div className="card_payment_inputs">
                  <div className="iputs">
                    <div className="card-expiry-input">
                      <div className="card-expiry-element-container">
                        <input
                          type="text"
                          placeholder="Name on Card"
                          className="card-expiry-element"
                        />
                      </div>
                    </div>
                    {/* <input type="number" placeholder="Exp Date" /> */}
                    <div className="card-expiry-input">
                      <div className="card-expiry-element-container">
                        <CardExpiryElement className="card-expiry-element" />
                      </div>
                    </div>
                  </div>
                  <div className="iputs">
                    <div className="card-expiry-input">
                      <div className="card-expiry-element-container">
                        <CardNumberElement className="card-expiry-element" />
                      </div>
                    </div>
                    <div className="card-expiry-input">
                      <div className="card-expiry-element-container">
                        <CardCvcElement className="card-expiry-element" />
                      </div>
                    </div>
                  </div>
                  <button onClick={submitPaymentdata}>Submit</button>
                </div>
              ) : null}
            </div>
            <div className="card_payment">
              <button onClick={CODFUNC}>Cash on Devilery </button>
            </div>
          </div>

          {/* -----------------------  */}
          <div className="shipping_cart_info">
            <div
              className="flex justify-between align-middle px-1 py-1 mb-2 font-bold"
              style={{ borderBottom: "1px solid rgb(203, 196, 196)" }}
            >
              <p>Total Item :</p>
              <p>{cart && cart.length}</p>
            </div>
            <div
              className="flex justify-between align-middle px-1 py-1 mb-2 font-bold"
              style={{ borderBottom: "1px solid rgb(203, 196, 196)" }}
            >
              <p>Total Quantity :</p>
              <p>{totalItemQuantity}</p>
            </div>
            <div className="flex justify-between align-middle px-1 py-3 my-2 mb-2">
              <p>Subtotal :</p>
              <p>${Subtotal}</p>
            </div>
            <div
              className="flex justify-between align-middle px-1 py-3 my-2 mb-2"
              style={{ borderBottom: "1px solid rgb(203, 196, 196)" }}
            >
              <p>Shipping Charges :</p>
              <p>${shippingcharges}</p>
            </div>

            <div className="flex justify-between align-middle px-1 py-5 my-2 mb-2">
              <p>Total Amount :</p>
              <p>${total}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Paymrent;
