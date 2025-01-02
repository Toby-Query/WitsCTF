"use client";
import { useState } from "react";

const Create = () => {
  const [formData, setFormData] = useState({
    problemName: "",
    tag: "",
    author: "",
    description: "",
    link: "",
    answer: "",
    points: "",
  });

  const tags = [
    "Web Exploit",
    "Crypto Challenge",
    "Forensics Task",
    "Binary Exploit",
    "Reverse Engineering",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // You can send the form data to the server or handle it as needed.
  };

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
          <label htmlFor="answer" className="label">
            <span className="label-text">Answer</span>
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the answer for the problem"
            required
          />
        </div>

        {/* Points */}
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
        </div>

        {/* Submit Button */}
        <div className="form-control">
          <button type="submit" className="btn btn-primary w-full">
            Create Problem
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
