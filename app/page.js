"use client";

import { useEffect, useState } from "react";
import CtfCard from "@/components/CtfCard";
import CtfModal from "@/components/CtfModal";

export default function Home() {
  const [ctfData, setCtfData] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setCtfData(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="p-8 sm:p-16">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Capture the Flag Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {ctfData.map((ctf, index) => (
          <div key={index} className="flex items-center justify-center">
            <label htmlFor="my_modal_7" onClick={() => setSelectedProblem(ctf)}>
              <CtfCard title={ctf.problemName} points={ctf.points} />
            </label>
          </div>
        ))}
      </div>

      <CtfModal problem={selectedProblem} />
    </div>
  );
}
