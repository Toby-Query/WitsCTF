"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // To access user session
import CtfCard from "@/components/CtfCard";
import CtfModal from "@/components/CtfModal";
import Drawer from "@/components/Drawer";
import { useSearch } from "./context/SearchContext";

export default function Home() {
  const { data: session } = useSession(); // Access session data
  const [ctfData, setCtfData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filter, setFilter] = useState("all"); // Default filter
  // const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { searchQuery, onSearchChange } = useSearch(); // Use search query from context

  // console.log("give ", searchQuery);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();

        // Attach solved status based on user's session
        const solvedProblems = session?.user?.solved || [];
        const enrichedData = data.map((problem) => ({
          ...problem,
          solved: solvedProblems.includes(problem.problemName), // Mark as solved if in user's solved list
        }));

        setCtfData(enrichedData);
        setFilteredData(enrichedData); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, [session]);

  // Update filtered data based on selected filter
  //cryptography, web exploit, reverse engineering, binary exploit, forensics
  // Update filtered data based on selected filter
  useEffect(() => {
    let filtered = [...ctfData];

    // Filter based on category
    if (filter !== "all") {
      filtered = filtered.filter((problem) => {
        if (filter === "solved") return problem.solved;
        if (filter === "unsolved") return !problem.solved;
        return problem.tag === filter;
      });
    }

    // Filter based on search query
    if (searchQuery) {
      filtered = filtered.filter((problem) =>
        problem.problemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // alert(searchQuery);

    setFilteredData(filtered); // Update filtered data
  }, [filter, ctfData, searchQuery]); // Trigger filter when filter or search query changes

  // const handleSearchChange = (query) => {
  //   setSearchQuery(query); // Update search query state
  // };

  return (
    <>
      <div className="p-8 sm:p-16">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Capture the Flag Events
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredData.map((ctf, index) => (
            <div key={index} className="flex items-center justify-center">
              <label
                htmlFor="my_modal_7"
                onClick={() => setSelectedProblem(ctf)}
              >
                <CtfCard
                  title={ctf.problemName}
                  points={ctf.points}
                  solved={ctf.solved}
                />
              </label>
            </div>
          ))}
        </div>

        <CtfModal problem={selectedProblem} />
      </div>
      <Drawer onFilterChange={setFilter} />
    </>
  );
}
