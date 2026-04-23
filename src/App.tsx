import "./styles.css";
import { composeJianzi, type QinToneInput } from "./guqinEngine";
import GuqinGlyph from "./GuqinGlyph";

const tones: QinToneInput[] = [
  { soundType: "an", right: "勾", xian: "三", leftFinger: "名", hui: "七", ornament: ["吟"] },
  { soundType: "an", right: "抹", xian: "二", leftFinger: "中", hui: "六" },
  { soundType: "fan", right: "挑", xian: "一", hui: "九" },
  { soundType: "san", right: "剔", xian: "四" },
  { soundType: "an", right: "打", xian: "三", leftFinger: "名", hui: "七", ornament: ["猱"] },
  { soundType: "an", right: "托", xian: "二", leftFinger: "大", hui: "五", ornament: ["绰"] },
  { soundType: "fan", right: "劈", xian: "一", hui: "十" },
  { soundType: "san", right: "勾", xian: "四" },
];

const COLUMN_SIZE = 14;

function splitColumns<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export default function App() {
  const glyphs = tones.map(composeJianzi);
  const columns = splitColumns(glyphs, COLUMN_SIZE);

  return (
    <div className="page">
      <div className="paper">
        <div className="title">古琴减字谱</div>

        <div className="columns">
          {columns.map((col, i) => (
            <div key={i} className="column">
              {col.map((glyph, j) => (
                <div key={j} className="cell">
                  {glyph.parts.map((part, k) => {
                    if (part.slot === "main") {
                      return (
                        <div key={k} className="part main">
                          <GuqinGlyph name={part.text} size={30} />
                        </div>
                      );
                    }

                    return (
                      <div key={k} className={`part ${part.slot}`}>
                        {part.text}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
