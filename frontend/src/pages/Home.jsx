import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Animation1 from "../media/Animation1.webm";
import { useState, useEffect } from "react";
import { getCityFromUserLocation } from "../utils/getCurrentCity";
import { searchStores, getAllStores } from "../api/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [city, setCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCityFromUserLocation()
      .then((city) => setCity(city))
      .catch((err) => console.log(err));
  }, []);

  // Handle search input changes and fetch suggestions
  const handleSearchInputChange = async (query) => {
    setSearchQuery(query);

    // Don't show suggestions for "near me" query
    if (query.trim().toLowerCase() === "near me") {
      setSuggestions([]);
      return;
    }

    if (query.trim().length > 2) {
      try {
        setLoading(true);
        const results = await searchStores(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Check if a string contains any part of user's city
  const containsUserCityKeyword = (cityName) => {
    if (!city) return false;

    // Convert both to lowercase for case-insensitive comparison
    const userCityLower = city.toLowerCase();
    const cityNameLower = cityName.toLowerCase();

    // Check if either string contains the other
    return (
      cityNameLower.includes(userCityLower) ||
      userCityLower.includes(cityNameLower)
    );
  };

  // Handle search submission
  const handleSearch = async (query) => {
    if (!query || query.trim() === "") return;

    // Handle "near me" search
    if (query.trim().toLowerCase() === "near me" && city) {
      try {
        setLoading(true);
        // Get all stores from the database
        const allStores = await getAllStores();

        if (allStores && Array.isArray(allStores)) {
          // Group stores by city
          const storesByCity = allStores.reduce((acc, store) => {
            const storeCity = store.location?.city || "Unknown Location";
            if (!acc[storeCity]) {
              acc[storeCity] = [];
            }
            acc[storeCity].push(store);
            return acc;
          }, {});

          // Find matching cities using the same comparison logic as Explore page
          const matchingCities = Object.keys(storesByCity).filter((dbCity) =>
            containsUserCityKeyword(dbCity)
          );

          if (matchingCities.length > 0) {
            // Navigate to the first matching city
            navigate(`/explore/city/${encodeURIComponent(matchingCities[0])}`);
          } else {
            // If no matches, just navigate to the user's city
            navigate(`/explore/city/${encodeURIComponent(city)}`);
          }
        } else {
          // Fallback to user's city if there's an issue with store data
          navigate(`/explore/city/${encodeURIComponent(city)}`);
        }
      } catch (error) {
        console.error("Error handling near me search:", error);
        // Fallback to user's city in case of error
        navigate(`/explore/city/${encodeURIComponent(city)}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const results = await searchStores(query);

      // Navigate to explore page with search results
      navigate("/explore", {
        state: {
          searchResults: results,
          searchQuery: query,
        },
      });
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full h-[30rem] flex items-center justify-center'>
        <div className='max-w-2xl w-full px-4'>
          <div className='text-center mb-2'>
            <video
              className='m-auto h-[10rem] object-cover'
              autoPlay
              loop
              muted
            >
              <source
                src={Animation1}
                type='video/webm'
              />
            </video>
            <h1 className='text-4xl font-bold mb-2 text-primary'>
              Find Laundry Services
            </h1>
            <p className='text-gray-600'>
              Search for the best laundry services near you
            </p>
          </div>
          <div className='flex flex-col items-center justify-center gap-1'>
            <div className='relative flex items-center justify-center gap-4'>
              <SearchBar
                placeholder='Search for Laundry or type near me'
                className='w-full md:w-[500px] lg:w-[600px] py-2 text-md'
                onSearch={handleSearch}
                onInputChange={handleSearchInputChange}
                suggestions={suggestions}
                loading={loading}
              />
              <Button
                text={"Search"}
                className='py-2 px-10 hover:shadow-sm'
                onClick={() => handleSearch(searchQuery)}
              />
            </div>
            <div className='flex gap-2'>
              <p className='text-gray-600'>Want to explore more?</p>
              <a
                className='hover:text-gray-600 hover:underline font-semibold'
                href='/explore'
              >
                Explore
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
