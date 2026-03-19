const Avatar = ({ name, size = "md", className = "" }) => {

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Generate consistent color based on name
  const getColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
      "bg-indigo-500",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Size classes
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${getColor(name)}
        rounded-full flex items-center justify-center
        text-white font-bold flex-shrink-0
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;