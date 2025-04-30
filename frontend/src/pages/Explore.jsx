import Button from "../components/Button";
import LaundryCard from "../components/LaundryCard";
import SkeletonCard from "../components/SkeletonCard";
import { useState, useEffect } from "react";
import {
  useLocation as useRouterLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { getAllStores, getStoresByCity } from "../api/api";

const Explore = () => {
  const [laundries, setLaundries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [laundriesByCity, setLaundriesByCity] = useState({});
  const [error, setError] = useState(null);
  const [filterCity, setFilterCity] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    showDelivery: false,
    showVerified: false,
    showActive: false,
    minPrice: "",
    maxPrice: "",
  });

  // Get user location from context
  const { userCity, isLocationLoading } = useLocation();

  // React Router hooks
  const navigate = useNavigate();
  const { cityName } = useParams();
  const routerLocation = useRouterLocation();

  // Check if we have search results from navigation state
  useEffect(() => {
    if (routerLocation.state?.searchResults) {
      setSearchResults(routerLocation.state.searchResults);
      setSearchQuery(routerLocation.state.searchQuery || "");
    } else {
      setSearchResults([]);
      setSearchQuery("");
    }
  }, [routerLocation.state]);

  // Fetch laundries data
  useEffect(() => {
    const fetchLaundries = async () => {
      try {
        setLoading(true);

        let data;
        // If we have a city parameter in the URL, fetch laundries for that city only
        if (cityName) {
          data = await getStoresByCity(cityName);
          setFilterCity(cityName);
        } else {
          data = await getAllStores();
          setFilterCity(null);
        }

        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          setError("Unexpected data format from API");
          setLaundries([]);
          return;
        }

        setLaundries(data);

        // Group laundries by city
        const groupedByCity = data.reduce((acc, laundry) => {
          const city = laundry.location?.city || "Unknown Location";
          if (!acc[city]) {
            acc[city] = [];
          }
          acc[city].push(laundry);
          return acc;
        }, {});

        setLaundriesByCity(groupedByCity);
      } catch (error) {
        console.error("Error fetching laundries:", error);
        setError("Failed to fetch laundries");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have search results
    if (!routerLocation.state?.searchResults) {
      fetchLaundries();
    } else {
      setLoading(false);
    }
  }, [cityName, routerLocation.state]);

  // Handler for "View All" button
  const handleViewAll = (city) => {
    // Navigate to the city-specific route
    navigate(`/explore/city/${encodeURIComponent(city)}`);
  };

  // Filter handlers
  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      showDelivery: false,
      showVerified: false,
      showActive: false,
      minPrice: "",
      maxPrice: "",
    });
  };

  // Check if any filter is applied
  const isAnyFilterActive = () => {
    return (
      filters.showDelivery ||
      filters.showVerified ||
      filters.showActive ||
      filters.minPrice !== "" ||
      filters.maxPrice !== ""
    );
  };

  // Apply filters to laundries
  const applyFilters = (laundryList) => {
    return laundryList.filter((laundry) => {
      // Filter by delivery
      if (filters.showDelivery && !laundry.is_delivery) {
        return false;
      }

      // Filter by verification
      if (filters.showVerified && !laundry.is_verified) {
        return false;
      }

      // Filter by active status
      if (filters.showActive && !laundry.is_active) {
        return false;
      }

      // Filter by price range
      if (
        filters.minPrice &&
        (!laundry.price_per_kg ||
          laundry.price_per_kg < parseFloat(filters.minPrice))
      ) {
        return false;
      }

      if (
        filters.maxPrice &&
        (!laundry.price_per_kg ||
          laundry.price_per_kg > parseFloat(filters.maxPrice))
      ) {
        return false;
      }

      return true;
    });
  };

  // Check if a string contains any part of user's city
  const containsUserCityKeyword = (cityName) => {
    if (!userCity) return false;

    // Convert both to lowercase for case-insensitive comparison
    const userCityLower = userCity.toLowerCase();
    const cityNameLower = cityName.toLowerCase();

    // Check if either string contains the other
    return (
      cityNameLower.includes(userCityLower) ||
      userCityLower.includes(cityNameLower)
    );
  };

  // Render skeleton loaders during loading state
  const renderSkeletons = () => {
    return (
      <div className='mb-12'>
        <div className='flex justify-between items-center mb-4'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-64 mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-48'></div>
          </div>
          <div className='w-24 h-10 bg-gray-200 rounded animate-pulse'></div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className='m-4 my-6'>
        <div className='p-4 bg-red-100 text-red-700 rounded-md'>
          <p>Error: {error}</p>
          <p>
            Please make sure your API server is running at http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  // Inline filters component that shows in a single line by default
  const renderInlineFilters = () => {
    return (
      <div className='bg-white p-3 border-b-2'>
        <div className='flex flex-wrap items-center justify-end gap-12'>
          {/* Status filters in a row */}
          <div className='flex items-center space-x-4'>
            <label className='flex items-center whitespace-nowrap'>
              <input
                type='checkbox'
                name='showDelivery'
                checked={filters.showDelivery}
                onChange={handleFilterChange}
                className='mr-1'
              />
              <span className='text-sm'>Delivery</span>
            </label>
            <label className='flex items-center whitespace-nowrap'>
              <input
                type='checkbox'
                name='showVerified'
                checked={filters.showVerified}
                onChange={handleFilterChange}
                className='mr-1'
              />
              <span className='text-sm'>Verified</span>
            </label>
            <label className='flex items-center whitespace-nowrap'>
              <input
                type='checkbox'
                name='showActive'
                checked={filters.showActive}
                onChange={handleFilterChange}
                className='mr-1'
              />
              <span className='text-sm'>Active</span>
            </label>
          </div>

          {/* Price range inputs */}
          <div className='flex items-center'>
            <span className='text-sm whitespace-nowrap mr-2'>Price</span>
            <input
              type='number'
              name='minPrice'
              placeholder='Min'
              value={filters.minPrice}
              onChange={handleFilterChange}
              className='border rounded p-1 w-16 text-sm mx-1'
              min='0'
            />
            <span className='mx-1'>-</span>
            <input
              type='number'
              name='maxPrice'
              placeholder='Max'
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className='border rounded p-1 w-16 text-sm mx-1'
              min='0'
            />
          </div>

          {/* Reset button - only show when filters are applied */}
          {isAnyFilterActive() && (
            <button
              onClick={resetFilters}
              className='bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-200'
            >
              Reset
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render search results
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <p className='text-center py-10'>
          No results found for "{searchQuery}"
        </p>
      );
    }

    return (
      <div className='mb-12'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold mb-2'>Search Results</h1>
          <p className='text-gray-600'>
            Showing {searchResults.length} results for "{searchQuery}"
          </p>
          <button
            onClick={() => {
              navigate("/explore", { replace: true });
              setSearchResults([]);
              setSearchQuery("");
            }}
            className='text-blue-600 hover:text-blue-800 mt-2'
          >
            Clear search results
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {searchResults.map((laundry) => (
            <LaundryCard
              key={laundry.id}
              data={laundry}
            />
          ))}
        </div>
      </div>
    );
  };

  // Organize cities to show user's current city first, then others
  const renderLaundryContent = () => {
    if (loading) {
      return (
        <>
          {renderSkeletons()}
          {renderSkeletons()}
        </>
      );
    }

    // If we have search results, show them instead of the regular content
    if (searchResults.length > 0) {
      return renderSearchResults();
    }

    if (Object.keys(laundriesByCity).length === 0) {
      return (
        <p className='col-span-full text-center py-10'>No laundries found</p>
      );
    }

    // Sort cities to put user's city first
    const sortedCities = Object.keys(laundriesByCity).sort((a, b) => {
      // If city contains user's city name keyword, put it first
      if (containsUserCityKeyword(a) && !containsUserCityKeyword(b)) return -1;
      if (!containsUserCityKeyword(a) && containsUserCityKeyword(b)) return 1;
      return 0;
    });

    return sortedCities.map((city) => {
      const cityLaundries = laundriesByCity[city];
      const isUserCity = containsUserCityKeyword(city);

      // If we're on a city-specific page, only show that city's laundries
      if (filterCity && city.toLowerCase() !== filterCity.toLowerCase()) {
        return null;
      }

      // Apply filters to laundries
      const filteredLaundries = applyFilters(cityLaundries);

      // Limit to only show 4 products per city
      const limitedLaundries = filterCity
        ? filteredLaundries
        : filteredLaundries.slice(0, 4);

      return (
        <div
          key={city}
          className='mb-12 mt-5'
        >
          <div className='mx-4 flex justify-between items-center mb-2 ml-2'>
            <div>
              <h1 className='text-4xl font-bold'>
                {isUserCity ? `${city}` : `${city}`}
              </h1>
              <p className='text-gray-600'>
                Explore the best laundries in {city}
              </p>
            </div>
            {!filterCity && (
              <Button
                text={"View All"}
                onClick={() => handleViewAll(city)}
              />
            )}
          </div>

          {/* Display inline filters when on city-specific page */}
          {filterCity && renderInlineFilters()}

          {filteredLaundries.length === 0 ? (
            <p className='text-center py-10'>No laundries match your filters</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {limitedLaundries.map((laundry) => (
                <LaundryCard
                  key={laundry.id}
                  data={laundry}
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div className='m-4 my-0'>
        {filterCity && !searchResults.length > 0 && (
          <div className='mb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <button
                  onClick={() => navigate("/explore")}
                  className='text-blue-900 hover:text-blue-800 mr-2'
                >
                  &larr; Back to All Cities
                </button>
              </div>
            </div>
          </div>
        )}
        {renderLaundryContent()}
      </div>
    </>
  );
};

export default Explore;
