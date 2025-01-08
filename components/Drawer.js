import { useRouter } from "next/navigation";

const Drawer = () => {
  const router = useRouter(); // Initialize useRouter hook

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
              <a>Unsolved</a>
            </li>
            <li>
              <a>Solved</a>
            </li>
            <li>
              <a>All</a>
            </li>
            <li>
              <a>Cryptography</a>
            </li>
            <li>
              <a>Reverse Engineering</a>
            </li>
            <li>
              <a>Forensics</a>
            </li>
            <li>
              <a>Web Exploitation</a>
            </li>
            <li>
              <a>Steganography</a>
            </li>
            <li>
              <a>Network</a>
            </li>
            <li>
              <a>Miscellaneous</a>
            </li>
            <li>
              <a>OSINT</a>
            </li>
            <li>
              <a>Machines</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Drawer;
