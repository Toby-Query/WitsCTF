import { useRouter } from "next/navigation";

const Drawer = ({ onFilterChange }) => {
  const router = useRouter(); // Initialize useRouter hook

  const handleFilterChange = (filter) => {
    onFilterChange(filter); // Call the passed function with the new filter
  };

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{/* Page content */}</div>
        <div className="drawer-side mt-16">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content */}
            <li>
              <a onClick={() => router.push("/leaderboard")}>Leaderboard</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("unsolved")}>Unsolved</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("solved")}>Solved</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("all")}>All</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("Cryptography")}>
                Cryptography
              </a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("Reverse Engineering")}>
                Reverse Engineering
              </a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("Forensics")}>Forensics</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("Web Exploit")}>
                Web Exploit
              </a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("Binary Exploit")}>
                Binary Exploit
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Drawer;
