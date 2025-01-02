"use client";
import { useState } from "react";

export default function Profile() {
  const [hackerName, setHackerName] = useState("Thups");

  const handleNameChange = (event) => {
    setHackerName(event.target.value);
  };

  const handleSave = () => {
    // Logic for saving the profile data can be added here
    alert("Profile Saved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture */}
        <img
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-primary"
        />
        {/* Editable Name */}
        <input
          type="text"
          value={hackerName}
          onChange={handleNameChange}
          className="text-xl font-bold text-center border-b-2 border-gray-300 focus:outline-none"
        />
        {/* Profile Info */}
        <div className="flex gap-8">
          <div>
            <p className="text-lg font-semibold">Muthuphei Mukhunyeledzi</p>
            <p className="text-lg font-semibold">Points: 1,000</p>
            <p className="text-lg font-semibold">Rank: Silver</p>
            <p className="text-lg font-semibold">Days active: Silver</p>
          </div>
        </div>
      </div>

      {/* School and Level Drop-downs */}
      <div className="flex flex-col gap-8">
        {/* School Dropdown */}
        <div className="flex-1">
          <label htmlFor="school" className="block text-sm font-medium">
            School
          </label>
          <select id="school" className="select select-bordered w-full mt-1">
            <option>Computer Science</option>
            <option>Electrical Engineering</option>
            {/* Add more options here */}
          </select>
        </div>

        {/* Level Dropdown */}
        <div className="flex-1">
          <label htmlFor="level" className="block text-sm font-medium">
            Level
          </label>
          <select id="level" className="select select-bordered w-full mt-1">
            <option>Undergraduate</option>
            <option>Honours</option>
            <option>Masters</option>
            <option>PhD</option>
            {/* Add more options here */}
          </select>
        </div>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="flex flex-col items-center p-4 rounded-lg shadow">
          <img
            src="/globe.svg"
            alt="Award 1"
            className="w-16 h-16 object-cover mb-4"
          />
          <p className="font-semibold">Hacker of the Year: 2024</p>
        </div>
        <div className="flex flex-col items-center  p-4 rounded-lg shadow">
          <img
            src="/globe.svg"
            alt="Award 2"
            className="w-16 h-16 object-cover mb-4"
          />
          <p className="font-semibold">Top Scorer</p>
        </div>
        {/* Add more awards as needed */}
      </div>

      {/* Save Button */}
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
