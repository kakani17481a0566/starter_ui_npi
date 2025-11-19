

// Custom colors defined to match the SVG's aesthetics as closely as possible.
const customColors = {
  // Card background
  cardBackground: '#fff',
  // Calendar top bar (Rectangle 81 fill: #8eb197)
  headerGreen: '#8eb197',
  // 1252 Kcal text (fill: #7985f2)
  kcalBlue: '#7985f2',
  // Review your plan... text (fill: #bb921e)
  reviewGold: '#bb921e',
  // Create button fill (#bfc)
  createBtn: '#bfc',
  // Edit button fill (#8eb297)
  editBtn: '#8eb297',
  // All dark text (fill: #1a4255)
  darkText: '#1a4255',
  // Calendar paper background (Rectangle 80 fill: #f4f4f4)
  calendarPaper: '#f4f4f4',
  // Calendar ring/binder color (Group 138 fill: #6d6d6d)
  binderGrey: '#6d6d6d',
  // Calendar ring hole fill (Path 50, 52, etc. fill: #ed4f4f)
  holeRed: '#ed4f4f',
};

// Component to approximate the complex calendar binding rings from the SVG paths
const CalendarBinding = () => {
  // Constants based on the SVG geometry for size and spacing
  const BINDER_COUNT = 7;
  const BINDER_WIDTH = 6; // px, roughly w-[6px]
  const BINDER_HEIGHT = 13; // px, roughly h-[13px]
  const RED_TAB_WIDTH = 6; // px
  const RED_TAB_HEIGHT = 4; // px

  return (
    // Positioning the rings slightly above the calendar body's main paper area
    <div className="absolute top-[-10px] left-0 right-0 flex justify-between px-3 z-10">
      {/* 7 Rings matching the SVG's binding structure */}
      {[...Array(BINDER_COUNT)].map((_, i) => (
        <div key={i} className="relative" style={{ width: `${BINDER_WIDTH}px`, height: `${BINDER_HEIGHT}px` }}>
            {/* The Dark Grey Binder Piece (Oval/Pill Shape) */}
            <div
                className="absolute w-full h-full rounded-full shadow-lg"
                style={{
                    backgroundColor: customColors.binderGrey,
                    // Subtle 3D offset/shadow approximation from SVG Group 138, Path 51 opacity 0.6
                    boxShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                }}
            >
                {/* Inner Red Hole Approximation (Simulated by drawing a red piece slightly offset beneath) */}
                <div
                    className='absolute w-full rounded-full'
                    style={{
                        backgroundColor: customColors.holeRed,
                        width: `${RED_TAB_WIDTH}px`,
                        height: `${RED_TAB_HEIGHT}px`,
                        bottom: `-${RED_TAB_HEIGHT * 0.5}px`, // Place partially below the grey binder
                        left: '0px',
                        zIndex: -1, // Ensure it sits behind the grey binder
                    }}
                />
            </div>
        </div>
      ))}
    </div>
  );
};

// Component for Create/Edit buttons, applying the specific SVG shadow filter
const ActionButton = ({ label, colorClass }) => (
  <button
    // Matching the fixed width (144.298) and height (35.5) of the SVG rect
    className={`
      w-[144px] py-[6px] px-4 rounded-md transition duration-150 ease-in-out
      text-lg font-bold flex items-center justify-center flex-shrink-0
    `}
    style={{
      backgroundColor: colorClass,
      color: customColors.darkText,
      // Custom shadow matching SVG's filter (dx=3, dy=3, stdDeviation=3, opacity=0.271)
      boxShadow: `3px 3px 6px rgba(0, 0, 0, 0.271)`,
      height: '35.5px',
      fontFamily: 'Segoe UI Bold, Segoe UI, sans-serif' // Font preference from SVG
    }}
  >
    {label}
  </button>
);

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      {/* Main Card Container: width=719, height=214, rx=9, shadow (stdDeviation=3, opacity=0.259) */}
      <div
        className="bg-white rounded-xl p-4 sm:p-6 flex items-stretch space-x-6 w-full max-w-[720px] relative"
        style={{
          borderRadius: '9px', // rx="9"
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.259)', // Main card shadow approximation
          minHeight: '214px',
          fontFamily: 'Segoe UI, sans-serif' // Font preference from SVG
        }}
      >

        {/* 1. Calendar Block (Left Side) */}
        <div className="w-[176px] relative flex-shrink-0">

          {/* Calendar Paper/Body (Rectangle 80 fill: #f4f4f4, rx: 11.183) */}
          <div
            className="text-center h-full pt-[44px] relative"
            style={{
              backgroundColor: customColors.calendarPaper,
              borderRadius: '11px', // rx="11.183"
              minHeight: '154.7px',
            }}
          >
            {/* Header Area (Rectangle 81 fill: #8eb197, rx: 11.183 on top) */}
            <div
              className="absolute top-0 left-0 w-full rounded-t-xl py-[10px]"
              style={{
                backgroundColor: customColors.headerGreen,
                height: '44.072px',
                borderRadius: '11px 11px 0 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
               {/* Header: OCTOBER (font-size="20") */}
                <span
                    className="text-xl font-normal tracking-wide"
                    style={{ color: customColors.darkText, fontSize: '20px' }}
                >
                    OCTOBER
                </span>
            </div>

            {/* Calendar Rings/Binding (Positioned to overlap the header bar and the paper) */}
            <CalendarBinding />

            {/* Date Content */}
            <div className="p-4 flex flex-col items-center pt-2">
                {/* Date: 20 (font-size="50" font-weight="700") */}
                <div
                className="text-7xl font-extrabold"
                style={{ color: customColors.darkText, fontSize: '50px', fontFamily: 'Segoe UI Bold, Segoe UI, sans-serif' }}
                >
                20
                </div>

                {/* Day: Monday (font-size="24") */}
                <div
                className="text-2xl font-normal mt-4"
                style={{ color: customColors.darkText, fontSize: '24px' }}
                >
                Monday
                </div>
            </div>

          </div>
        </div>


        {/* 2. Stats and Review Block (Middle Section - Takes up maximum space) */}
        <div className="flex-1 space-y-2 pt-4 flex flex-col justify-center">

          {/* Stats Section */}
          <div className="space-y-1">
            {/* Total calories achieved (font-size="20") */}
            <p className="text-lg font-normal" style={{ color: customColors.darkText, fontSize: '20px' }}>
              Total calories achieved
            </p>
            {/* 1252 Kcal (font-size="25" font-weight="700" color="#7985f2") */}
            <h2 className="text-3xl font-extrabold" style={{ color: customColors.kcalBlue, fontSize: '25px', fontFamily: 'Segoe UI Bold, Segoe UI, sans-serif' }}>
              1252 Kcal
            </h2>

            {/* Review (font-size="20") */}
            <p className="text-lg font-normal pt-4" style={{ color: customColors.darkText, fontSize: '20px' }}>
              Review
            </p>
            {/* Review your plan for the day (font-size="21" color="#bb921e") */}
            <p className="text-xl font-semibold" style={{ color: customColors.reviewGold, fontSize: '21px' }}>
              Review your plan for the day
            </p>
          </div>

        </div>

        {/* 3. Action Buttons Block (Far Right Section - Aligned vertically) */}
        <div className="flex flex-col justify-center space-y-4 pt-4 pb-4 flex-shrink-0">
             <ActionButton label="Create" colorClass={customColors.createBtn} />
             <ActionButton label="Edit" colorClass={customColors.editBtn} />
        </div>

      </div>
    </div>
  );
};

export default App;