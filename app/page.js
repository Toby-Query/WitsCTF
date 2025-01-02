import CtfCard from "@/components/CtfCard";
import CtfModal from "@/components/CtfModal";
import { LayoutRouter } from "next/dist/server/app-render/entry-base";

export default function Home() {
  const ctfData = [
    { title: "Web Exploit", points: 500 },
    { title: "Crypto Challenge", points: 300 },
    { title: "Forensics Task", points: 400 },
    { title: "Binary Exploit", points: 600 },
    { title: "Reverse Engineering", points: 450 },
  ];

  return (
    <>
      {/* <Navbar /> */}

      <div className="p-8 sm:p-16">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Capture the Flag Events
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {ctfData.map((ctf, index) => (
            <div key={index} className="flex items-center justify-center">
              <label htmlFor="my_modal_7">
                <CtfCard title={ctf.title} points={ctf.points} />
              </label>
            </div>
          ))}
        </div>

        <CtfModal />
        {/* <Drawer /> */}
      </div>
    </>
  );
}
