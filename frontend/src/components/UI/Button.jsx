const Button = ({ backgroundColor, color, hoverColor}) => {
  return (
    <button className={`${backgroundColor} ${color} ${hoverColor} outline-none transition-colors font-medium rounded-sm px-6 py-2.5`}>
      İlan ver
    </button>
  );
};

export default Button;
