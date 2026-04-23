import { useMemo, useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { GRID, logicalToPixel, pixelToLogical } from "../utils/grid";
import type { Note, ViewMode } from "../types/editor";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

function NoteNode({
  note,
  isSelected,
  isPlaying,
  viewMode,
  onSelect,
}: {
  note: Note;
  isSelected: boolean;
  isPlaying: boolean;
  viewMode: ViewMode;
  onSelect: (id: string) => void;
}) {
  const { x, y } = logicalToPixel(note.position);
  const artClass = viewMode === "art" ? " art" : "";
  const teaching = viewMode === "teaching";

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="note-node"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(note.id);
      }}
    >
      <circle
        r={viewMode === "art" ? "14" : "18"}
        className={
          "note-circle" +
          (isSelected ? " selected" : "") +
          (isPlaying ? " playing" : "") +
          artClass
        }
      />
      <text y={viewMode === "art" ? "-22" : "-26"} textAnchor="middle" className="note-technique">
        {note.technique}
      </text>
      {viewMode !== "art" && (
        <text y="5" textAnchor="middle" className="note-core">
          {note.string}
        </text>
      )}
      {(teaching || viewMode === "standard") && (
        <text y="32" textAnchor="middle" className="note-meta">
          {note.hui}徽
        </text>
      )}
      {teaching && note.ornaments.length > 0 && (
        <text x="28" y="5" className="note-ornaments">
          {note.ornaments.join("·")}
        </text>
      )}
    </g>
  );
}

export function EditorCanvas() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const notes = useEditorStore((state) => state.notes);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const currentTool = useEditorStore((state) => state.currentTool);
  const addNote = useEditorStore((state) => state.addNote);
  const setSelected = useEditorStore((state) => state.setSelected);
  const viewMode = useEditorStore((state) => state.viewMode);
  const playingId = useEditorStore((state) => state.playingId);

  const rows = useMemo(() => {
    const maxRow = Math.max(3, ...notes.map((note) => note.position.row + 1));
    return Array.from({ length: maxRow }, (_, i) => i);
  }, [notes]);

  const cols = useMemo(() => {
    const maxCol = Math.max(8, ...notes.map((note) => note.position.col + 2));
    return Array.from({ length: maxCol }, (_, i) => i);
  }, [notes]);

  function handleCanvasClick(event: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const position = pixelToLogical(x, y);

    const hitNote = notes.find(
      (note) =>
        note.position.row === position.row && note.position.col === position.col
    );

    if (hitNote) {
      setSelected([hitNote.id]);
      return;
    }

    addNote({
      id: crypto.randomUUID(),
      string: currentTool.string,
      hui: currentTool.hui,
      technique: currentTool.technique,
      ornaments: currentTool.ornaments,
      duration: currentTool.duration,
      position,
    });
  }

  return (
    <main className={`editor-stage mode-${viewMode}`}>
      <div className="editor-title-block">
        <div className="editor-head-row">
          <div>
            <div className="editor-title">编辑器</div>
            <div className="meta-text">点击网格落音；上方可切换标准谱 / 教学谱 / 艺术谱。</div>
          </div>
          <ViewModeSwitcher />
        </div>
      </div>

      <div className="canvas-shell">
        <svg
          ref={svgRef}
          className="score-svg"
          width="100%"
          height="100%"
          viewBox="0 0 1180 700"
          onClick={handleCanvasClick}
        >
          <rect x="0" y="0" width="1180" height="700" className="canvas-bg" />

          {rows.map((row) => {
            const y = GRID.topPadding + row * GRID.rowHeight;
            return (
              <g key={row}>
                {viewMode !== "art" && (
                  <text x="28" y={y + 5} className="row-label">
                    第 {row + 1} 段
                  </text>
                )}
                <line x1="78" x2="1120" y1={y} y2={y} className="guide-line" />
              </g>
            );
          })}

          {viewMode !== "art" &&
            cols.map((col) => {
              const x = GRID.leftPadding + col * GRID.colWidth;
              return (
                <line
                  key={col}
                  x1={x}
                  x2={x}
                  y1="46"
                  y2="650"
                  className="guide-column"
                />
              );
            })}

          {notes.map((note) => (
            <NoteNode
              key={note.id}
              note={note}
              isSelected={selectedIds.includes(note.id)}
              isPlaying={playingId === note.id}
              viewMode={viewMode}
              onSelect={(id) => setSelected([id])}
            />
          ))}
        </svg>
      </div>
    </main>
  );
}
