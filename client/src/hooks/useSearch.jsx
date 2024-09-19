import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";

// Custom hook for search logic
const useSearch = (url) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = useSelector((state) => state.token);

  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        try {
          const response = await fetch(`${url}?name=${query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [token, url]
  );

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    fetchSearchResults,
  };
};

export default useSearch;
