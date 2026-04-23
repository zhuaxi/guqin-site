import { useMemo } from "react";
import { useEditorStore } from "../store/useEditorStore";
import type { Technique } from "../types/editor";

const techniques: Technique[] = ["勾", "抹", "挑", "托", "擘"];
const ornaments = ["吟", "猱", "绰", "注"] as const;

export function PropertySidebar() {
  const notes = useEditorStore((state) => state.notes);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const updateNote = useEditorStore((state) => state.updateNote);
  const toggleOrnamentOnSelected = useEditorStore((state) => state.toggleOrnamentOnSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedIds[0]),
    [notes, selectedIds]
  );

  return (
    <aside className="sidebar sidebar-right">
      <div className="panel-title">属性</div>

      {!selectedNote ? (
        <div className="empty-state">
          选中一个音后，可以在这里修改弦、徽、指法、修饰和时值。
        </div>
      ) : (
        <>
          <div className="property-grid">
            <label className="field">
              <span>弦</span>
              <input
                className="input"
                type="number"
                min={1}
                max={7}
                value={selectedNote.string}
                onChange={(e) =>
                  updateNote(selectedNote.id, { string: Number(e.target.value) })
                }
              />
            </label>

            <label className="field">
              <span>徽</span>
              <input
                className="input"
                type="number"
                min={1}
                max={13}
                value={selectedNote.hui}
                onChange={(e) =>
                  updateNote(selectedNote.id, { hui: Number(e.target.value) })
                }
              />
            </label>

            <label className="field">
              <span>指法</span>
              <select
                className="select"
                value={selectedNote.technique}
                onChange={(e) =>
                  updateNote(selectedNote.id, {
                    technique: e.target.value as Technique,
                  })
                }
              >
                {techniques.map((technique) => (
                  <option key={technique} value={technique}>
                    {technique}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>时值</span>
              <select
                className="select"
                value={selectedNote.duration}
                onChange={(e) =>
                  updateNote(selectedNote.id, { duration: Number(e.target.value) })
                }
              >
                <option value={0.5}>半拍</option>
                <option value={1}>1拍</option>
                <option value={2}>2拍</option>
              </select>
            </label>
          </div>

          <div className="tool-group">
            <div className="group-label">修饰</div>
            <div className="pill-grid">
              {ornaments.map((ornament) => (
                <button
                  key={ornament}
                  className={`pill ${selectedNote.ornaments.includes(ornament) ? "active" : ""}`}
                  onClick={() => toggleOrnamentOnSelected(ornament)}
                >
                  {ornament}
                </button>
              ))}
            </div>
          </div>

          <div className="note-preview">
            <div>当前音</div>
            <div className="meta-text">
              {selectedNote.technique} · {selectedNote.string}弦 · {selectedNote.hui}徽
            </div>
            <div className="meta-text">
              修饰：{selectedNote.ornaments.length ? selectedNote.ornaments.join(" / ") : "无"}
            </div>
          </div>

          <button className="btn btn-danger" onClick={deleteSelected}>
            删除所选音
          </button>
        </>
      )}
    </aside>
  );
}
