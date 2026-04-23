import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Check,
  Trash2,
  BookOpen,
  Undo,
  Redo,
  Move,
  ArrowLeftRight,
  ArrowUpDown,
  Copy,
  ClipboardPaste
} from 'lucide-react';

// =====================
// 古琴减字谱基础字典
// =====================
const GUQIN_DICT = {
  tone: {
    label: '音别',
    keys: ['散', '泛', '泛起', '泛止']
  },
  lhFinger: {
    label: '左手指序',
    keys: ['大', '食', '中', '名', '跪']
  },
  rhFinger: {
    label: '右手指法',
    keys: ['抹', '挑', '勾', '剔', '打', '摘', '托', '劈', '滚', '拂', '历', '刺', '拨', '轮', '半轮']
  },
  str: {
    label: '弦序',
    keys: ['一', '二', '三', '四', '五', '六', '七']
  },
  hui: {
    label: '徽位',
    keys: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三']
  },
  fen: {
    label: '分位',
    keys: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '半']
  },
  tech: {
    label: '附记',
    keys: ['绰', '注', '吟', '猱', '进复', '退复', '往撞', '反撞', '逗', '唤']
  }
} as const;

// =====================
// 减字谱部件排布规则
// 说明：
// 1. 保守处理，不强造错误异体字
// 2. 右手指法为主体
// 3. 左手、弦位、徽位、分位、附记为辅字
// =====================
const JIANZI_MAP: Record<
  string,
  { char: string; x: number; y: number; scaleX: number; scaleY: number }
> = {
  // 音别
  '散': { char: '散', x: 50, y: 10, scaleX: 0.62, scaleY: 0.62 },
  '泛': { char: '泛', x: 50, y: 10, scaleX: 0.62, scaleY: 0.62 },
  '泛起': { char: '泛起', x: 50, y: 10, scaleX: 0.54, scaleY: 0.54 },
  '泛止': { char: '泛止', x: 50, y: 10, scaleX: 0.54, scaleY: 0.54 },

  // 左手指序
  '大': { char: '大', x: 27, y: 31, scaleX: 0.9, scaleY: 1.1 },
  '食': { char: '食', x: 27, y: 31, scaleX: 0.84, scaleY: 1.06 },
  '中': { char: '中', x: 27, y: 31, scaleX: 0.9, scaleY: 1.08 },
  '名': { char: '名', x: 27, y: 31, scaleX: 0.88, scaleY: 1.05 },
  '跪': { char: '跪', x: 27, y: 31, scaleX: 0.74, scaleY: 0.95 },

  // 右手主字
  '抹': { char: '木', x: 50, y: 52, scaleX: 1.45, scaleY: 1.45 },
  '挑': { char: '挑', x: 50, y: 52, scaleX: 1.08, scaleY: 1.08 },
  '勾': { char: '勹', x: 50, y: 52, scaleX: 1.82, scaleY: 1.82 },
  '剔': { char: '剔', x: 50, y: 52, scaleX: 1.06, scaleY: 1.06 },
  '打': { char: '丁', x: 50, y: 52, scaleX: 1.34, scaleY: 1.34 },
  '摘': { char: '摘', x: 50, y: 52, scaleX: 0.96, scaleY: 0.96 },
  '托': { char: '乇', x: 50, y: 52, scaleX: 1.32, scaleY: 1.32 },
  '劈': { char: '尸', x: 50, y: 52, scaleX: 1.78, scaleY: 1.78 },
  '滚': { char: '滚', x: 50, y: 52, scaleX: 0.96, scaleY: 0.96 },
  '拂': { char: '弗', x: 50, y: 52, scaleX: 1.22, scaleY: 1.22 },
  '历': { char: '厂', x: 50, y: 52, scaleX: 1.78, scaleY: 1.78 },
  '刺': { char: '刺', x: 50, y: 52, scaleX: 0.98, scaleY: 0.98 },
  '拨': { char: '拨', x: 50, y: 52, scaleX: 0.98, scaleY: 0.98 },
  '轮': { char: '轮', x: 50, y: 52, scaleX: 0.98, scaleY: 0.98 },
  '半轮': { char: '半轮', x: 50, y: 52, scaleX: 0.78, scaleY: 0.78 },

  // 弦序
  '一': { char: '一', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },
  '二': { char: '二', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },
  '三': { char: '三', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },
  '四': { char: '四', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },
  '五': { char: '五', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },
  '六': { char: '六', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },
  '七': { char: '七', x: 76, y: 22, scaleX: 0.74, scaleY: 0.74 },

  // 徽位
  '八': { char: '八', x: 84, y: 14, scaleX: 0.48, scaleY: 0.48 },
  '九': { char: '九', x: 84, y: 14, scaleX: 0.48, scaleY: 0.48 },
  '十': { char: '十', x: 84, y: 14, scaleX: 0.48, scaleY: 0.48 },
  '十一': { char: '十一', x: 84, y: 14, scaleX: 0.42, scaleY: 0.42 },
  '十二': { char: '十二', x: 84, y: 14, scaleX: 0.42, scaleY: 0.42 },
  '十三': { char: '十三', x: 84, y: 14, scaleX: 0.42, scaleY: 0.42 },

  // 分位
  '半': { char: '半', x: 84, y: 24, scaleX: 0.48, scaleY: 0.48 },

  // 附记
  '绰': { char: '绰', x: 16, y: 23, scaleX: 0.44, scaleY: 0.44 },
  '注': { char: '注', x: 16, y: 23, scaleX: 0.44, scaleY: 0.44 },
  '吟': { char: '吟', x: 84, y: 82, scaleX: 0.44, scaleY: 0.44 },
  '猱': { char: '猱', x: 84, y: 82, scaleX: 0.44, scaleY: 0.44 },
  '进复': { char: '进复', x: 84, y: 82, scaleX: 0.38, scaleY: 0.38 },
  '退复': { char: '退复', x: 84, y: 82, scaleX: 0.38, scaleY: 0.38 },
  '往撞': { char: '往撞', x: 84, y: 82, scaleX: 0.38, scaleY: 0.38 },
  '反撞': { char: '反撞', x: 84, y: 82, scaleX: 0.38, scaleY: 0.38 },
  '逗': { char: '逗', x: 84, y: 82, scaleX: 0.44, scaleY: 0.44 },
  '唤': { char: '唤', x: 84, y: 82, scaleX: 0.44, scaleY: 0.44 }
};

const COLS = 8;
const ROWS = 14;

type PartData = {
  char: string;
  origin: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

type NoteData = {
  tone: PartData | null;
  lhFinger: PartData | null;
  rhFinger: PartData | null;
  str: PartData | null;
  hui: PartData | null;
  fen: PartData | null;
  tech: PartData | null;
};

const getEmptyGrid = () =>
  Array(COLS)
    .fill(null)
    .map(() => Array(ROWS).fill(null));

const emptyNote: NoteData = {
  tone: null,
  lhFinger: null,
  rhFinger: null,
  str: null,
  hui: null,
  fen: null,
  tech: null
};

// =====================
// 特殊减字显示
// =====================
const CustomJianzi = ({ char }: { char: string }) => {
  if (char.includes('\n')) {
    const parts = char.split('\n');
    return (
      <span className="flex flex-col items-center justify-center leading-none">
        <span style={{ marginBottom: '-0.2em' }}>{parts[0]}</span>
        <span>{parts[1]}</span>
      </span>
    );
  }

  if (char.length > 2) {
    return (
      <span
        className="flex items-center justify-center"
        style={{ letterSpacing: '-0.18em', paddingRight: '0.18em' }}
      >
        {char}
      </span>
    );
  }

  return <span>{char}</span>;
};

// =====================
// 单个减字渲染
// =====================
const JianziRenderer = ({
  note,
  size = 'normal',
  isPlaceholder = false,
  onPartPointerDown,
  onResizeStart,
  activeEditCat
}: {
  note: NoteData | null;
  size?: 'small' | 'normal' | 'large';
  isPlaceholder?: boolean;
  onPartPointerDown?: (e: React.PointerEvent, cat: keyof NoteData) => void;
  onResizeStart?: (e: React.PointerEvent, cat: keyof NoteData, corner: string) => void;
  activeEditCat?: keyof NoteData | null;
}) => {
  if (!note && !isPlaceholder) return null;

  const n = note || emptyNote;
  const isEmpty =
    !n.tone &&
    !n.lhFinger &&
    !n.rhFinger &&
    !n.str &&
    !n.hui &&
    !n.fen &&
    !n.tech;

  if (isEmpty && !isPlaceholder) return null;

  const sizeClasses = {
    small: 'w-6 h-8 text-[20px]',
    normal: 'w-11 h-14 text-[34px]',
    large: 'w-52 h-64 text-[118px]'
  };

  if (isPlaceholder && isEmpty) {
    return (
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        <div className="absolute inset-0 border border-dashed border-stone-400/40 rounded-md flex items-center justify-center">
          <span className="text-stone-400 text-[12px] font-sans tracking-wide">拼字区</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses[size]} font-ancient ink-bleed select-none`}>
      {(Object.entries(n) as [keyof NoteData, PartData | null][]).map(([cat, partData]) => {
        if (!partData) return null;
        const isActive = isPlaceholder && activeEditCat === cat;

        return (
          <div
            key={cat}
            onPointerDown={(e) => onPartPointerDown?.(e, cat)}
            className={`absolute flex items-center justify-center leading-none transform -translate-x-1/2 -translate-y-1/2
              ${isPlaceholder ? 'cursor-grab active:cursor-grabbing hover:text-emerald-800' : 'text-[#27160f]'}
              ${isActive ? 'text-emerald-800 z-50' : 'z-10'}
            `}
            style={{
              left: `${partData.x}%`,
              top: `${partData.y}%`,
              transform: `translate(-50%, -50%) scale(${partData.scaleX}, ${partData.scaleY})`,
              touchAction: 'none'
            }}
          >
            <CustomJianzi char={partData.char} />

            {isActive && (
              <div className="absolute inset-0 border border-emerald-600/70 border-dashed pointer-events-none">
                {['nw', 'ne', 'sw', 'se'].map((corner) => {
                  const invX = 1 / Math.max(0.1, partData.scaleX);
                  const invY = 1 / Math.max(0.1, partData.scaleY);
                  const top = corner.includes('n') ? '0%' : '100%';
                  const left = corner.includes('w') ? '0%' : '100%';
                  const cursor =
                    corner === 'nw' || corner === 'se' ? 'nwse-resize' : 'nesw-resize';

                  return (
                    <div
                      key={corner}
                      onPointerDown={(e) => onResizeStart?.(e, cat, corner)}
                      className="absolute bg-white border border-emerald-700 rounded-full pointer-events-auto shadow-sm"
                      style={{
                        top,
                        left,
                        width: '14px',
                        height: '14px',
                        marginLeft: '-7px',
                        marginTop: '-7px',
                        cursor,
                        transform: `scale(${invX}, ${invY})`
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [grid, setGrid] = useState<(NoteData | null)[][]>(getEmptyGrid());
  const [activeCell, setActiveCell] = useState({ col: 0, row: 0 });
  const [activeTab, setActiveTab] = useState<'all' | keyof typeof GUQIN_DICT>('all');

  const [history, setHistory] = useState<(NoteData | null)[][][]>([getEmptyGrid()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [clipboardNote, setClipboardNote] = useState<NoteData | null>(null);

  const [currentNote, setCurrentNote] = useState<NoteData>({ ...emptyNote });

  const [activeEditCat, setActiveEditCat] = useState<keyof NoteData | null>(null);
  const [draggingCat, setDraggingCat] = useState<keyof NoteData | null>(null);
  const [resizing, setResizing] = useState<{
    cat: keyof NoteData;
    corner: string;
    startX: number;
    startY: number;
    initScaleX: number;
    initScaleY: number;
  } | null>(null);

  const [dragTarget, setDragTarget] = useState<{ col: number; row: number } | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const updateGrid = useCallback(
    (newGrid: (NoteData | null)[][]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newGrid);
      if (newHistory.length > 50) newHistory.shift();

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setGrid(newGrid);
    },
    [history, historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevGrid = history[newIndex];
      setGrid(prevGrid);
      const note = prevGrid[activeCell.col][activeCell.row];
      setCurrentNote(note ? JSON.parse(JSON.stringify(note)) : { ...emptyNote });
    }
  }, [history, historyIndex, activeCell]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextGrid = history[newIndex];
      setGrid(nextGrid);
      const note = nextGrid[activeCell.col][activeCell.row];
      setCurrentNote(note ? JSON.parse(JSON.stringify(note)) : { ...emptyNote });
    }
  }, [history, historyIndex, activeCell]);

  const handleCopy = useCallback(() => {
    const noteToCopy = grid[activeCell.col][activeCell.row];
    if (noteToCopy) setClipboardNote(JSON.parse(JSON.stringify(noteToCopy)));
  }, [grid, activeCell]);

  const handlePaste = useCallback(() => {
    if (clipboardNote) {
      const newGrid = grid.map((col) => [...col]);
      newGrid[activeCell.col][activeCell.row] = JSON.parse(JSON.stringify(clipboardNote));
      updateGrid(newGrid);
      setCurrentNote(JSON.parse(JSON.stringify(clipboardNote)));
      setActiveEditCat(null);
    }
  }, [clipboardNote, grid, activeCell, updateGrid]);

  const handleCellClick = (colIdx: number, rowIdx: number) => {
    setActiveCell({ col: colIdx, row: rowIdx });
    if (grid[colIdx][rowIdx]) {
      setCurrentNote(JSON.parse(JSON.stringify(grid[colIdx][rowIdx])));
      setActiveEditCat(null);
    } else {
      setCurrentNote({ ...emptyNote });
      setActiveEditCat(null);
    }
  };

  const handleInputPart = useCallback(
    (char: string, category: keyof NoteData) => {
      setCurrentNote((prev) => {
        const isCurrent = prev[category]?.origin === char || prev[category]?.char === char;
        if (isCurrent) return { ...prev, [category]: null };

        let x = 50;
        let y = 50;
        let scaleX = 1;
        let scaleY = 1;
        let actualChar = char;

        if (JIANZI_MAP[char]) {
          const t = JIANZI_MAP[char];
          actualChar = t.char;
          x = t.x;
          y = t.y;
          scaleX = t.scaleX;
          scaleY = t.scaleY;
        }

        if (category === 'str') {
          const isEncloseRh =
            prev.rhFinger && ['勹', '尸', '厂'].includes(prev.rhFinger.char);
          if (isEncloseRh) {
            x = 50;
            y = 56;
            scaleX = 0.78;
            scaleY = 0.78;
          } else {
            x = 76;
            y = 22;
            scaleX = 0.74;
            scaleY = 0.74;
          }
        } else if (category === 'hui') {
          x = 84;
          y = 14;
          scaleX = 0.48;
          scaleY = 0.48;
        } else if (category === 'fen') {
          x = 84;
          y = 24;
          scaleX = 0.48;
          scaleY = 0.48;
        } else if (category === 'tone') {
          x = 50;
          y = 10;
          scaleX = 0.62;
          scaleY = 0.62;
        } else if (category === 'lhFinger') {
          x = 27;
          y = 31;
          scaleX = 0.9;
          scaleY = 1.1;
        } else if (category === 'rhFinger') {
          x = 50;
          y = 52;
          scaleX = 1.25;
          scaleY = 1.25;
        } else if (category === 'tech') {
          x = 84;
          y = 82;
          scaleX = 0.44;
          scaleY = 0.44;
        }

        return {
          ...prev,
          [category]: {
            char: actualChar,
            origin: char,
            x,
            y,
            scaleX,
            scaleY
          }
        };
      });

      setActiveEditCat(category);
    },
    []
  );

  const handleConfirm = useCallback(() => {
    const newGrid = grid.map((col) => [...col]);
    newGrid[activeCell.col][activeCell.row] = Object.values(currentNote).some((v) => v !== null)
      ? JSON.parse(JSON.stringify(currentNote))
      : null;
    updateGrid(newGrid);

    let nextRow = activeCell.row + 1;
    let nextCol = activeCell.col;
    if (nextRow >= ROWS) {
      nextRow = 0;
      nextCol = activeCell.col + 1;
    }

    if (nextCol < COLS) {
      setActiveCell({ col: nextCol, row: nextRow });
      setCurrentNote(
        newGrid[nextCol][nextRow]
          ? JSON.parse(JSON.stringify(newGrid[nextCol][nextRow]))
          : { ...emptyNote }
      );
      setActiveEditCat(null);
    }
  }, [activeCell, currentNote, grid, updateGrid]);

  const handlePointerDown = (e: React.PointerEvent, cat: keyof NoteData) => {
    e.stopPropagation();
    setDraggingCat(cat);
    setActiveEditCat(cat);
  };

  const handleResizeStart = (
    e: React.PointerEvent,
    cat: keyof NoteData,
    corner: string
  ) => {
    e.stopPropagation();
    const part = currentNote[cat];
    if (!part) return;

    setResizing({
      cat,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      initScaleX: part.scaleX,
      initScaleY: part.scaleY
    });
    setActiveEditCat(cat);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (resizing && previewRef.current) {
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;
      const sensitivity = 0.008;

      let dScaleX = 0;
      let dScaleY = 0;

      if (resizing.corner.includes('w')) dScaleX = -dx * sensitivity;
      if (resizing.corner.includes('e')) dScaleX = dx * sensitivity;
      if (resizing.corner.includes('n')) dScaleY = -dy * sensitivity;
      if (resizing.corner.includes('s')) dScaleY = dy * sensitivity;

      setCurrentNote((prev) => ({
        ...prev,
        [resizing.cat]: prev[resizing.cat]
          ? {
              ...prev[resizing.cat]!,
              scaleX: Math.max(0.2, resizing.initScaleX + dScaleX),
              scaleY: Math.max(0.2, resizing.initScaleY + dScaleY)
            }
          : null
      }));
      return;
    }

    if (!draggingCat || !previewRef.current || !currentNote[draggingCat]) return;

    const rect = previewRef.current.getBoundingClientRect();
    let px = ((e.clientX - rect.left) / rect.width) * 100;
    let py = ((e.clientY - rect.top) / rect.height) * 100;

    px = Math.max(0, Math.min(100, px));
    py = Math.max(0, Math.min(100, py));

    setCurrentNote((prev) => ({
      ...prev,
      [draggingCat]: prev[draggingCat]
        ? { ...prev[draggingCat]!, x: px, y: py }
        : null
    }));
  };

  const handlePointerUp = () => {
    setDraggingCat(null);
    setResizing(null);
  };

  const handleScaleChange = (type: 'x' | 'y', value: string | number) => {
    if (!activeEditCat || !currentNote[activeEditCat]) return;

    setCurrentNote((prev) => {
      const part = prev[activeEditCat];
      if (!part) return prev;
      return {
        ...prev,
        [activeEditCat]: {
          ...part,
          [type === 'x' ? 'scaleX' : 'scaleY']: parseFloat(String(value))
        }
      };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      const isCmd =
        navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? e.metaKey : e.ctrlKey;
      const numMap: Record<string, string> = {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
        '7': '七'
      };

      if (isCmd) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) handleRedo();
          else handleUndo();
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleCopy();
        } else if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          handlePaste();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === 'Backspace') {
        if (Object.values(currentNote).some((v) => v !== null)) {
          setCurrentNote({ ...emptyNote });
          setActiveEditCat(null);
        } else {
          let prevRow = activeCell.row - 1;
          let prevCol = activeCell.col;
          if (prevRow < 0) {
            prevRow = ROWS - 1;
            prevCol -= 1;
          }
          if (prevCol >= 0) {
            const newGrid = grid.map((col) => [...col]);
            newGrid[prevCol][prevRow] = null;
            updateGrid(newGrid);
            setActiveCell({ col: prevCol, row: prevRow });
          }
        }
      } else if (numMap[e.key]) {
        handleInputPart(numMap[e.key], 'str');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleConfirm,
    activeCell,
    currentNote,
    grid,
    handleInputPart,
    handleUndo,
    handleRedo,
    handleCopy,
    handlePaste,
    updateGrid
  ]);

  return (
    <div className="flex h-screen w-full bg-[#2a211d] overflow-hidden selection:bg-emerald-900 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC&display=swap');

        .font-ancient {
          font-family:
            'LXGW WenKai TC',
            'ZCOOL XiaoWei',
            'Kaiti SC',
            'STKaiti',
            'KaiTi',
            '楷体',
            'BiauKai',
            serif;
        }

        .ink-bleed {
          text-shadow:
            0.4px 0.4px 0 rgba(0,0,0,0.22),
            0 0 1px rgba(0,0,0,0.22),
            0 0 4px rgba(70,30,10,0.14);
        }

        .paper-noise {
          background-image:
            radial-gradient(rgba(70,40,20,0.06) 0.7px, transparent 0.7px),
            radial-gradient(rgba(70,40,20,0.03) 0.8px, transparent 0.8px);
          background-size: 3px 3px, 6px 6px;
        }
      `}</style>

      {/* 左侧：古谱画布 */}
      <div className="w-[62%] h-full p-6 flex flex-col items-center justify-center relative bg-[#2b211d]">
        <div className="w-full max-w-[900px] flex justify-between items-end mb-3 px-2">
          <div className="text-stone-300/80 flex items-center gap-2">
            <BookOpen size={18} />
            <span className="text-sm tracking-[0.2em] font-serif">古琴减字谱打谱页</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-stone-800/90 rounded-md border border-stone-700 overflow-hidden">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="撤销"
                className="p-2 text-stone-300 hover:bg-stone-700 hover:text-white disabled:opacity-30 transition-colors"
              >
                <Undo size={16} />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                title="重做"
                className="p-2 text-stone-300 hover:bg-stone-700 hover:text-white disabled:opacity-30 transition-colors border-l border-stone-700"
              >
                <Redo size={16} />
              </button>
            </div>

            <div className="flex bg-stone-800/90 rounded-md border border-stone-700 overflow-hidden ml-2">
              <button
                onClick={handleCopy}
                title="复制"
                className="p-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors flex items-center gap-1"
              >
                <Copy size={14} />
                <span className="text-xs">复制</span>
              </button>
              <button
                onClick={handlePaste}
                disabled={!clipboardNote}
                title="粘贴"
                className="p-2 text-stone-300 hover:bg-stone-700 hover:text-white disabled:opacity-30 transition-colors border-l border-stone-700 flex items-center gap-1"
              >
                <ClipboardPaste size={14} />
                <span className="text-xs">粘贴</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className="relative w-full max-w-[860px] bg-[#e6d6bd] rounded-sm overflow-hidden paper-noise"
          style={{
            aspectRatio: '210 / 297',
            boxShadow:
              '0 18px 40px rgba(0,0,0,0.35), inset 0 0 40px rgba(90,50,20,0.10)'
          }}
        >
          {/* 外墨框 */}
          <div className="absolute inset-[18px] border border-[#3f2419]/65 pointer-events-none z-10" />

          {/* 内朱界 */}
          <div className="absolute inset-[34px] border border-[#8b3b24]/40 pointer-events-none z-10" />

          {/* 题签 */}
          <div className="absolute top-[38px] right-[40px] bottom-[38px] w-[58px] border border-[#9b4a2a]/45 z-20 flex flex-col items-center justify-between py-6 text-[#2b1711]">
            <div className="font-ancient text-[18px] writing-mode-vertical tracking-[0.2em]">流水</div>
            <div className="font-ancient text-[14px] writing-mode-vertical opacity-80 tracking-[0.15em]">
              古琴减字谱
            </div>
            <div className="font-ancient text-[14px] writing-mode-vertical opacity-80 tracking-[0.15em]">
              正调
            </div>
          </div>

          {/* 画芯 */}
          <div className="absolute left-[34px] top-[34px] bottom-[34px] right-[108px] z-20 flex flex-row-reverse">
            {grid.map((col, cIdx) => (
              <div
                key={cIdx}
                className="relative flex flex-col h-full border-l border-[#9b4a2a]/22 last:border-l-0"
                style={{ width: `${100 / COLS}%` }}
              >
                {/* 列头 */}
                <div className="absolute top-[4px] left-0 right-0 text-center text-[#8b3b24]/80 text-[12px] font-ancient tracking-[0.15em]">
                  {cIdx + 1}
                </div>

                {col.map((note, rIdx) => {
                  const isActive = activeCell.col === cIdx && activeCell.row === rIdx;
                  const isDragOver = dragTarget?.col === cIdx && dragTarget?.row === rIdx;

                  return (
                    <div
                      key={rIdx}
                      onClick={() => handleCellClick(cIdx, rIdx)}
                      draggable={!!note}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'text/plain',
                          JSON.stringify({ source: 'grid', col: cIdx, row: rIdx, note })
                        );
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDragEnter={() => setDragTarget({ col: cIdx, row: rIdx })}
                      onDragLeave={() => setDragTarget(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragTarget(null);
                        try {
                          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                          const newGrid = grid.map((c) => [...c]);
                          if (data.source === 'grid') {
                            newGrid[data.col][data.row] = null;
                            newGrid[cIdx][rIdx] = data.note;
                            updateGrid(newGrid);
                            setActiveCell({ col: cIdx, row: rIdx });
                            setCurrentNote(JSON.parse(JSON.stringify(data.note)));
                            setActiveEditCat(null);
                          } else if (data.source === 'preview') {
                            newGrid[cIdx][rIdx] = data.note;
                            updateGrid(newGrid);
                            setActiveCell({ col: cIdx, row: rIdx });
                          }
                        } catch {
                          //
                        }
                      }}
                      className={`flex-1 flex justify-center items-center cursor-pointer transition-all duration-150 relative
                        ${isDragOver ? 'bg-emerald-900/10' : ''}
                      `}
                      style={{ height: `${100 / ROWS}%` }}
                    >
                      <div className="pointer-events-none">
                        <JianziRenderer note={note} size="normal" />
                      </div>

                      {isActive && (
                        <div className="absolute inset-[2px] border border-[#8b3b24]/45 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 页脚印记 */}
          <div className="absolute left-[46px] bottom-[40px] text-[#8b3b24]/70 font-ancient text-[14px]">
            琴谱第一页
          </div>
        </div>
      </div>

      {/* 右侧操作台 */}
      <div className="w-[38%] h-full bg-[#f5f0e8] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.35)] z-30 relative">
        <div className="h-[44%] border-b border-stone-300 bg-[#faf8f3] p-4 flex flex-col relative overflow-hidden shadow-sm">
          <h2 className="text-stone-600 text-sm font-bold tracking-widest mb-2 uppercase flex items-center justify-between relative z-10">
            <span className="flex items-center gap-2">
              <Move size={16} /> 拼字微调
            </span>
            <span className="text-xs font-normal text-stone-400 bg-stone-100 px-2 py-1 rounded">
              选部件后可拖拽与缩放
            </span>
          </h2>

          <div className="flex-1 flex gap-4 relative z-10 h-full overflow-hidden">
            <div
              ref={previewRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-56 h-full bg-[#f6f1e7] border border-stone-300 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden"
            >
              {Object.values(currentNote).some((v) => v !== null) && (
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'text/plain',
                      JSON.stringify({ source: 'preview', note: currentNote })
                    );
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute top-2 left-2 px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded shadow border border-emerald-200 cursor-grab active:cursor-grabbing flex items-center gap-1 text-xs z-50 transition-colors select-none"
                >
                  <Move size={12} /> 拖拽上纸
                </div>
              )}

              <JianziRenderer
                note={currentNote}
                size="large"
                isPlaceholder={true}
                onPartPointerDown={handlePointerDown}
                onResizeStart={handleResizeStart}
                activeEditCat={activeEditCat}
              />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex flex-wrap gap-1 mb-2 shrink-0">
                {(Object.entries(GUQIN_DICT) as [keyof typeof GUQIN_DICT, (typeof GUQIN_DICT)[keyof typeof GUQIN_DICT]][]).map(
                  ([cat, data]) => {
                    const part = currentNote[cat as keyof NoteData];
                    return (
                      <div
                        key={cat}
                        onClick={() => setActiveEditCat(cat as keyof NoteData)}
                        className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors flex items-center gap-1
                        ${
                          activeEditCat === cat
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : part
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-50 text-stone-400 border-stone-200'
                        }`}
                      >
                        {data.label}: {part ? (part.origin || part.char) : '-'}
                      </div>
                    );
                  }
                )}
              </div>

              <div className="flex-1 bg-stone-50 border border-stone-200 rounded-lg p-3 flex flex-col overflow-y-auto min-h-0">
                {activeEditCat && currentNote[activeEditCat] ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200 shrink-0">
                      <span className="font-bold text-stone-700 flex items-center gap-2">
                        正在编辑:
                        <span className="text-xl text-emerald-700">
                          {currentNote[activeEditCat]?.origin || currentNote[activeEditCat]?.char}
                        </span>
                      </span>
                      <button
                        onClick={() =>
                          setCurrentNote((p) => ({ ...p, [activeEditCat]: null }))
                        }
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex flex-col gap-1.5 text-sm text-stone-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ArrowLeftRight size={14} /> 宽度比例
                          </span>
                          <span className="text-xs font-mono bg-white px-1 border rounded">
                            {currentNote[activeEditCat]?.scaleX.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="3"
                          step="0.05"
                          value={currentNote[activeEditCat]?.scaleX || 1}
                          onChange={(e) => handleScaleChange('x', e.target.value)}
                          className="w-full accent-emerald-700 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 text-sm text-stone-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ArrowUpDown size={14} /> 高度比例
                          </span>
                          <span className="text-xs font-mono bg-white px-1 border rounded">
                            {currentNote[activeEditCat]?.scaleY.toFixed(2)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="3"
                          step="0.05"
                          value={currentNote[activeEditCat]?.scaleY || 1}
                          onChange={(e) => handleScaleChange('y', e.target.value)}
                          className="w-full accent-emerald-700 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            handleScaleChange('x', 1);
                            handleScaleChange('y', 1);
                          }}
                          className="text-[11px] text-stone-500 hover:text-emerald-700 border border-stone-200 bg-white hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                        >
                          还原比例
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-stone-400 text-sm text-center h-full flex items-center justify-center">
                    请先在下方选择减字部件
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-2 shrink-0">
                <button
                  onClick={() => {
                    setCurrentNote({ ...emptyNote });
                    setActiveEditCat(null);
                  }}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded border border-stone-300 text-sm"
                >
                  清空台面
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-[2] py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded shadow-lg font-bold flex items-center justify-center gap-1"
                >
                  <Check size={18} /> 落字
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[56%] flex flex-col bg-stone-100">
          <div className="flex border-b border-stone-300 bg-stone-200/50 px-4 pt-2 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-700'
                  : 'text-stone-500 hover:bg-stone-200'
              }`}
            >
              全部
            </button>
            {(Object.entries(GUQIN_DICT) as [keyof typeof GUQIN_DICT, (typeof GUQIN_DICT)[keyof typeof GUQIN_DICT]][]).map(
              ([cat, data]) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
                    activeTab === cat
                      ? 'bg-white text-emerald-700'
                      : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {data.label}
                </button>
              )
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {(Object.entries(GUQIN_DICT) as [keyof typeof GUQIN_DICT, (typeof GUQIN_DICT)[keyof typeof GUQIN_DICT]][]).map(
              ([cat, data]) => {
                if (activeTab !== 'all' && activeTab !== cat) return null;

                return (
                  <div key={cat} className="mb-6 last:mb-0">
                    <h3 className="text-stone-500 text-xs font-bold tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-1 h-3 bg-emerald-600 rounded-full"></span>
                      {data.label}
                    </h3>
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                      {data.keys.map((key) => {
                        const currentPart = currentNote[cat as keyof NoteData];
                        const isSelected =
                          currentPart?.origin === key || currentPart?.char === key;
                        const displayChar = JIANZI_MAP[key] ? JIANZI_MAP[key].char : key;
                        const showSubLabel = displayChar !== key;

                        return (
                          <button
                            key={key}
                            onClick={() => handleInputPart(key, cat as keyof NoteData)}
                            className={`relative aspect-square rounded border transition-all flex flex-col items-center justify-center active:scale-95
                              ${
                                isSelected
                                  ? 'bg-emerald-700 text-white border-emerald-800'
                                  : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-white'
                              }`}
                          >
                            <span
                              className={`font-ancient ink-bleed flex flex-col items-center justify-center leading-none ${
                                showSubLabel ? 'text-xl mt-1' : 'text-2xl'
                              }`}
                            >
                              <CustomJianzi char={displayChar} />
                            </span>
                            {showSubLabel && (
                              <span className="text-[10px] opacity-55 leading-none mt-1 font-sans">
                                {key}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
