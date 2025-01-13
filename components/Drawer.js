import { useRouter } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";

const Drawer = ({ onFilterChange }) => {
  const router = useRouter(); // Initialize useRouter hook
  const { isOpen, setIsOpen } = useDrawer();

  const handleFilterChange = (filter) => {
    // setIsOpen(false); // Close the drawer
    onFilterChange(filter); // Call the passed function with the new filter
  };

  return (
    <>
      <div className="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          // checked={isOpen}
          // onChange={() => setIsOpen(!isOpen)}
        />
        <div className="drawer-content">{/* Page content */}</div>
        <div className="drawer-side mt-16">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => setIsOpen(false)}
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content */}
            {/* <li>
              <a
                onClick={() => {
                  router.push("/leaderboard");
                  setIsOpen(false);
                }}
              >
                Leaderboard
              </a>
            </li> */}
            <li>
              <a onClick={() => handleFilterChange("Unsolved")}>Unsolved</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("Solved")}>Solved</a>
            </li>
            <li>
              <a onClick={() => handleFilterChange("All")}>All</a>
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
