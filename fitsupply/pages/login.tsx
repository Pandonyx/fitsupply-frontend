import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppDispatch, RootState } from "@/store";
import { loginUser, fetchUser } from "@/components/authSlice";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const isRegistered = router.query.registered === "true";
  const { isAuthenticated, status, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      // After a successful login, fetch the user's profile data.
      dispatch(fetchUser());
    }
  };

  return (
    <main className='container mx-auto p-4 flex justify-center'>
      <div className='w-full max-w-md'>
        <form
          onSubmit={handleSubmit}
          className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <h1 className='text-2xl font-bold text-center mb-6'>Login</h1>

          {isRegistered && (
            <div
              className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'
              role='alert'>
              <span className='block sm:inline'>
                Registration successful! Please log in.
              </span>
            </div>
          )}

          {status === "failed" && error && (
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
          <div className='flex items-center justify-between'>
            <button
              className='bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
              type='submit'
              disabled={status === "loading"}>
              {status === "loading" ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <p className='text-center text-gray-500 text-xs mt-4'>
            Don't have an account?{" "}
            <Link
              href='/register'
              className='text-blue-500 hover:text-blue-800'>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
