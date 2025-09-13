import PropTypes from "prop-types";

const CirclebarWithSeparators = ({
  value = 0,
  size = 60,
  strokeWidth = 6,
  separatorCount = 12,
  color = "var(--color-primary-500)", // ✅ picks primary from theme
  bgColor = "var(--color-gray-200)",   // ✅ background uses theme gray
  separatorColor = "var(--color-primary-200)", // ✅ separators use light primary
  children,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  const separators = Array.from({ length: separatorCount }, (_, i) => {
    const angle = (360 / separatorCount) * i;
    const radians = (angle * Math.PI) / 180;
    const inner = radius - strokeWidth / 2;
    const outer = radius + strokeWidth / 2;

    return (
      <line
        key={i}
        x1={center + inner * Math.cos(radians)}
        y1={center + inner * Math.sin(radians)}
        x2={center + outer * Math.cos(radians)}
        y2={center + outer * Math.sin(radians)}
        stroke={separatorColor} // ✅ themed separators
        strokeWidth="1"
      />
    );
  });

  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg width={size} height={size}>
        {/* Background track */}
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />

        {/* Progress arc */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={center}
          cy={center}
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Separators */}
        {separators}
      </svg>

      {children && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: `${Math.max(8, size * 0.28)}px` }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

CirclebarWithSeparators.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  separatorCount: PropTypes.number,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  separatorColor: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default CirclebarWithSeparators;
