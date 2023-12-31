// ----------------- create Order

import { toast } from "react-toastify";
import server from "../server";

export const CreateOrder = (orderData, setSelect) => async (dispatch) => {
  try {
    dispatch({ type: "OrderItemLoad" });
    const res = await fetch(`${server}/order/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("myecomtoken"),
      },
      body: JSON.stringify(orderData),
    });
    dispatch({ type: "OrderItemLoadFail" });
    const data = await res.json();
    if (res.status === 400 || !data) {
      return toast.error(data.message);
    } else {
      toast.success(data.message);
      setSelect(2);
    }

    dispatch({ type: "OrderItemSuccess" });
  } catch (error) {
    dispatch({ type: "OrderItemERROR", payload: error.message });
  }
};

// --------------------- get login user order

export const LoginUserOrder = () => async (dispatch) => {
  try {
    dispatch({ type: "GetUserOrderLoad" });
    const res = await fetch(`${server}/order/userOrder`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("myecomtoken"),
      },
    });
    dispatch({ type: "GetUserOrderLoadFail" });
    const data = await res.json();
    if (res.status === 400 || !data) {
      return;
    } else {
      dispatch({ type: "getUserOrderSuccess", payload: data.userOrder });
    }
  } catch (error) {
    dispatch({ type: "getUserOrderError", payload: error.message });
  }
};

// ----------------------- get single Order Data

export const SingleOrderFunc = (id) => async (dispatch) => {
  try {
    dispatch({ type: "GetSingleOrderLoad" });
    const res = await fetch(`${server}/order/user/single/order/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("myecomtoken"),
      },
    });
    dispatch({ type: "GetSingleOrderLoadFail" });
    const data = await res.json();
    if (res.status === 400 || !data) {
      return toast.error(data.message);
    } else {
      dispatch({ type: "GetSingleOrderSuccess", payload: data.order });
    }
  } catch (error) {
    dispatch({ type: "GetSingleOrderError", payload: error.message });
  }
};

// ----------------------- get single Order Data

export const OwnerOrderFunc = () => async (dispatch) => {
  try {
    dispatch({ type: "GetAllOrderLoad" });
    const res = await fetch(`${server}/order/owner/order`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("shopownerToken"),
      },
    });
    dispatch({ type: "GetAllOrderLoadFail" });
    const data = await res.json();
    if (res.status === 400 || !data) {
      return toast.error(data.message);
    } else {
      dispatch({ type: "GetAllOrderSuccess", payload: data.data });
    }
  } catch (error) {
    dispatch({ type: "GetAllOrderError", payload: error.message });
  }
};

// ----------------------- Update Order Status

export const UpdateOrderStatus = (status, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "UpadteOrderStatusLoad" });
    const res = await fetch(`${server}/order/orderStatusUpdate/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("shopownerToken"),
      },
      body: JSON.stringify({ status }),
    });
    dispatch({ type: "UpadteOrderStatusLoadFail" });
    const data = await res.json();
    if (res.status === 400 || !data) {
      return toast.error(data.message);
    } else {
      navigate("/Shop/Owner/Dashboard");
      toast.success(data.message);
      dispatch({ type: "UpadteOrderStatusSuccess" });
    }
  } catch (error) {
    dispatch({ type: "UpadteOrderStatusError", payload: error.message });
  }
};
