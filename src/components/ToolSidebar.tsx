import { useEditorStore } from "../store/useEditorStore";
import type { Technique } from "../types/editor";

const techniques: Technique[] = ["勾", "抹", "挑", "托", "擘"];
const ornaments = ["吟", "猱", "绰", "注"] as const;

export function ToolSidebar() {
  const currentTool = useEditorStore((state) => state.currentTool);
  const setCurrentTool = useEditorStore((state) => state.setCurrentTool);
  const toggleOrnamentOnTool = useEditorStore((state) => state.toggleOrnamentOnTool);

  return (
    <aside className="sidebar sidebar-left">
      <div className="panel-title">工具</div>

      <section className="tool-group">
        <div className="group-label">指法</div>
        <div className="pill-grid">
          {techniques.map((technique) => (
            <button
              key={technique}
              className={`pill ${currentTool.technique === technique ? "active" : ""}`}
              onClick={() => setCurrentTool({ technique })}
            >
              {technique}
            </button>
          ))}
        </div>
      </section>

      <section className="tool-group">
        <div className="group-label">弦位</div>
        <input
          type="range"
          min={1}
          max={7}
          value={currentTool.string}
          onChange={(e) => setCurrentTool({ string: Number(e.target.value) })}
        />
        <div className="meta-text">{currentTool.string} 弦</div>
      </section>

      <section className="tool-group">
        <div className="group-label">徽位</div>
        <input
          type="range"
          min={1}
          max={13}
          value={currentTool.hui}
          onChange={(e) => setCurrentTool({ hui: Number(e.target.value) })}
        />
        <div className="meta-text">{currentTool.hui} 徽</div>
      </section>

      <section className="tool-group">
        <div className="group-label">修饰</div>
        <div className="pill-grid">
          {ornaments.map((ornament) => (
            <button
              key={ornament}
              className={`pill ${currentTool.ornaments.includes(ornament) ? "active" : ""}`}
              onClick={() => toggleOrnamentOnTool(ornament)}
            >
              {ornament}
            </button>
          ))}
        </div>
      </section>

      <section className="tool-group">
        <div className="group-label">时值</div>
        <select
          className="select"
          value={currentTool.duration}
          onChange={(e) => setCurrentTool({ duration: Number(e.target.value) })}
        >
          <option value={0.5}>半拍</option>
          <option value={1}>1拍</option>
          <option value={2}>2拍</option>
        </select>
      </section>
    </aside>
  );
}
