import { Page } from "components/shared/Page";
import { useMemo, useState } from "react";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import {
  HashtagIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { questions } from "./ExamVales";

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
        className={`transition-all border-2 border-dashed rounded-lg min-h-[40px] font-semibold flex items-center justify-center p-2 text-sm ${
          isOver
            ? "bg-primary-50 border-primary-500 shadow-md scale-[1.05]"
            : "bg-white border-gray-300"
        }`}
      >
        {children || (
          <span className="text-gray-300">⬇ Drop {label.split(" ")[1]}</span>
        )}
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

  const baseClasses =
    "inline-block rounded-full px-4 py-2 text-sm font-bold text-white cursor-grab m-1 shadow-sm transition-transform duration-150 hover:scale-105";

  const colorClasses = "bg-primary-500 hover:bg-primary-600";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`${baseClasses} ${colorClasses}`}
      aria-label={`Drag ${content}`}
    >
      {content}
    </div>
  );
}

// Main Component
export default function Exam() {
  const [answers, setAnswers] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [shuffledLabels, setShuffledLabels] = useState([]);
  const [shuffledNumbers, setShuffledNumbers] = useState([]);

  // Shuffle function
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Initialize shuffled values
  useMemo(() => {
    setShuffledLabels(shuffle(questions.map((q) => q.label)));
    const uniqueCounts = [...new Set(questions.map((q) => q.count))];
    setShuffledNumbers(shuffle(uniqueCounts));
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    setAnswers((prev) => {
      const updated = { ...prev };
      const idx = parseInt(over.id.split("-")[2]); // e.g. label-box-3 → 3

      if (!updated[idx]) updated[idx] = {};

      if (over.id.startsWith("label-box-")) {
        updated[idx].label = active.id.replace("label-", "");
      }
      if (over.id.startsWith("number-box-")) {
        updated[idx].number = parseInt(active.id.split("-")[1]);
      }

      return updated;
    });
  };

  // Validation with flags
  const validateAnswers = () => {
    const results = {};
    questions.forEach((q, idx) => {
      const userAnswer = answers[idx] || {};
      const labelCorrect = userAnswer.label === q.label;
      const numberCorrect = userAnswer.number === q.count;

      results[idx] = {
        labelCorrect,
        numberCorrect,
        overall: labelCorrect && numberCorrect ? "correct" : "wrong",
      };
    });
    setValidationResults(results);
  };

  const resetAnswers = () => {
    setAnswers({});
    setValidationResults({});
    setShuffledLabels(shuffle(questions.map((q) => q.label)));
    const uniqueCounts = [...new Set(questions.map((q) => q.count))];
    setShuffledNumbers(shuffle(uniqueCounts));
  };

  const correctCount = Object.values(validationResults).filter(
    (r) => r.overall === "correct"
  ).length;

  return (
    <Page title="Shape Match Showdown">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-full px-4 py-6 bg-white rounded-xl shadow-md border">
          <h2 className="text-xl font-semibold text-center text-primary-700 mb-6">
            Match the Shape Name & Count
          </h2>

          {/* Shape Rows */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center rounded-xl p-4 gap-4 w-full md:w-[48%] lg:w-[32%] bg-gradient-to-br from-gray-50 to-gray-100 shadow-md border border-gray-200"
              >
                {/* Shape display */}
                <div className="w-full text-center">
                  <div className="flex flex-wrap justify-center gap-1 text-2xl text-primary-800">
                    {Array.from({ length: q.count }).map((_, i) => (
                      <span key={i}>{q.shape}</span>
                    ))}
                  </div>
                </div>

                {/* Drop targets */}
                <div className="flex flex-col gap-2 w-full">
                  <DroppableBox
                    id={`label-box-${idx}`}
                    label="Shape Name"
                    Icon={TagIcon}
                  >
                    {answers[idx]?.label || null}
                  </DroppableBox>
                  <DroppableBox
                    id={`number-box-${idx}`}
                    label="Shape Count"
                    Icon={HashtagIcon}
                  >
                    {answers[idx]?.number || null}
                  </DroppableBox>

                  {/* Feedback */}
                  {validationResults[idx] && (
                    <>
                      {validationResults[idx].overall === "correct" ? (
                        <div className="flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-1 rounded-full bg-green-100 text-green-700 animate-bounce">
                          <CheckCircleIcon className="w-4 h-4" />
                          Correct!
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 mt-1">
                          {!validationResults[idx].labelCorrect && (
                            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
                              <XCircleIcon className="w-4 h-4" />
                              Shape Name Wrong
                            </div>
                          )}
                          {validationResults[idx].labelCorrect &&
                            !validationResults[idx].numberCorrect && (
                              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                Shape correct, Count wrong
                              </div>
                            )}
                        </div>
                      )}
                    </>
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

          {/* Drag Items - Numbers (unique only) */}
          <h3 className="text-sm font-medium mb-1 text-center text-primary-700">
            Drag Shape Counts
          </h3>
          <div className="flex flex-wrap justify-center mb-8">
            {shuffledNumbers.map((num, idx) => (
              <DraggableItem
                key={idx}
                id={`number-${num}-${idx}`}
                content={num}
              />
            ))}
          </div>

          {/* Action Buttons + Progress */}
          <div className="flex justify-center gap-4">
            <button
              onClick={validateAnswers}
              className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-1.5 px-5 rounded shadow-md text-sm"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Check Answers
            </button>
            <button
              onClick={resetAnswers}
              className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-5 rounded shadow-md text-sm"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Progress */}
          {Object.keys(validationResults).length > 0 && (
            <p className="text-center text-sm font-medium mt-4 text-primary-700">
              You got {correctCount} / {questions.length} correct
            </p>
          )}
        </div>
      </DndContext>
    </Page>
  );
}
