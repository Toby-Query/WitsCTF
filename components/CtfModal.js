import { useEffect, useState } from "react";

const CtfModal = ({ problem, refreshData }) => {
  const [flag, setFlag] = useState("");
  const [notification, setNotification] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  // Fetch user email from the /api/profile endpoint
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        } else {
          setNotification("Unable to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
        setNotification("Error fetching user details.");
      }
    };

    fetchUserEmail();
  }, []);

  const submitFlag = async () => {
    if (!problem) {
      setNotification("No problem selected");
      return;
    }

    try {
      const response = await fetch("/api/submit-flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemName: problem.problemName,
          submittedFlag: flag,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification("🎉 Correct flag! Points updated.");
        refreshData(); // Refresh the data
      } else {
        setNotification(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting flag:", error);
      setNotification("Error submitting flag. Try again later.");
    }
  };

  if (!problem) return null;

  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box relative">
          {/* Problem details */}
          <div className="flex items-center justify-around mb-4">
            <div className="text-sm font-medium text-gray-600 badge badge-accent">
              {problem.tag}
            </div>
            <span className="text-sm font-medium text-gray-600 badge badge-secondary">
              Solves: {problem.solves || 0}
            </span>
            <label
              htmlFor="my_modal_7"
              className="absolute top-0 right-0 p-2 cursor-pointer text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
          </div>

          <h3 className="text-xl font-semibold mb-4 flex items-center justify-center w-full">
            {problem.problemName}
          </h3>
          <div className="mb-4">
            <span className="font-medium text-gray-600">
              Author: {problem.author}
            </span>
          </div>
          <div className="mb-4">
            <p className="text-gray-300">{problem.description}</p>
          </div>
          {problem.link && (
            <div className="mb-4">
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Problem Link: Click here for more details
              </a>
            </div>
          )}

          {/* Flag submission */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter Flag"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary w-full" onClick={submitFlag}>
              Submit Flag
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div className="mt-4 text-center text-sm font-medium">
              {notification}
            </div>
          )}
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
};

export default CtfModal;
