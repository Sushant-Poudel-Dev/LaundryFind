import Button from "./Button";
import HomeHeroImage from "../media/HomeHeroImage.jpg";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { use, useEffect } from "react";

const LaundryCard = ({ data }) => {
  const navigate = useNavigate();

  const handleSeeDetails = () => {
    // Debug logging
    console.log("LaundryCard data:", data);
    console.log("Navigating to store with ID:", data.id);

    // Use React Router navigation
    navigate(`/store/${data.id}`);
  };

  const getFirstDigitOfEveryWord = (title) => {
    const words = title.split(" ");
    const firstDigits = words.map((word) => word.charAt(0)).join("");
    return firstDigits.toUpperCase();
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className='bg-white p-5 relative rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full'>
      <div className='relative overflow-hidden rounded-lg mb-4'>
        <img
          src={
            // data.thumbnail ||
            `https://placehold.co/300x200/${getRandomColor()}/FFFFFF?text=${getFirstDigitOfEveryWord(
              data.name
            )}`
          }
          alt={data.name}
          className='w-full h-44 object-cover transition-transform duration-500 hover:scale-110'
          onError={(e) => {
            e.target.onerror = null;
          }}
        />

        {data.is_verified && (
          <div className='absolute top-2 right-2 bg-white bg-opacity-90 p-1 rounded-full shadow'>
            <TiTick className='text-blue-900 text-lg' />
          </div>
        )}
      </div>

      <div className='flex-grow'>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='font-semibold text-lg text-gray-800 line-clamp-1'>
            {data.name}
          </h2>
          {data.is_active ? (
            <span className='text-xs bg-green-600 text-white px-4 py-1 rounded-full font-medium'>
              Active
            </span>
          ) : (
            <span className='text-xs bg-red-600 text-white px-2 py-1 rounded-full font-medium'>
              Inactive
            </span>
          )}
        </div>

        <p className='text-gray-500 text-sm line-clamp-2 mb-2'>
          {data.description}
        </p>

        <div className='flex items-center text-gray-500 text-sm mb-1'>
          <svg
            className='w-4 h-4 mr-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
            ></path>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
            ></path>
          </svg>
          <p className='min-h-5 line-clamp-1'>
            {data.location?.city ? `${data.location.city}, ` : ""}
            {data.location?.address || "Address not available"}
          </p>
        </div>

        <div className='flex items-center text-gray-500 text-sm mb-4'>
          <svg
            className='w-4 h-4 mr-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <p>
            {data.price_per_kg ? (
              <span className='font-medium text-gray-500'>
                Rs. {data.price_per_kg} per kg
              </span>
            ) : (
              "Price not available"
            )}
          </p>
        </div>
      </div>

      <Button
        className='mt-auto w-full bg-blue-500 hover:bg-blue-600 text-white py-2 shadow-sm transition-all duration-200 hover:shadow-md'
        text={"See Details"}
        onClick={handleSeeDetails}
      />
    </div>
  );
};

export default LaundryCard;
