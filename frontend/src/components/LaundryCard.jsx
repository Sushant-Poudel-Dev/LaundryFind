import Button from "./Button";
import HomeHeroImage from "../media/HomeHeroImage.jpg";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const LaundryCard = ({ data }) => {
  const navigate = useNavigate();

  const handleSeeDetails = () => {
    // Debug logging
    console.log("LaundryCard data:", data);
    console.log("Navigating to store with ID:", data.id);

    // Use React Router navigation
    navigate(`/store/${data.id}`);
  };

  return (
    <>
      <div className='bg-white p-4 relative'>
        <img
          src={data.thumbnail || HomeHeroImage}
          alt={data.name}
          className='w-full h-44 object-cover rounded-md mb-4'
        />
        <h2 className='flex items-center text-xl font-semibold'>
          {data.name}
          {data.is_verified ? <TiTick className='text-blue-500 ml-2' /> : null}
          {data.is_active ? (
            <Button
              className='text-sm ml-2 bg-green-500'
              text={"Active"}
            />
          ) : (
            <Button
              className='bg-red-600 text-sm ml-2'
              text={"Inactive"}
            />
          )}
        </h2>
        <p className='text-gray-600'>{data.description}</p>
        <p className='text-gray-600 text-sm my-1 min-h-10'>
          {data.location?.city ? `${data.location.city}, ` : ""}
          {data.location?.address || "Address not available"}
        </p>
        <p className='text-gray-600'>
          {data.price_per_kg
            ? `Rs. ${data.price_per_kg} per kg`
            : "Price not available"}
        </p>
        <Button
          className='mt-2 w-full'
          text={"See Details"}
          onClick={handleSeeDetails}
        />
      </div>
    </>
  );
};

export default LaundryCard;
