const FormLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-6 shadow-md border rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
