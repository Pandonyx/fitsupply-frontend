import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppDispatch, RootState } from "@/store";
import { registerUser, loginUser, fetchUser } from "@/components/authSlice";

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

  useEffect(() => {
    // When authentication is successful (after register + login), redirect to home.
    if (isAuthenticated) {
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
    const registerResult = await dispatch(
      registerUser({
        username,
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
      })
    );

    // If registration was successful, automatically log the user in.
    if (registerUser.fulfilled.match(registerResult)) {
      const loginResult = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(loginResult)) {
        dispatch(fetchUser());
      }
    }
  };

  return (
    <main className='container mx-auto p-4 flex justify-center'>
      <div className='w-full max-w-md'>
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
          {status === "failed" && error && !formError && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
              role='alert'>
              <span className='block sm:inline'>{String(error)}</span>
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
              className='bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
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
