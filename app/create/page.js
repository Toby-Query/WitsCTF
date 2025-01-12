"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Create = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    problemName: "",
    tag: "",
    author: "",
    description: "",
    link: "",
    flag: "",
    points: "",
  });
  const [feedback, setFeedback] = useState(""); // Feedback state
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

  const tags = [
    "Web Exploit",
    "Cryptography",
    "Forensics",
    "Binary Exploit",
    "Reverse Engineering",
  ];

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded
    if (!session) {
      router.push("/"); // Redirect if not logged in
      return;
    }

    // Fetch the user's profile role from your profile API
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile data");

        const profile = await res.json();
        if (profile.role === "admin") {
          setIsAuthorized(true);
        } else {
          router.push("/"); // Redirect non-admin users to home page
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/"); // Redirect on error
      }
    };

    fetchUserRole();
  }, [router, session, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(""); // Clear any previous feedback
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // Parse the response JSON
      if (!res.ok) throw new Error(data.message || "Failed to create problem");

      setFeedback("Problem created successfully!");
      setFormData({
        problemName: "",
        tag: "",
        author: "",
        description: "",
        link: "",
        flag: "",
        points: "",
      }); // Reset the form
    } catch (error) {
      setFeedback(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) return null; // Optionally render a loading state

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create a New Problem
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        {/* Problem Name */}
        <div className="form-control">
          <label htmlFor="problemName" className="label">
            <span className="label-text">Problem Name</span>
          </label>
          <input
            type="text"
            id="problemName"
            name="problemName"
            value={formData.problemName}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the problem name"
            required
          />
        </div>
        {/* Tag Dropdown */}
        <div className="form-control">
          <label htmlFor="tag" className="label">
            <span className="label-text">Tag</span>
          </label>
          <select
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select a Tag</option>
            {tags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        {/* Author */}
        <div className="form-control">
          <label htmlFor="author" className="label">
            <span className="label-text">Author</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the author name"
            required
          />
        </div>
        {/* Description */}
        <div className="form-control">
          <label htmlFor="description" className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
            placeholder="Enter the problem description"
            required
          ></textarea>
        </div>
        {/* Link */}
        <div className="form-control">
          <label htmlFor="link" className="label">
            <span className="label-text">Link</span>
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter a link for the problem (optional)"
          />
        </div>
        {/* Answer */}
        <div className="form-control">
          <label htmlFor="flag" className="label">
            <span className="label-text">Flag</span>
          </label>
          <input
            type="text"
            id="flag"
            name="flag"
            value={formData.flag}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the answer for the problem"
            required
          />
        </div>
        {/* Points
        <div className="form-control">
          <label htmlFor="points" className="label">
            <span className="label-text">Points</span>
          </label>
          <input
            type="number"
            id="points"
            name="points"
            value={formData.points}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the number of points"
            required
          />
        </div> */}
        {/* Submit Button */}
        <div className="form-control">
          <button
            type="submit"
            className={`btn btn-primary w-full ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Problem"}
          </button>
        </div>
      </form>
      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mt-4 text-center ${
            feedback.startsWith("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default Create;
