import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const API_URL = "http://localhost:3000";

const Register = () => {
  const { registerUser, updateUserProfile, loginWithGoogle } =
    useContext(AuthContext);

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const validatePassword = (password) => {
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

    if (!validatePassword(password)) {
      setLoading(false);
      setPasswordError(
        "Password must be at least 6 characters and include uppercase, lowercase, number & special character."
      );
      return;
    }

    try {
      // 1️⃣ upload image (optional)
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

      // 2️⃣ create firebase user
      const result = await registerUser(email, password);
      const currentUser = result.user;

      // 3️⃣ update firebase profile
      await updateUserProfile(name, photoURL);

      // 🔥 4️⃣ SAVE USER TO MONGODB (CRITICAL FIX)
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email,
        }),
      });

      // 5️⃣ reset & redirect
      form.reset();
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // GOOGLE LOGIN
  // ======================
  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const result = await loginWithGoogle();
      const user = result.user;

      // 🔥 SAVE GOOGLE USER TO MONGODB
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-sm text-gray-600 mb-6">
          Register with email & password
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full border px-3 py-2 rounded"
          />

          {passwordError && (
            <p className="text-xs text-red-500">{passwordError}</p>
          )}

          <input type="file" name="image" accept="image/*" />

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="my-4 text-center text-xs text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-xs text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
