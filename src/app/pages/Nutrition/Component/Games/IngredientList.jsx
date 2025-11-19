export default function IngredientListSVG({
  requiredIngredients = [],
  blenderContents = [],
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="477"
      height="493"
      viewBox="0 0 477 493"
      {...props}
    >
      {/* PANEL SHAPE */}
      <g transform="translate(0 0)">
        <g transform="translate(73 396)" fill="#f7e6b2" stroke="#4f0c00" strokeWidth="0.5">
          <rect width="330" height="96" />
        </g>

        <rect
          width="330"
          height="274"
          transform="translate(73 122)"
          fill="#fff"
        />

        {/* TOP 3 CIRCLES */}
        <ellipse cx="93" cy="94" rx="93" ry="94" transform="translate(145 0)" fill="#fff" />
        <ellipse cx="93" cy="94" rx="93" ry="94" transform="translate(0 0)" fill="#fff" />
        <ellipse cx="93" cy="94" rx="93" ry="94" transform="translate(290 0)" fill="#fff" />
      </g>

      {/* ================================
          TEXT LIST INSIDE SVG
        ================================= */}
      <g transform="translate(0 0)">
        {requiredIngredients.map((item, index) => {
          const yPos = 200 + index * 40;

          const isDone = blenderContents.includes(item);

          return (
            <text
              key={item}
              x="240"
              y={yPos}
              textAnchor="middle"
              fontSize="26"
              fontWeight="600"
              fill={isDone ? "#aaaaaa" : "#333"}
              style={{
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {item}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
