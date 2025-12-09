import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const Login = () => {
  const { loginUser, loginWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    loginUser(email, password)
      .then(() => {
        form.reset();
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid email or password.");
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    setError("");
    setLoading(true);
    loginWithGoogle()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setError("Google login failed. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="py-10">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">
          Login with your email and password or continue with a social account.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Your password"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[11px] uppercase text-gray-400">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <span>Continue with Google</span>
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          New here?{" "}
          <Link to="/register" className="text-gray-900 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
