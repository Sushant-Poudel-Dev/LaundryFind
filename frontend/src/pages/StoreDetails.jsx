import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import Button from "../components/Button";
import HomeHeroImage from "../media/HomeHeroImage.jpg";
import { getStoreById } from "../api/api";

const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [error, setError] = useState(null);

  // State for clothing selection form
  const [clothingSelection, setClothingSelection] = useState({
    regular: 0,
    heavy: 0,
    dryClean: 0,
    colorSensitive: 0,
  });
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Debug the ID
  console.log("Store ID from URL params:", id);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching store with ID:", id);
        const data = await getStoreById(id);
        console.log("Received store data:", data);
        setStore(data);
        // Set the active image to the thumbnail or the first image in the array
        setActiveImage(
          data.thumbnail ||
            (data.images && data.images.length > 0
              ? data.images[0]
              : HomeHeroImage)
        );
      } catch (error) {
        console.error("Error fetching store details:", error);
        setError("Failed to load store details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStoreDetails();
    }
  }, [id]);

  // Handle clothing quantity change
  const handleClothingChange = (type, value) => {
    // Ensure value is not negative
    const newValue = Math.max(0, parseInt(value));
    setClothingSelection({
      ...clothingSelection,
      [type]: newValue,
    });
  };

  // Generate WhatsApp message with clothing details
  const generateWhatsAppLink = () => {
    // Create a message with clothing details
    let message = "Hi, I'm interested in your laundry services. ";

    // Add clothing details if any are selected
    const clothingItems = [];
    if (clothingSelection.regular > 0)
      clothingItems.push(`${clothingSelection.regular} regular items`);
    if (clothingSelection.heavy > 0)
      clothingItems.push(`${clothingSelection.heavy} heavy items`);
    if (clothingSelection.dryClean > 0)
      clothingItems.push(`${clothingSelection.dryClean} dry clean items`);
    if (clothingSelection.colorSensitive > 0)
      clothingItems.push(
        `${clothingSelection.colorSensitive} color-sensitive items`
      );

    if (clothingItems.length > 0) {
      message +=
        "I would like to have the following cleaned: " +
        clothingItems.join(", ") +
        ". ";
    }

    // Add special instructions if provided
    if (specialInstructions.trim()) {
      message += `Special instructions: ${specialInstructions}`;
    }

    // Use a specific phone number for messaging
    const phoneNumber = "9848619720";

    // Format phone number correctly for international format
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    // Add Nepal's country code if not present
    const formattedPhone = digitsOnly.startsWith("977")
      ? digitsOnly
      : `977${digitsOnly}`;

    // Return the WhatsApp API URL with properly formatted phone and message
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
      message
    )}`;
  };

  // Debug loading state
  if (loading) {
    console.log("Store details are loading...");
    return (
      <div className='container mx-auto p-4'>
        <div className='animate-pulse'>
          <div className='bg-gray-300 h-96 w-full mb-4'></div>
          <div className='h-8 bg-gray-300 rounded w-1/2 mb-4'></div>
          <div className='h-4 bg-gray-300 rounded w-full mb-2'></div>
          <div className='h-4 bg-gray-300 rounded w-5/6 mb-4'></div>
          <div className='h-64 bg-gray-300 rounded w-full mt-8'></div>
        </div>
      </div>
    );
  }

  // Debug error state
  if (error || !store) {
    console.log("Error state:", error, "Store:", store);
    return (
      <div className='container mx-auto p-4'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <p>{error || "Store not found"}</p>
        </div>
      </div>
    );
  }

  // Function to handle image click and set as active image
  const handleImageClick = (image) => {
    setActiveImage(image);
  };

  // Prepare Google Maps URL with the store's coordinates
  const googleMapsUrl = `https://maps.google.com/maps?q=${
    store.location?.latitude || 0
  },${store.location?.longitude || 0}&z=15&output=embed`;

  const detailTopics = [
    "Location",
    "Contact",
    "Business Hours",
    "Pricing",
    "Additional Information",
  ];

  const detailValues = {
    Location: {
      city: store.location?.city || "Not specified",
      address: store.location?.address || "Not specified",
    },
    Contact: {
      phone: store.contact?.phone || "Not specified",
      email: store.contact?.email || "Not specified",
      website: store.contact?.website || "Not specified",
    },
    Business_Hours: store.opening_hours || "Not specified",
    Pricing: store.price_per_kg
      ? `Rs. ${store.price_per_kg} per kg`
      : "Not specified",
  };

  return (
    <div className='container mx-auto p-4 mb-10'>
      {/* Main image section */}
      <div className='mb-6'>
        <img
          src={activeImage || HomeHeroImage}
          alt={store.name}
          className='w-full h-96 object-cover rounded-lg border-2'
        />
      </div>

      {/* Thumbnail images */}
      {store.images && store.images.length > 0 && (
        <div className='flex justify-center gap-5 space-x-2 mb-2 overflow-x-auto py-2'>
          <img
            src={store.thumbnail || HomeHeroImage}
            alt='Thumbnail'
            className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
              activeImage === store.thumbnail ? "ring-2 ring-blue-900" : ""
            }`}
            onClick={() => handleImageClick(store.thumbnail || HomeHeroImage)}
          />
          {store.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${store.name} image ${index + 1}`}
              className={`h-20 w-20 object-cover rounded cursor-pointer ${
                activeImage === image ? "ring-2 ring-blue-900" : ""
              }`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      )}

      {/* Store details */}
      <div className='p-6 mb-2'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-4xl font-bold flex items-center text-blue-900'>
            {store.name}
            {store.is_verified && (
              <span className='inline-flex ml-2 items-center'>
                <svg
                  className='mt-1 w-5 h-5 text-blue-900'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z' />
                </svg>
              </span>
            )}
          </h1>
          <div className='flex space-x-3'>
            {store.is_active ? (
              <div className='flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded-full shadow-md'>
                <span className='w-2 h-2 bg-white rounded-full animate-pulse mr-2'></span>
                Active
              </div>
            ) : (
              <div className='flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-sm rounded-full shadow-md'>
                <span className='w-2 h-2 bg-white rounded-full mr-2'></span>
                Inactive
              </div>
            )}
            {store.is_delivery && (
              <div className='flex items-center px-3 py-1 bg-blue-900 text-white text-sm rounded-full shadow-md'>
                <svg
                  className='w-3.5 h-3.5 mr-1.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  ></path>
                </svg>
                Delivery
              </div>
            )}
          </div>
        </div>

        <p className='text-lg text-gray-600 mb-6 border-l-4 border-blue-500 pl-2'>
          {store.description}
        </p>

        <div className='grid md:grid-cols-2 gap-8 mt-6'>
          <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300'>
            <div className='bg-blue-900  text-white px-6 py-4'>
              <h2 className='text-xl font-bold'>Laundry Details</h2>
            </div>
            <div className='p-6'>
              {detailTopics.map((topic, index) => {
                // Get the value for this topic
                const value =
                  detailValues[topic] ||
                  detailValues[topic.replace(" ", "_")] ||
                  "Not specified";

                return (
                  <div
                    key={index}
                    className='mb-4 last:mb-0'
                  >
                    <h3 className='text-md font-bold text-blue-900 flex items-center mb-2'>
                      {/* Add icons for each topic */}
                      {topic === "Location" && (
                        <svg
                          className='w-5 h-5 mr-2'
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
                      )}
                      {topic === "Contact" && (
                        <svg
                          className='w-5 h-5 mr-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                          ></path>
                        </svg>
                      )}
                      {topic === "Business Hours" && (
                        <svg
                          className='w-5 h-5 mr-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                          ></path>
                        </svg>
                      )}
                      {topic === "Pricing" && (
                        <svg
                          className='w-5 h-5 mr-2'
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
                      )}
                      {topic === "Additional Information" && (
                        <svg
                          className='w-5 h-5 mr-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          ></path>
                        </svg>
                      )}
                      {topic}
                    </h3>

                    {/* If the value is an object (like Location, Contact), render each property */}
                    {typeof value === "object" ? (
                      <div className='bg-gray-50 p-3 rounded-md space-y-1.5'>
                        {Object.entries(value).map(([key, val]) => (
                          <p
                            key={key}
                            className='text-sm text-gray-700 flex items-center'
                          >
                            <span className='inline-block w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
                            <span className='font-medium text-blue-800'>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                            </span>
                            <span className='ml-1'>{val}</span>
                          </p>
                        ))}
                      </div>
                    ) : (
                      /* Otherwise, just render the value directly */
                      <div className='bg-gray-50 p-3 rounded-md'>
                        <p className='text-gray-700'>{value}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm overflow-hidden border-2 border-gray-100 hover:border-green-200 transition-all duration-300'>
            <div className='bg-green-900 text-white px-6 py-4'>
              <h2 className='text-xl font-bold'>Request Laundry Service</h2>
            </div>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-5 pb-2 border-b border-gray-200'>
                <p className='text-sm font-medium text-blue-900'>
                  Customize your laundry order
                </p>
                <div className='text-sm font-medium text-white bg-blue-900 px-3 py-1 rounded-full flex items-center shadow-sm'>
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
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    ></path>
                  </svg>
                  Total:{" "}
                  {Object.values(clothingSelection).reduce(
                    (sum, count) => sum + count,
                    0
                  )}{" "}
                  items
                </div>
              </div>

              <div className='space-y-5'>
                {/* Clothing Type Selection - centered and better styled */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center justify-between bg-gray-50 px-3 py-3 rounded-md shadow-sm hover:bg-gray-100 transition-colors'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                      <svg
                        className='w-4 h-4 mr-1 text-blue-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M13 7H7v6h6V7z' />
                        <path
                          fillRule='evenodd'
                          d='M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Regular Clothes
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={clothingSelection.regular || ""}
                      onChange={(e) =>
                        handleClothingChange("regular", e.target.value)
                      }
                      className='w-16 h-8 text-center rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  <div className='flex items-center justify-between bg-gray-50 px-3 py-3 rounded-md shadow-sm hover:bg-gray-100 transition-colors'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                      <svg
                        className='w-4 h-4 mr-1 text-green-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z'
                          clipRule='evenodd'
                        />
                        <path d='M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z' />
                      </svg>
                      Heavy Items
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={clothingSelection.heavy || ""}
                      onChange={(e) =>
                        handleClothingChange("heavy", e.target.value)
                      }
                      className='w-16 h-8 text-center rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center justify-between bg-gray-50 px-3 py-3 rounded-md shadow-sm hover:bg-gray-100 transition-colors'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                      <svg
                        className='w-4 h-4 mr-1 text-yellow-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                      </svg>
                      Dry Clean
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={clothingSelection.dryClean || ""}
                      onChange={(e) =>
                        handleClothingChange("dryClean", e.target.value)
                      }
                      className='w-16 h-8 text-center rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  <div className='flex items-center justify-between bg-gray-50 px-3 py-3 rounded-md shadow-sm hover:bg-gray-100 transition-colors'>
                    <label className='text-sm font-medium text-gray-700 flex items-center'>
                      <svg
                        className='w-4 h-4 mr-1 text-purple-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Color-Sensitive
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={clothingSelection.colorSensitive || ""}
                      onChange={(e) =>
                        handleClothingChange("colorSensitive", e.target.value)
                      }
                      className='w-16 h-8 text-center rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className='mt-2'>
                  <label className='text-sm font-medium text-gray-700 mb-1 flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1 text-gray-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Special Instructions (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder='Any specific requirements or notes...'
                    className='p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm'
                  />
                </div>

                {/* Total Items Summary */}
                <div className='bg-blue-50 p-4 rounded-md mt-2 border border-blue-100'>
                  <p className='text-sm font-medium text-blue-800 mb-2 flex items-center'>
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
                        d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                      ></path>
                    </svg>
                    Selected Items:
                  </p>
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    {clothingSelection.regular > 0 && (
                      <p className='flex items-center'>
                        <span className='h-3 w-3 rounded-full bg-blue-500 mr-2'></span>
                        Regular: {clothingSelection.regular}
                      </p>
                    )}
                    {clothingSelection.heavy > 0 && (
                      <p className='flex items-center'>
                        <span className='h-3 w-3 rounded-full bg-green-500 mr-2'></span>
                        Heavy: {clothingSelection.heavy}
                      </p>
                    )}
                    {clothingSelection.dryClean > 0 && (
                      <p className='flex items-center'>
                        <span className='h-3 w-3 rounded-full bg-yellow-500 mr-2'></span>
                        Dry Clean: {clothingSelection.dryClean}
                      </p>
                    )}
                    {clothingSelection.colorSensitive > 0 && (
                      <p className='flex items-center'>
                        <span className='h-3 w-3 rounded-full bg-purple-500 mr-2'></span>
                        Color-Sensitive: {clothingSelection.colorSensitive}
                      </p>
                    )}

                    {/* If no items selected, show a message */}
                    {Object.values(clothingSelection).every(
                      (val) => val === 0
                    ) && (
                      <p className='col-span-2 text-gray-500 italic'>
                        No items selected yet
                      </p>
                    )}
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href={generateWhatsAppLink()}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full bg-green-800 hover:from-green-700 hover:to-green-600 text-white py-3 px-4 rounded-md inline-flex items-center justify-center transition-colors shadow-md mt-2'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z' />
                    <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z' />
                  </svg>
                  Send Request on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        {store.location?.latitude && store.location?.longitude && (
          <div className='mt-10'>
            <h3 className='text-lg font-bold text-blue-900 flex items-center mb-2'>
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
                ></path>
              </svg>
              Map Location
            </h3>
            <div className='rounded-md overflow-hidden border border-gray-200 h-96'>
              <iframe
                src={googleMapsUrl}
                width='100%'
                height='100%'
                frameBorder='0'
                style={{ border: 0 }}
                allowFullScreen=''
                aria-hidden='false'
                tabIndex='0'
                title='Store Location Map'
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;
