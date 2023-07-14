import { React, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import { UseUserContext } from "../../ContextAoi/Context/UserContext";
import Loading from "../Loading/Loading";
import server from "../../redux/server";

const Registration = () => {
  const { Authanticated, userRegistration, loading } = UseUserContext();
  // const [loading, setloading] = useState(false);
  const [input, SetInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  // const handleFileInputChange = (e) => {
  //   const file = e.target.files[0];
  //   setAvatar(file);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const config = { headers: { "Content-Type": "multipart/form-data" } };

  //   const newForm = new FormData();

  //   newForm.append("avatar", avatar);
  //   newForm.append("name", name);
  //   newForm.append("email", email);
  //   newForm.append("password", password);
  //   setloading(true);
  //   axios
  //     .post(`${server}/user/registration`, newForm, config)
  //     .then((res) => {
  //       toast.success(res.data.message);
  //       navigate("/userOTPverify");
  //       setloading(false);
  //     })
  //     .catch((error) => {
  //       toast.error(error.message);
  //       setloading(false);
  //     });
  // };

  const handleInput = (e) => {
    if (e.target.name === "avatar") {
      const render = new FileReader();

      render.onload = () => {
        if (render.readyState === 2) {
          setAvatar(render.result);
        }
      };
      render.readAsDataURL(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      SetInput({
        ...input,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) {
      return toast.error("Please select profile photo and all fileds", {
        theme: "dark",
      });
    }

    userRegistration(input.name, input.email, input.password, navigate, avatar);
  };

  useEffect(() => {
    if (Authanticated === true) {
      navigate("/");
    }
  }, [Authanticated]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Register as a new user
            </h2>
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      label="User Name"
                      value={input.name}
                      onChange={handleInput}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={handleInput}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      label="Password"
                      value={input.password}
                      onChange={handleInput}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {visible ? (
                      <AiOutlineEye
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible(true)}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700"
                  ></label>
                  <div className="mt-2 flex items-center">
                    <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="avatar"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <RxAvatar className="h-8 w-8" />
                      )}
                    </span>
                    {/* <label
                      htmlFor="file-input"
                      className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    > */}
                    {/* <span>Upload a file</span> */}
                    <input
                      fullWidth
                      sx={{ m: 1 }}
                      type="file"
                      placeholder="Select profile photo"
                      accept="image/"
                      onChange={handleInput}
                      variant="standard"
                      name="avatar"
                    />
                    {/* </label> */}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className=" group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[red]"
                  >
                    Submit
                  </button>
                </div>
                <div className={` w-full flex justify-center align-middle`}>
                  <h4 className="text-[red]">Already have an account?</h4>
                  <Link to="/login" className="text-[blue] pl-2">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Registration;
