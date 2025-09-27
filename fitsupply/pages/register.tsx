import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppDispatch, RootState } from "@/store";
import { registerUser, loginUser, fetchUser } from "@/store/slices/authSlice";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isAuthenticated, status, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Debug: Log the auth state changes
  console.log("Current auth state:", { isAuthenticated, status, error });

  useEffect(() => {
    // When authentication is successful (after register + login), redirect to home.
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to home");
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) {
      setFormError("Passwords do not match.");
      return;
    }
    setFormError(null); // Clear local errors before dispatching

    const registerData = {
      username,
      email,
      password,
      password2,
      first_name: firstName,
      last_name: lastName,
    };

    console.log("Attempting registration with data:", registerData);

    try {
      const registerResult = await dispatch(registerUser(registerData));
      console.log("Registration result:", registerResult);
      console.log("Registration result type:", registerResult.type);

      // Check if registration was successful
      if (registerUser.fulfilled.match(registerResult)) {
        console.log("Registration fulfilled successfully!");
        console.log("Registration payload:", registerResult.payload);

        // Check if we got a token from registration
        if (registerResult.payload.access_token) {
          console.log("Got token from registration, fetching user...");
          await dispatch(fetchUser());
        } else {
          console.log("No token from registration, attempting login...");
          const loginResult = await dispatch(loginUser({ username, password }));
          console.log("Login result:", loginResult);

          if (loginUser.fulfilled.match(loginResult)) {
            console.log("Login successful, fetching user...");
            await dispatch(fetchUser());
          } else {
            console.error("Login failed after successful registration");
            setFormError(
              "Registration successful, but login failed. Please try logging in manually."
            );
          }
        }
      } else if (registerUser.rejected.match(registerResult)) {
        console.error("Registration rejected:", registerResult);
        console.error("Registration error payload:", registerResult.payload);

        // Set a more user-friendly error message
        if (registerResult.payload) {
          setFormError(
            typeof registerResult.payload === "string"
              ? registerResult.payload
              : "Registration failed. Please try again."
          );
        } else {
          setFormError(
            "Registration failed. Please check your information and try again."
          );
        }
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className='container mx-auto p-4 flex justify-center'>
      <div className='w-full max-w-md'>
        {/* Debug info - remove this later */}
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            background: "white",
            padding: "10px",
            border: "1px solid black",
            fontSize: "12px",
            maxWidth: "300px",
          }}>
          <strong>Debug Auth State:</strong>
          <br />
          Status: {status}
          <br />
          Authenticated: {isAuthenticated ? "Yes" : "No"}
          <br />
          Error:{" "}
          {error
            ? typeof error === "string"
              ? error
              : JSON.stringify(error)
            : "None"}
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <h1 className='text-2xl font-bold text-center mb-6'>
            Create Account
          </h1>

          {formError && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
              role='alert'>
              <span className='block sm:inline'>{formError}</span>
            </div>
          )}

          {status === "succeeded" && !formError && (
            <div
              className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'
              role='alert'>
              <span className='block sm:inline'>
                Registration successful! Redirecting...
              </span>
            </div>
          )}

          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='username'>
              Username
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='username'
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='flex gap-4 mb-4'>
            <div className='w-1/2'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='first_name'>
                First Name
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='first_name'
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className='w-1/2'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='last_name'>
                Last Name
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='last_name'
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='email'>
              Email
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'>
              Password
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='******************'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password2'>
              Confirm Password
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              id='password2'
              type='password'
              placeholder='******************'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              className='bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50'
              type='submit'
              disabled={status === "loading"}>
              {status === "loading" ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
          <p className='text-center text-gray-500 text-xs mt-4'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-blue-500 hover:text-blue-800'>
              Log In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
