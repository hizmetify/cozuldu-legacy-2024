const FormLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-lg p-6 shadow-md border rounded-lg bg-white">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
