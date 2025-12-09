import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const Register = () => {
  const { registerUser, updateUserProfile, loginWithGoogle } =
    useContext(AuthContext);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // OPTIONAL: if you want file upload, set an image hosting key
  const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const validatePassword = (password) => {
    // at least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^()_+\-=])[A-Za-z\d@$!%*?&~#^()_+\-=]{6,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const imageFile = form.image.files[0];

    // password validation
    if (!validatePassword(password)) {
      setLoading(false);
      setPasswordError(
        "Password must be at least 6 characters and include uppercase, lowercase, number & special character."
      );
      return;
    }

    try {
      // 1) upload image if file selected + hosting key set, otherwise keep null
      let photoURL = "";

      if (imageFile && imageHostingKey) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(imageHostingUrl, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          photoURL = data.data.display_url;
        }
      }

      // 2) create user
      const result = await registerUser(email, password);
      const currentUser = result.user;

      // 3) update profile (name + photo)
      await updateUserProfile(name, photoURL);

      // 4) reset form & redirect
      form.reset();
      navigate("/");

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    setLoading(true);
    loginWithGoogle()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="py-10">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-sm text-gray-600 mb-6">
          Register with email & password. Your profile picture will be updated
          automatically.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Strong password"
            />
            {passwordError && (
              <p className="mt-1 text-xs text-red-500">{passwordError}</p>
            )}
          </div>

          {/* Image file (NOT text input) */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-xs"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Optional, but recommended. If image hosting key is not set, image
              won&apos;t upload yet.
            </p>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[11px] uppercase text-gray-400">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Social Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <span>Continue with Google</span>
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-medium">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
