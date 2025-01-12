"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useSearch } from "@/app/context/SearchContext";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter hook
  const pathname = usePathname();
  const isHome = pathname === "/"; // Check if the current page is the home page
  const isLeaderboard = pathname === "/leaderboard"; // Check if the current page is the leaderboard page
  const { searchQuery, onSearchChange } = useSearch(); // Use search query from

  // alert(pathname);

  // Check if the user has an 'admin' role
  const isAdmin = session?.user?.role === "admin";

  const handleButtonClick = (path) => {
    router.push(path); // Redirect to the new page
  };

  const handleSearchChange = (e) => {
    // alert(e.target.value);
    onSearchChange(e.target.value); // Pass the search query to the layout
  };

  return (
    <div className="navbar bg-base-100">
      {isHome && (
        <label
          htmlFor="my-drawer"
          className="btn btn-circle drawer-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          ) : (
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
          )}
        </label>
      )}

      <div className="flex-none">
        <a
          onClick={() => handleButtonClick("/")}
          className="btn btn-ghost text-xl"
        >
          WitsCTF
        </a>
      </div>
      <div className="form-control flex-1">
        {(isHome || isLeaderboard) && (
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 sm:w-64 md:w-96 lg:w-128 xl:w-160"
            value={searchQuery} // Controlled input
            onChange={handleSearchChange} // Update query state on input change
          />
        )}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={
                  session?.user?.profilePic ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a
                onClick={() => handleButtonClick("/profile")}
                className="justify-between"
              >
                Profile
                {/* <span className="badge">New</span> */}
              </a>
            </li>
            {isAdmin && (
              <li>
                <a
                  onClick={() => handleButtonClick("/create")}
                  className="justify-between"
                >
                  Create
                </a>
              </li>
            )}
            <li>
              <a onClick={() => signOut({ callbackUrl: "/login" })}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
