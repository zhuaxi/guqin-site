import { useState } from "react";
import "./styles.css";

type Note = {
  main: string;
  left?: string;
  hui?: string;
  xian?: string;
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = () => {
    setNotes([...notes, { main: "勾", left: "按", hui: "七", xian: "三" }]);
  };

  return (
    <div className="page">
      <div className="paper">
        <div className="title">古琴减字谱</div>

        <div className="notation">
          {notes.map((n, i) => (
            <div key={i} className="column">
              <div className="note">
                {n.left && <div className="left">{n.left}</div>}
                <div className="main">{n.main}</div>
                {n.hui && <div className="hui">{n.hui}</div>}
                {n.xian && <div className="xian">{n.xian}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <button onClick={addNote}>添加音符</button>
        </div>
      </div>
    </div>
  );
}
