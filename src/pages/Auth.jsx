import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db, doc, setDoc, provider } from "../firebase";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createDoc = async (user, userData) => {
    const { name, email } = userData; // Use provided userData or formData
    const createdAt = new Date();
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: name || user.displayName, // Use formData name or Google displayName
        email: email || user.email, // Use formData email or Google email
        createdAt: createdAt,
      });
      toast.success("User profile created successfully.");
    } catch (error) {
      toast.error(`Error creating user profile: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (
        formData.name !== "" &&
        formData.email !== "" &&
        formData.password !== ""
      ) {
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
          .then((userCredential) => {
            const user = userCredential.user;

            // Step 1: Update the user's display name
            updateProfile(user, {
              displayName: formData.name, // Use the name from formData
            })
              .then(() => {
                // Step 2: After updating the profile, create the user document in the database
                createDoc(user, formData);
                toast.success("User created successfully with display name");

                // Step 3: Reset the form and navigate to dashboard
                setLoading(false);
                setFormData({ name: "", email: "", password: "" });
                navigate("/dashboard");
              })
              .catch((error) => {
                toast.error("Error updating profile: " + error.message);
                setLoading(false);
              });
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      }
    } else {
      if (formData.email !== "" && formData.password !== "") {
        signInWithEmailAndPassword(auth, formData.email, formData.password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success("Logged in successfully");
            setLoading(false);
            setFormData({ email: "", password: "" });
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      } else {
        toast.error("Email and password are required!");
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        createDoc(user, {}); // Create user profile in Firestore with Google user data
        toast.success("Signed in with Google successfully");
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100 py-10 px-4">
      <div className="bg-white-100 p-8 rounded-lg shadow-2xl max-w-lg w-full space-y-8 sm:px-10 md:px-14 lg:px-16 xl:px-20">
        <h2 className="text-3xl font-bold text-center text-black-100">
          {isSignUp ? "Create an Account" : "Sign In"}
        </h2>
        <p className="text-center text-black-100 text-sm mb-6">
          {isSignUp
            ? "Sign up to start managing your expenses."
            : "Log in to access your account."}
        </p>

        {/* Sign in/up with Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full bg-white-100 text-black-100 font-bold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-200 transition duration-300 mb-6"
        >
          <FcGoogle className="mr-2 text-xl" />
          {isSignUp ? "Sign up with Google" : "Sign in with Google"}
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="block text-black-100 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white-100 text-black-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-black-100 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white-100 text-black-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-black-100 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-500 rounded-lg bg-white-100 text-black-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white-100 text-black-100 font-bold py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-black-100 text-sm mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={toggleAuthMode}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
