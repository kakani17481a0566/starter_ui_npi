// src/app/pages/dashboards/Exam/ExamMCQ.jsx
import { Page } from "components/shared/Page";
import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { questions } from "./ExamVales";
import { DividerWithText } from "./DividerWithText"; // ✅ import divider

// Utils
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const pickDistractors = (all, correct, n = 2) => {
  const pool = all.filter((v) => v !== correct);
  const picked = shuffle(pool).slice(0, n);
  const withCorrect = [correct, ...picked];
  // Ensure unique & then shuffle for final display
  return shuffle([...new Set(withCorrect)]);
};

export default function ExamMCQ() {
  // answers: { [idx]: { label: "Circle", count: 13 } }
  const [answers, setAnswers] = useState({});
  // options: { [idx]: { labelOptions: [...], countOptions: [...] } }
  const [options, setOptions] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Build stable options once
  useEffect(() => {
    const opts = {};
    const allLabels = questions.map((q) => q.label);
    const allCounts = [...new Set(questions.map((q) => q.count))];

    questions.forEach((q, idx) => {
      const labelOptions = pickDistractors(allLabels, q.label, 2);

      // Prefer real counts as distractors; if not enough, add neighbors
      const distractorCounts = allCounts.filter((c) => c !== q.count);
      let countOptions =
        distractorCounts.length >= 2
          ? [q.count, ...shuffle(distractorCounts).slice(0, 2)]
          : [q.count, ...[q.count + 1, q.count - 1].filter((n) => n > 0)].slice(0, 3);

      countOptions = shuffle([...new Set(countOptions)]);
      opts[idx] = { labelOptions, countOptions };
    });

    setOptions(opts);
  }, []);

  const setAnswer = (idx, type, value) => {
    if (showResults) return;
    setAnswers((prev) => {
      const next = { ...prev, [idx]: { ...(prev[idx] || {}), [type]: value } };
      return next;
    });
  };

  // All answered?
  const allAnswered = questions.every((_, idx) => {
    const a = answers[idx];
    return a?.label && (a.count ?? a.count === 0);
  });

  // Results after check
  const results = {};
  if (showResults) {
    questions.forEach((q, idx) => {
      const user = answers[idx] || {};
      results[idx] = {
        labelCorrect: user.label === q.label,
        countCorrect: user.count === q.count,
      };
    });
  }

  const correctCount = Object.values(results).filter(
    (r) => r.labelCorrect && r.countCorrect
  ).length;

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    // keep same options for fairness; if you want new random options, also re-run setOptions here
  };

  return (
    <Page title="Shape Match MCQ">
      <div className="w-full px-4 py-6 bg-white rounded-xl shadow-md border">
        {/* Header with right-aligned actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary-700">
            Choose the correct Shape Name & Count
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowResults(true)}
              disabled={!allAnswered}
              className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold shadow
                ${
                  allAnswered
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Check Answers
            </button>
            {showResults && (
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 shadow"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Score */}
        {showResults && (
          <p className="text-center text-sm mb-6">
            Score:{" "}
            <span
              className={`font-semibold ${
                correctCount > questions.length / 2 ? "text-green-600" : "text-red-600"
              }`}
            >
              {correctCount} / {questions.length}
            </span>
          </p>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.map((q, idx) => {
            const labelOptions = options[idx]?.labelOptions || [];
            const countOptions = options[idx]?.countOptions || [];

            const labelSelected = answers[idx]?.label;
            const countSelected = answers[idx]?.count;

            const labelCorrect = results[idx]?.labelCorrect;
            const countCorrect = results[idx]?.countCorrect;

            return (
              <div
                key={idx}
                className="rounded-lg p-3 w-full bg-gray-50 border border-gray-200 shadow-sm"
              >
                {/* Shape display */}
                <div className="w-full text-center mb-2">
                  <div className="grid grid-cols-5 gap-[2px] text-base md:text-lg text-primary-800 justify-center">
                    {Array.from({ length: q.count }).map((_, i) => (
                      <span key={i}>{q.shape}</span>
                    ))}
                  </div>
                </div>

                {/* Q1: Shape Name */}
                <p className="text-[12px] font-semibold mb-1 text-gray-700">What shape is this?</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {labelOptions.map((opt) => {
                    const selected = labelSelected === opt;
                    const showWrong = showResults && selected && !labelCorrect;
                    const showRight = showResults && q.label === opt; // highlight the correct option
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswer(idx, "label", opt)}
                        disabled={showResults}
                        aria-pressed={selected}
                        className={`px-2 py-1.5 rounded-md border text-xs font-medium transition
                          ${selected ? "bg-primary-100 border-primary-400" : "bg-white hover:bg-gray-100"}
                          ${showWrong ? "bg-red-100 text-red-700 border-red-400" : ""}
                          ${showRight ? "bg-green-100 text-green-700 border-green-400" : ""}
                        `}
                      >
                        {opt}
                        {showResults && selected && labelCorrect && (
                          <CheckCircleIcon className="w-3.5 h-3.5 inline ml-1" />
                        )}
                        {showResults && selected && !labelCorrect && (
                          <XCircleIcon className="w-3.5 h-3.5 inline ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Divider between shape & count */}
                <DividerWithText text="AND" /> {/* ✅ Added divider */}

                {/* Q2: Count */}
                <p className="text-[12px] font-semibold mb-1 text-gray-700 mt-2">How many are there?</p>
                <div className="grid grid-cols-3 gap-2">
                  {countOptions.map((opt) => {
                    const selected = countSelected === opt;
                    const showWrong = showResults && selected && !countCorrect;
                    const showRight = showResults && q.count === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswer(idx, "count", opt)}
                        disabled={showResults}
                        aria-pressed={selected}
                        className={`px-2 py-1.5 rounded-md border text-xs font-medium transition
                          ${selected ? "bg-primary-100 border-primary-400" : "bg-white hover:bg-gray-100"}
                          ${showWrong ? "bg-red-100 text-red-700 border-red-400" : ""}
                          ${showRight ? "bg-green-100 text-green-700 border-green-400" : ""}
                        `}
                      >
                        {opt}
                        {showResults && selected && countCorrect && (
                          <CheckCircleIcon className="w-3.5 h-3.5 inline ml-1" />
                        )}
                        {showResults && selected && !countCorrect && (
                          <XCircleIcon className="w-3.5 h-3.5 inline ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
