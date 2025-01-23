const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="inline-block w-16 h-16 border-4 border-blue-500 border-t-blue-800 rounded-full animate-spin"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
