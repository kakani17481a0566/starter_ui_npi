export default function InstructionBoard({ text, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="435.245"
      height="452.875"
      viewBox="0 0 435.245 452.875"
      {...props}
    >
      <g transform="translate(-121.13 -211.434)">
        <g transform="translate(121.6 212)">
          <g>
            <path
              d="M135.9,361.7,336.979,212,539.2,361.7"
              transform="translate(-119.827 -212)"
              fill="none"
              stroke="#4f0c00"
              strokeMiterlimit="10"
              strokeWidth="0.909"
            />

            {/* Outer orange frame */}
            <g
              transform="translate(0 137.613)"
              fill="#e37d49"
              stroke="#4f0c00"
              strokeMiterlimit="10"
              strokeWidth="0.47"
            >
              <rect width="434.305" height="314.226" stroke="none" />
              <rect
                x="-0.235"
                y="-0.235"
                width="434.775"
                height="314.696"
                fill="none"
              />
            </g>

            {/* Inner cream board */}
            <g
              transform="translate(30.43 162.836)"
              fill="#f4eedc"
              stroke="#4f0c00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.766"
            >
              <rect width="373.444" height="266.523" stroke="none" />
              <rect
                x="-0.383"
                y="-0.383"
                width="374.21"
                height="267.289"
                fill="none"
              />
            </g>
          </g>

          {/* Horizontal lines */}
          <g transform="translate(60.503 248.51)">
            <line
              x2="304.898"
              stroke="#4f0c00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.766"
            />
            <line
              x2="304.898"
              transform="translate(0 44.312)"
              stroke="#4f0c00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.766"
            />
            <line
              x2="304.898"
              transform="translate(0 88.624)"
              stroke="#4f0c00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.766"
            />
            <line
              x2="304.898"
              transform="translate(0 132.936)"
              stroke="#4f0c00"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.766"
            />
          </g>

          {/* ================================
              TEXT INSIDE SVG USING foreignObject
          =================================*/}
          <foreignObject x="60" y="210" width="320" height="240">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#4f0c00",
                textAlign: "center",
                whiteSpace: "pre-line",
                lineHeight: "1.4",
                padding: "10px"
              }}
            >
              {text}
            </div>
          </foreignObject>
        </g>
      </g>
    </svg>
  );
}
