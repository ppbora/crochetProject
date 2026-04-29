import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface Project {
  _id?: string;
  name: string;
  row: number;
  stitch: number;
  rowGoal: number;
  stitchGoal: number;
}

type Tab = "counter" | "projects" | "settings";

const CrochetCounter = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("counter");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [newName, setNewName] = useState("");
  const [timerOn, setTimerOn] = useState(false);
  const [timerInterval, setTimerInterval] = useState(5);
  const [timerTarget, setTimerTarget] = useState<"row" | "stitch">("stitch");
  const [sessionRows, setSessionRows] = useState(0);
  const [sessionStitches, setSessionStitches] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState("0m");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const incrementRef = useRef<(type: "row" | "stitch") => void>(() => {});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("http://localhost:8080/api/counter");
        if (res.data.projects.length > 0) setProjects(res.data.projects);
        else
          setProjects([
            {
              name: "My First Project",
              row: 0,
              stitch: 0,
              rowGoal: 50,
              stitchGoal: 200,
            },
          ]);
      } catch {
        setProjects([
          {
            name: "My First Project",
            row: 0,
            stitch: 0,
            rowGoal: 50,
            stitchGoal: 200,
          },
        ]);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      const mins = Math.round((Date.now() - sessionStart) / 60000);
      setSessionTime(mins + "m");
    }, 30000);
    return () => clearInterval(tick);
  }, [sessionStart]);

  const p = projects[activeIdx] ?? null;

  const updateProject = useCallback(
    (updated: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((proj, i) =>
          i === activeIdx ? { ...proj, ...updated } : proj,
        ),
      );
    },
    [activeIdx],
  );

  const increment = useCallback(
    (type: "row" | "stitch") => {
      setProjects((prev) =>
        prev.map((proj, i) => {
          if (i !== activeIdx) return proj;
          return { ...proj, [type]: proj[type] + 1 };
        }),
      );
      if (type === "row") setSessionRows((s) => s + 1);
      else setSessionStitches((s) => s + 1);
    },
    [activeIdx],
  );

  const decrement = useCallback(
    (type: "row" | "stitch") => {
      setProjects((prev) =>
        prev.map((proj, i) => {
          if (i !== activeIdx) return proj;
          if (proj[type] <= 0) return proj;
          return { ...proj, [type]: proj[type] - 1 };
        }),
      );
    },
    [activeIdx],
  );

  // keep ref always pointing to latest increment
  useEffect(() => {
    incrementRef.current = increment;
  }, [increment]);

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        incrementRef.current(timerTarget);
      }, timerInterval * 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOn, timerInterval, timerTarget]);

  const saveToAccount = async () => {
    try {
      await api.post("http://localhost:8080/api/counter/save", { projects });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save. Please try again.");
    }
  };

  const addProject = async () => {
    if (!newName.trim()) return;
    try {
      const res = await api.post("http://localhost:8080/api/counter", {
        name: newName.trim(),
      });
      setProjects((prev) => [...prev, res.data.project]);
    } catch {
      // fallback local add if not logged in
      setProjects((prev) => [
        ...prev,
        {
          name: newName.trim(),
          row: 0,
          stitch: 0,
          rowGoal: 50,
          stitchGoal: 200,
        },
      ]);
    }
    setNewName("");
  };

  const deleteProject = async (idx: number, id?: string) => {
    if (id) {
      try {
        await api.delete(`http://localhost:8080/api/counter/${id}`);
      } catch {
        alert("Failed to delete project.");
        return;
      }
    }
    setProjects((prev) => prev.filter((_, i) => i !== idx));
    if (activeIdx >= idx && activeIdx > 0) setActiveIdx((a) => a - 1);
  };

  const rowPct = p ? Math.min(100, Math.round((p.row / p.rowGoal) * 100)) : 0;
  const stitchPct = p
    ? Math.min(100, Math.round((p.stitch / p.stitchGoal) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md px-4 py-6">
        <h1
          className="text-2xl font-semibold text-gray-800 mb-5"
          style={{ fontFamily: "Georgia, serif" }}
        >
          stitch<span className="text-green-600">.</span>count
        </h1>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-5">
          {(["counter", "projects", "settings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-green-50 text-green-700"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Counter Tab */}
        {tab === "counter" && p && (
          <div>
            <select
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white mb-4"
              value={activeIdx}
              onChange={(e) => setActiveIdx(Number(e.target.value))}
            >
              {projects.map((proj, i) => (
                <option key={i} value={i}>
                  {proj.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {(["row", "stitch"] as const).map((type) => (
                <div
                  key={type}
                  className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm"
                >
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                    {type}
                  </div>
                  <div
                    className="text-5xl font-semibold text-gray-800 mb-3"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {p[type]}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => decrement(type)}
                      className="w-10 h-10 rounded-full border border-gray-200 text-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <button
                      onClick={() => increment(type)}
                      className="w-10 h-10 rounded-full bg-green-50 border border-green-300 text-xl text-green-700 hover:bg-green-100 transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => updateProject({ [type]: 0 })}
                      className="w-8 h-8 rounded-full border border-gray-200 text-xs text-gray-400 hover:bg-gray-50 self-center"
                    >
                      ↺
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mb-3 text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                Row goal:
                <input
                  type="number"
                  className="w-16 border border-gray-200 rounded-md px-2 py-1 text-sm"
                  value={p.rowGoal}
                  min={1}
                  onChange={(e) =>
                    updateProject({ rowGoal: Number(e.target.value) })
                  }
                />
              </label>
              <label className="flex items-center gap-2 text-gray-500">
                Stitch goal:
                <input
                  type="number"
                  className="w-16 border border-gray-200 rounded-md px-2 py-1 text-sm"
                  value={p.stitchGoal}
                  min={1}
                  onChange={(e) =>
                    updateProject({ stitchGoal: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            {[
              { label: "Rows", pct: rowPct },
              { label: "Stitches", pct: stitchPct },
            ].map(({ label, pct }) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: pct + "%" }}
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { val: sessionRows, label: "rows today" },
                { val: sessionStitches, label: "stitches today" },
                { val: sessionTime, label: "session time" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="bg-gray-100 rounded-lg p-2.5 text-center"
                >
                  <div className="text-lg font-medium text-gray-700">{val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {tab === "projects" && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
              Your projects
            </p>
            <div className="flex flex-col gap-2.5 mb-4">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className={`bg-white border rounded-xl px-4 py-3 cursor-pointer transition-colors flex justify-between items-center ${
                    i === activeIdx
                      ? "border-green-400 border-[1.5px]"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => {
                    setActiveIdx(i);
                    setTab("counter");
                  }}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {proj.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Row {proj.row}/{proj.rowGoal} · Stitch {proj.stitch}/
                      {proj.stitchGoal}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(i, proj._id);
                    }}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New project name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProject()}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
              />
              <button
                onClick={addProject}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Auto-timer (add stitch/row)
                </span>
                <button
                  onClick={() => setTimerOn((t) => !t)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${timerOn ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${timerOn ? "left-5" : "left-0.5"}`}
                  />
                </button>
              </div>
              <div className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
                Every
                <select
                  className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-600"
                  value={timerInterval}
                  onChange={(e) => setTimerInterval(Number(e.target.value))}
                >
                  {[1, 2, 5, 10, 30].map((v) => (
                    <option key={v} value={v}>
                      {v}s
                    </option>
                  ))}
                </select>
                add
                <select
                  className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-600"
                  value={timerTarget}
                  onChange={(e) =>
                    setTimerTarget(e.target.value as "row" | "stitch")
                  }
                >
                  <option value="stitch">1 stitch</option>
                  <option value="row">1 row</option>
                </select>
              </div>
            </div>

            {user ? (
              <>
                <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-medium text-sm">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.username}
                    </p>
                    <span className="text-xs text-gray-400">
                      Linked account
                    </span>
                  </div>
                </div>
                <button
                  onClick={saveToAccount}
                  className="w-full py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save progress to account
                </button>
                {saved && (
                  <p className="text-center text-green-600 text-sm mt-2 font-medium">
                    Progress saved!
                  </p>
                )}
              </>
            ) : (
              <div className="text-center text-sm text-gray-400 mt-4">
                <a
                  href="/login"
                  className="text-green-600 hover:underline font-medium"
                >
                  Sign in
                </a>{" "}
                to save progress across devices
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrochetCounter;
