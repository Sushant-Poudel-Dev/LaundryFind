const SkeletonCard = () => {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md animate-pulse'>
      {/* Image placeholder */}
      <div className='w-full h-44 bg-gray-200 rounded-md mb-4'></div>

      {/* Name placeholder */}
      <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>

      {/* Description placeholder */}
      <div className='h-4 bg-gray-200 rounded w-full mb-1'></div>

      {/* Address placeholder */}
      <div className='h-4 bg-gray-200 rounded w-5/6 my-2'></div>

      {/* Price placeholder */}
      <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>

      {/* Button placeholder */}
      <div className='h-10 bg-gray-200 rounded w-full mt-2'></div>
    </div>
  );
};

export default SkeletonCard;
