import { useEditorStore } from "../store/useEditorStore";
import type { ViewMode } from "../types/editor";

const modes: { key: ViewMode; label: string }[] = [
  { key: "standard", label: "标准谱" },
  { key: "teaching", label: "教学谱" },
  { key: "art", label: "艺术谱" },
];

export function ViewModeSwitcher() {
  const viewMode = useEditorStore((state) => state.viewMode);
  const setViewMode = useEditorStore((state) => state.setViewMode);

  return (
    <div className="view-mode-switcher">
      {modes.map((mode) => (
        <button
          key={mode.key}
          className={`pill ${viewMode === mode.key ? "active" : ""}`}
          onClick={() => setViewMode(mode.key)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
