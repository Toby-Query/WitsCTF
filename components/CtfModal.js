const CtfModal = () => {
  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box relative">
          {/* First Row: Tag, Number of Solves, and Close Button */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Tag: Web Exploit
            </span>
            <span className="text-sm font-medium text-gray-600">
              Solves: 42
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

          {/* Second Row: Problem Name */}
          <h3 className="text-xl font-semibold mb-4">
            Problem Name: Web Exploit
          </h3>

          {/* Third Row: Problem Author */}
          <div className="mb-4">
            <span className="font-medium text-gray-600">Author: John Doe</span>
          </div>

          {/* Fourth Row: Problem Description */}
          <div className="mb-4">
            <p className="text-gray-700">
              This is a web exploit problem where you need to find a
              vulnerability in a website. Your task is to exploit this
              vulnerability and capture the flag.
            </p>
          </div>

          {/* Fifth Row: Link */}
          <div className="mb-4">
            <a
              href="https://example.com/problem-details"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Problem Link: Click here for more details
            </a>
          </div>

          {/* Final Row: Flag Input and Submit Button */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Flag"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary w-full">Submit Flag</button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
};

export default CtfModal;
