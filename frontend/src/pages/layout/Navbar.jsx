import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import { searchStores } from "../../api/api";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const navigate = useNavigate();

  const getUrlLocation = () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/") {
        return "Home";
      }
      return path;
    }
    return null;
  };

  // Handle search input changes with debounce
  const handleSearchInputChange = async (query) => {
    setSearchQuery(query);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Don't search for empty queries
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Set a new timeout to delay the search
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchStores(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching stores:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);
  };

  // Handle search submission
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
      const results = await searchStores(query);

      // Navigate to the Explore page with search results
      navigate("/explore", {
        state: {
          searchResults: results,
          searchQuery: query,
        },
      });
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <div>
      <div className='bg-primary text-secondary flex justify-between items-center p-1 px-6'>
        <div>
          <h2>Stay Clean Every Time</h2>
        </div>
        <div>
          <h2>Deals from the businesses</h2>
        </div>
        <div>
          <h2>071-445445 | Kathmandu</h2>
        </div>
      </div>
      <div className='px-6 flex justify-between items-center p-4'>
        <div>
          <a
            href='/'
            className='italic font-semibold text-lg'
          >
            LaundryFind
          </a>
        </div>
        {getUrlLocation() !== "Home" ? (
          <div className='flex gap-2 items-center'>
            <SearchBar
              placeholder='Search for laundries...'
              onInputChange={handleSearchInputChange}
              onSearch={handleSearch}
              suggestions={searchResults}
              loading={isSearching}
            />
            <Button
              text={"Search"}
              className='ml-0'
              onClick={() => handleSearch(searchQuery)}
            />
          </div>
        ) : null}
        <div className='flex gap-4'>
          <Button
            className='bg-slate-50 text-slate-900 border-2 '
            text={"Sign in"}
          />
          <Button text={"Register"} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
