import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const { registerUser, updateUserProfile, loginWithGoogle } =
    useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const imageHostingUrl = imageHostingKey
    ? `https://api.imgbb.com/1/upload?key=${imageHostingKey}`
    : "";

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^()_+\-=])[A-Za-z\d@$!%*?&~#^()_+\-=]{6,}$/;
    return regex.test(password);
  };

  const saveUserToDB = async (email) => {
    if (!API_URL) return;

    try {
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (e) {
      // Register success হলেও DB save fail হলে warn দিবে
      toast.error("Account created, but user save failed in DB.");
    }
  };

  const uploadImageToImgbb = async (imageFile) => {
    if (!imageFile) return "";
    if (!imageHostingUrl) return "";

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(imageHostingUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data?.success) return data?.data?.display_url || "";
      return "";
    } catch (e) {
      return "";
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const imageFile = form.image.files[0];

    if (!validatePassword(password)) {
      toast.error(
        "Password must be 6+ chars and include uppercase, lowercase, number & special character."
      );
      return;
    }

    const toastId = toast.loading("Creating account...");
    setLoading(true);

    try {
      // 1) upload image (optional)
      let photoURL = "";
      if (imageFile) {
        const uploaded = await uploadImageToImgbb(imageFile);
        if (uploaded) {
          photoURL = uploaded;
        } else if (imageHostingKey) {
          toast.error("Image upload failed (continuing without photo).");
        }
      }

      // 2) create firebase user
      const result = await registerUser(email, password);
      const currentUser = result.user;

      // 3) update firebase profile
      await updateUserProfile(name, photoURL);

      // 4) save user to MongoDB
      await saveUserToDB(currentUser.email);

      // 5) reset & redirect
      form.reset();
      toast.success("✅ Registration successful!", { id: toastId });
      navigate("/");
    } catch (err) {
      console.error(err);

      // Friendly message
      const msg =
        err?.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : err?.message || "Registration failed.";

      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // GOOGLE LOGIN
  // ======================
  const handleGoogleLogin = async () => {
    if (loading) return;

    const toastId = toast.loading("Signing in with Google...");
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      const gUser = result.user;

      await saveUserToDB(gUser.email);

      toast.success("✅ Google login successful!", { id: toastId });
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed. Try again.", { id: toastId });
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

          <input type="file" name="image" accept="image/*" />

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="my-4 text-center text-xs text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border py-2 rounded disabled:opacity-60"
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
