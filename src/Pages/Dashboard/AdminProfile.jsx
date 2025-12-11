import { useContext, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const AdminProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await updateUserProfile(name, photoURL);
      setMessage("Admin profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Admin Profile
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        View and update your admin profile information.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-sm">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Admin"
              className="w-20 h-20 rounded-full object-cover border mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-lg font-semibold text-purple-700 mb-3">
              {(user?.email && user.email[0].toUpperCase()) || "A"}
            </div>
          )}
          <p className="font-medium text-gray-900">
            {user?.displayName || "No name set"}
          </p>
          <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
        </div>

        {/* Update form */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4 text-sm">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Profile Photo URL
              </label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
            >
              Save Changes
            </button>

            {message && (
              <p className="mt-2 text-xs text-gray-600">{message}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
