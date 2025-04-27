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

  return (
    <div className='container mx-auto p-4 mb-10'>
      {/* Main image section */}
      <div className='mb-6'>
        <img
          src={activeImage || HomeHeroImage}
          alt={store.name}
          className='w-full h-96 object-cover rounded-lg shadow-lg'
        />
      </div>

      {/* Thumbnail images */}
      {store.images && store.images.length > 0 && (
        <div className='flex space-x-2 mb-6 overflow-x-auto py-2'>
          <img
            src={store.thumbnail || HomeHeroImage}
            alt='Thumbnail'
            className={`h-20 w-20 object-cover rounded cursor-pointer ${
              activeImage === store.thumbnail ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleImageClick(store.thumbnail || HomeHeroImage)}
          />
          {store.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${store.name} image ${index + 1}`}
              className={`h-20 w-20 object-cover rounded cursor-pointer ${
                activeImage === image ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      )}

      {/* Store details */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-3xl font-bold flex items-center'>
            {store.name}
            {store.is_verified && (
              <TiTick className='text-blue-500 ml-2 text-2xl' />
            )}
          </h1>
          <div className='flex space-x-2'>
            <Button
              text={store.is_active ? "Active" : "Inactive"}
              className={`${store.is_active ? "bg-green-500" : "bg-red-600"}`}
            />
            {store.is_delivery && (
              <Button
                text='Delivery Available'
                className='bg-blue-500'
              />
            )}
          </div>
        </div>

        <p className='text-lg text-gray-700 mb-4'>{store.description}</p>

        <div className='grid md:grid-cols-2 gap-8'>
          <div>
            <h2 className='text-xl font-semibold mb-4 border-b pb-2'>
              Store Information
            </h2>

            <div className='space-y-3'>
              <div>
                <h3 className='font-semibold text-gray-700'>Location</h3>
                <p>
                  {store.location?.city && (
                    <span className='block'>{store.location.city}</span>
                  )}
                  {store.location?.address && (
                    <span className='block'>{store.location.address}</span>
                  )}
                </p>
              </div>

              <div>
                <h3 className='font-semibold text-gray-700'>Contact</h3>
                {store.contact?.phone && <p>Phone: {store.contact.phone}</p>}
                {store.contact?.email && <p>Email: {store.contact.email}</p>}
                {store.contact?.website && (
                  <p>
                    Website:{" "}
                    <a
                      href={store.contact.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:underline'
                    >
                      {store.contact.website}
                    </a>
                  </p>
                )}
              </div>

              <div>
                <h3 className='font-semibold text-gray-700'>Business Hours</h3>
                <p>{store.opening_hours || "Not specified"}</p>
              </div>

              <div>
                <h3 className='font-semibold text-gray-700'>Pricing</h3>
                <p>
                  {store.price_per_kg
                    ? `Rs. ${store.price_per_kg} per kg`
                    : "Price not available"}
                </p>
              </div>

              <div>
                <h3 className='font-semibold text-gray-700'>
                  Additional Information
                </h3>
                <p>
                  Last updated:{" "}
                  {new Date(store.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4 border-b pb-2'>
              Location Map
            </h2>
            <div className='h-72 md:h-80 w-full'>
              <iframe
                title='Store Location'
                className='w-full h-full rounded-lg border-0'
                frameBorder='0'
                src={googleMapsUrl}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
