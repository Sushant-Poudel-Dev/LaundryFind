import { useState, useEffect, useRef } from "react";

const SearchBar = ({
  className = "",
  placeholder = "",
  onSearch = () => {},
  suggestions = [],
  loading = false,
  onInputChange = () => {},
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Handle clicks outside the suggestion box to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onInputChange(value);

    if (value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className='flex gap-2 w-full'>
        <input
          type='text'
          placeholder={placeholder}
          className={`p-1 px-4 rounded-md border-gray-300 shadow-sm border w-96 ${className}`}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
        />
      </div>

      {/* Suggestions Modal */}
      {showSuggestions && (
        <div
          ref={suggestionRef}
          className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'
        >
          {loading ? (
            <div className='p-3 text-gray-500'>Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className='font-medium'>{suggestion.name}</div>
                  {suggestion.location?.address && (
                    <div className='text-sm text-gray-600'>
                      {suggestion.location.address}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <div className='p-3 text-gray-500'>No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
