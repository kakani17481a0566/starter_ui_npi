import { useEffect, useMemo, useState } from "react";
import { fetchResponseData } from "./ResponseData"; // adjust alias if needed
import Card from "./Card";
// import { useNavigate } from "react-router-dom";  
import AlphabetTutor from "..";
// import { useNavigate } from "react-router-dom";

export default function StatusCards() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [okMsg, setOkMsg] = useState("");              
  const [activeTutorName, setActiveTutorName] = useState(null);
  // const navigate=useNavigate();


  // Prevent page scroll while this component is mounted
  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  // Load from API (dummy removed)
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchResponseData();
      setRecords(data);
      setPage(1);
    } catch (err) {
      console.error(err);
      setRecords([]); // or keep previous
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Adjust this to fit your design without scrolling
  const PER_PAGE = 16;

  const totalPages = Math.max(1, Math.ceil(records.length / PER_PAGE));
  const pageData = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return records.slice(start, start + PER_PAGE);
  }, [records, page]);
  const handleOnClick=(item)=>{
    const isRight =
    item?.isCorrect === true ||
    String(item?.isCorrect ?? "")
      .toLowerCase()
      .trim() === "correct";

  if (isRight) {
    setOkMsg(`Pronounced "${item.name}" correctly!`);
    setTimeout(() => setOkMsg(""), 1500);
  } else {
    setActiveTutorName(item.name);
    // navigate("/dashboards/ai")
  }
  };

  return (
    <>
    {activeTutorName ? (
      <AlphabetTutor name={activeTutorName} />
    ) : (

    <div className="h-screen w-full overflow-hidden bg-slate-50 flex flex-col">
      {/* Header / Controls */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Dynamic Cards</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-slate-600">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={load}
            className="ml-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white"
          >
            Reload
          </button>
        </div>
      </div>
      


      {/* Content (fills remaining viewport height, no scroll) */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-6">
        <div className="h-full w-full rounded-2xl bg-white shadow p-4 sm:p-6 overflow-hidden">
          {okMsg && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-4 py-2 rounded-xl bg-black/80 text-white text-center text-sm sm:text-base">
                {okMsg}
              </div>
            </div>
          )}
          {loading ? (
            <div className="h-full w-full grid place-items-center">
              <div className="animate-pulse text-slate-500">Loading…</div>
            </div>
          ) : (
            <div
              className="
                grid gap-4 sm:gap-5 md:gap-6
                grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
                h-full
              "
            >
              {pageData.map((item) => (
                <Card key={item.id} name={item.name} isCorrect={item.isCorrect} url={item.url} onClick={()=>handleOnClick(item)}/>
              ))}

              {/* fill placeholders to keep grid stable */}
              {Array.from({ length: Math.max(0, PER_PAGE - pageData.length) }).map((_, i) => (
                <div key={`ph-${i}`} className="rounded-2xl border border-dashed border-slate-200" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
     )}
      </>
  );
}
