import { useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { playSequence } from "../utils/audio";

const STORAGE_KEY = "guqin-notation-project-v2";

export function Header() {
  const notes = useEditorStore((state) => state.notes);
  const clearAll = useEditorStore((state) => state.clearAll);
  const replaceNotes = useEditorStore((state) => state.replaceNotes);
  const setPlayingId = useEditorStore((state) => state.setPlayingId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleSaveLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    alert("已保存到浏览器本地。");
  }

  function handleLoadLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      alert("本地没有已保存的谱。");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      replaceNotes(parsed);
      alert("已从本地载入。");
    } catch {
      alert("本地数据读取失败。");
    }
  }

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "guqin-score.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid format");
        }
        replaceNotes(parsed);
        alert("导入成功。");
      } catch {
        alert("导入失败，请检查 JSON 格式。");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  async function handlePlay() {
    if (!notes.length) return;
    await playSequence(notes, setPlayingId);
  }

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-title">古琴打谱</div>
          <div className="brand-subtitle">Guqin Notation Starter V2</div>
        </div>
      </div>

      <div className="header-center">《未命名琴曲》</div>

      <div className="header-actions">
        <button className="btn btn-ghost" onClick={handleSaveLocal}>保存本地</button>
        <button className="btn btn-ghost" onClick={handleLoadLocal}>读取本地</button>
        <button className="btn btn-ghost" onClick={handleExportJson}>导出 JSON</button>
        <button
          className="btn btn-ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          导入 JSON
        </button>
        <button className="btn btn-ghost" onClick={handlePlay}>播放</button>
        <button className="btn btn-danger-outline" onClick={clearAll}>清空</button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.currentTarget.value = "";
          }}
        />
      </div>
    </header>
  );
}
