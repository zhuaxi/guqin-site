import "./styles.css";

type Note = {
  main: string;   // 减字主字（如：勾、挑）
  top?: string;   // 上方小字（徽位/弦位）
};

// 示例谱（你可以自己改）
const NOTES: Note[] = [
  { main: "勾", top: "七" },
  { main: "勾", top: "七" },
  { main: "勾", top: "七" },
  { main: "三" },
  { main: "三" },
  { main: "三" },

  { main: "抹", top: "六" },
  { main: "挑", top: "六" },
  { main: "勾", top: "七" },
  { main: "剔", top: "五" },
  { main: "按", top: "七" },
  { main: "泛", top: "九" },

  { main: "吟" },
  { main: "猱" },
];

// 每列 14 字（古琴常见排法）
const COLUMN_SIZE = 14;

function splitColumns(notes: Note[]) {
  const cols: Note[][] = [];
  for (let i = 0; i < notes.length; i += COLUMN_SIZE) {
    cols.push(notes.slice(i, i + COLUMN_SIZE));
  }
  return cols;
}

export default function App() {
  const columns = splitColumns(NOTES);

  return (
    <div className="page">
      <div className="paper">

        <div className="title">古琴减字谱</div>

        <div className="columns">
          {columns.map((col, i) => (
            <div key={i} className="column">
              {col.map((note, j) => (
                <div key={j} className="cell">
                  {note.top && <div className="top">{note.top}</div>}
                  <div className="main">{note.main}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
