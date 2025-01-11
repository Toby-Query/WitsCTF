"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    school: "",
    level: "",
    hackerName: "",
  });

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setProfileData(data);
      setFormData({
        school: data.school || "",
        level: data.level || "",
        hackerName: data.hackerName || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  const calculateAccountAge = (accountAge) => {
    const createdDate = new Date(accountAge);
    const currentDate = new Date();
    const differenceInTime = currentDate - createdDate;
    return Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile");
    }
  };

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={profileData?.profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-primary"
        />
        <input
          type="text"
          name="hackerName"
          value={formData.hackerName}
          onChange={handleInputChange}
          className="text-xl font-bold text-center border-b-2 border-gray-300 focus:outline-none"
        />
        <div className="flex gap-8">
          <div>
            <p className="text-lg font-semibold">{profileData?.name}</p>
            <p className="text-lg font-semibold">
              Points: {profileData?.points || 0}
            </p>
            <p className="text-lg font-semibold">
              Rank: {profileData?.rank || "Silver"}
            </p>
            <p className="text-lg font-semibold">
              Account Age: {calculateAccountAge(profileData?.accountAge)} days
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex-1">
          <label htmlFor="school" className="block text-sm font-medium">
            School
          </label>
          <select
            id="school"
            name="school"
            value={formData.school}
            onChange={handleInputChange}
            className="select select-bordered w-full mt-1"
          >
            <option>Computer Science</option>
            <option>Electrical Engineering</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="level" className="block text-sm font-medium">
            Level
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="select select-bordered w-full mt-1"
          >
            <option>Undergraduate</option>
            <option>Honours</option>
            <option>Masters</option>
            <option>PhD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {profileData?.awards?.map((award, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-4 rounded-lg shadow"
          >
            <img
              src={award.image || "/default-award.jpg"}
              alt={award.name}
              className="w-16 h-16 object-cover mb-4"
            />
            <p className="font-semibold">{award.name}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="btn btn-primary px-6 py-2 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}
