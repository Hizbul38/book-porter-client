import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 🔹 Fetch user profile by logged-in email
  const fetchProfile = async () => {
    if (!user?.email) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    try {
      setLoadingProfile(true);
      const res = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();

      if (res.ok) {
        setProfile(data); 
        // expected: { _id, name, email, role, photoURL }
      }
    } catch (err) {
      console.error("fetchProfile error:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // 🔹 Re-fetch profile when auth user changes
  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // 🔹 Update profile (name, photo)
  const updateProfile = async ({ name, photoURL }) => {
    if (!profile?._id) return null;

    try {
      const res = await fetch(`http://localhost:3000/users/${profile._id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, photoURL }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Profile update failed");
        return null;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error("updateProfile error:", err);
      alert("Something went wrong!");
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        profile,          // full user object (role included)
        role: profile?.role, // convenience
        loadingProfile,
        fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
