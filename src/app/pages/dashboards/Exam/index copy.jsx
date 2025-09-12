import { Page } from "components/shared/Page";
import { useMemo, useState } from "react";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { HashtagIcon, TagIcon } from "@heroicons/react/24/outline";

// Shape questions
const questions = [
  { label: "Circle", shape: "\u26AB", count: 13 },
  { label: "Star", shape: "\u2B50", count: 12 },
  { label: "Heart", shape: "\u2764", count: 16 },
  { label: "Triangle", shape: "\u25B2", count: 11 },
  { label: "Square", shape: "\u25A0", count: 14 },
  { label: "Shindenfu", shape: "\u262F", count: 20 },
];

// Drop area
function DroppableBox({ id, children, label, Icon }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="w-full text-center">
      <div className="flex items-center justify-center text-xs font-semibold text-primary-600 mb-1 uppercase tracking-wide gap-1">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </div>
      <div
        ref={setNodeRef}
        className={`transition-all border-2 border-dashed rounded min-h-[36px] font-semibold flex items-center justify-center p-1 text-sm ${
          isOver ? "bg-primary-50 border-primary-500 scale-[1.02]" : "bg-white"
        }`}
      >
        {children || <span className="text-gray-300">⬇ Drop Here</span>}
      </div>
    </div>
  );
}

// Drag item
function DraggableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: 999,
  };
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="inline-block border rounded-md px-3 py-1.5 text-sm bg-primary-500 text-white font-medium cursor-grab m-1 shadow-sm hover:bg-primary-600"
    >
      {content}
    </div>
  );
}

// Main Component
export default function Exam() {
  const [labelTargets, setLabelTargets] = useState({});
  const [numberTargets, setNumberTargets] = useState({});
  const [validationResults, setValidationResults] = useState({});

  const shuffledLabels = useMemo(() => {
    return [...questions].map((q) => q.label).sort(() => Math.random() - 0.5);
  }, []);

  const shuffledNumbers = useMemo(() => {
    return [...questions].map((q) => q.count).sort(() => Math.random() - 0.5);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (over.id.startsWith("label-box-")) {
      setLabelTargets((prev) => ({ ...prev, [over.id]: active.id }));
    }
    if (over.id.startsWith("number-box-")) {
      setNumberTargets((prev) => ({ ...prev, [over.id]: active.id }));
    }
  };

  const validateAnswers = () => {
    const results = {};
    questions.forEach((q, idx) => {
      const labelBoxId = `label-box-${idx}`;
      const numberBoxId = `number-box-${idx}`;
      const droppedLabel = labelTargets[labelBoxId]?.replace("label-", "");
      const droppedNumber = parseInt(
        numberTargets[numberBoxId]?.replace("number-", "")
      );
      results[idx] =
        droppedLabel === q.label && droppedNumber === q.count ? "correct" : "wrong";
    });
    setValidationResults(results);
  };

  return (
    <Page title="Shape Match Showdown">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-full px-4 py-6 bg-white rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-center text-primary-700 mb-6">
            Match the Shape Name & Count
          </h2>

          {/* Shape Rows */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center border rounded-lg p-3 gap-4 w-full md:w-[48%] lg:w-[32%] bg-gray-50 shadow-sm"
              >
                {/* Shape display */}
                <div className="w-full text-center">
                  <div className="grid grid-cols-5 gap-1 text-xl text-primary-800 justify-center">
                    {Array.from({ length: q.count }).map((_, i) => (
                      <span key={i}>{q.shape}</span>
                    ))}
                  </div>
                </div>

                {/* Drop targets */}
                <div className="flex flex-col gap-2 w-full">
                  <DroppableBox id={`label-box-${idx}`} label="Shape Name" Icon={TagIcon}>
                    {labelTargets[`label-box-${idx}`]}
                  </DroppableBox>
                  <DroppableBox
                    id={`number-box-${idx}`}
                    label="Shape Count"
                    Icon={HashtagIcon}
                  >
                    {numberTargets[`number-box-${idx}`]}
                  </DroppableBox>

                  {validationResults[idx] === "correct" && (
                    <p className="text-green-600 text-xs font-semibold mt-1">✅ Correct!</p>
                  )}
                  {validationResults[idx] === "wrong" && (
                    <p className="text-red-500 text-xs font-semibold mt-1">❌ Incorrect</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Drag Items - Labels */}
          <h3 className="text-sm font-medium mb-1 text-center text-primary-700">
            Drag Shape Names
          </h3>
          <div className="flex flex-wrap justify-center mb-6">
            {shuffledLabels.map((label, idx) => (
              <DraggableItem key={idx} id={`label-${label}`} content={label} />
            ))}
          </div>

          {/* Drag Items - Numbers */}
          <h3 className="text-sm font-medium mb-1 text-center text-primary-700">
            Drag Shape Counts
          </h3>
          <div className="flex flex-wrap justify-center mb-8">
            {shuffledNumbers.map((num, idx) => (
              <DraggableItem key={idx} id={`number-${num}`} content={num} />
            ))}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={validateAnswers}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-1.5 px-5 rounded shadow-md text-sm"
            >
              Check Answers
            </button>
          </div>
        </div>
      </DndContext>
    </Page>
  );
}
