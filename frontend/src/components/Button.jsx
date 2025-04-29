const Button = ({ text, className = "", onClick }) => {
  return (
    <>
      <button
        className={`bg-blue-900 text-secondary rounded-md px-4 py-1 transition duration-300 ease-in-out ${className}`}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default Button;
