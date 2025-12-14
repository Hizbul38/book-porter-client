import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const demoEmail = "demo@bookcourier.com";

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await fetch(
        `http://localhost:3000/users?email=${encodeURIComponent(demoEmail)}`
      );
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch (err) {
      console.error("fetchProfile error:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
    <UserContext.Provider value={{ profile, loadingProfile, fetchProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
