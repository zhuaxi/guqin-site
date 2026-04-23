import { create } from "zustand";
import type { Note, Ornament, ToolState, ViewMode } from "../types/editor";

interface EditorState {
  notes: Note[];
  selectedIds: string[];
  currentTool: ToolState;
  viewMode: ViewMode;
  playingId: string | null;

  addNote: (note: Note) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteSelected: () => void;
  clearAll: () => void;
  replaceNotes: (notes: Note[]) => void;
  setSelected: (ids: string[]) => void;
  setCurrentTool: (patch: Partial<ToolState>) => void;
  toggleOrnamentOnTool: (ornament: Ornament) => void;
  toggleOrnamentOnSelected: (ornament: Ornament) => void;
  setViewMode: (mode: ViewMode) => void;
  setPlayingId: (id: string | null) => void;
}

const initialTool: ToolState = {
  technique: "勾",
  string: 3,
  hui: 7,
  ornaments: [],
  duration: 1,
};

const seedNotes: Note[] = [
  {
    id: crypto.randomUUID(),
    string: 3,
    hui: 7,
    technique: "勾",
    ornaments: ["吟"],
    duration: 1,
    position: { row: 0, col: 0 },
  },
  {
    id: crypto.randomUUID(),
    string: 4,
    hui: 9,
    technique: "抹",
    ornaments: [],
    duration: 1,
    position: { row: 0, col: 1 },
  },
  {
    id: crypto.randomUUID(),
    string: 2,
    hui: 5,
    technique: "挑",
    ornaments: ["绰"],
    duration: 0.5,
    position: { row: 1, col: 0 },
  },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  notes: seedNotes,
  selectedIds: [],
  currentTool: initialTool,
  viewMode: "standard",
  playingId: null,

  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
      selectedIds: [note.id],
    })),

  updateNote: (id, patch) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...patch } : note
      ),
    })),

  deleteSelected: () =>
    set((state) => ({
      notes: state.notes.filter((note) => !state.selectedIds.includes(note.id)),
      selectedIds: [],
    })),

  clearAll: () => set({ notes: [], selectedIds: [], playingId: null }),

  replaceNotes: (notes) => set({ notes, selectedIds: [], playingId: null }),

  setSelected: (ids) => set({ selectedIds: ids }),

  setCurrentTool: (patch) =>
    set((state) => ({
      currentTool: { ...state.currentTool, ...patch },
    })),

  toggleOrnamentOnTool: (ornament) =>
    set((state) => {
      const exists = state.currentTool.ornaments.includes(ornament);
      return {
        currentTool: {
          ...state.currentTool,
          ornaments: exists
            ? state.currentTool.ornaments.filter((item) => item !== ornament)
            : [...state.currentTool.ornaments, ornament],
        },
      };
    }),

  toggleOrnamentOnSelected: (ornament) => {
    const selectedId = get().selectedIds[0];
    if (!selectedId) return;

    const note = get().notes.find((item) => item.id === selectedId);
    if (!note) return;

    const exists = note.ornaments.includes(ornament);
    const nextOrnaments = exists
      ? note.ornaments.filter((item) => item !== ornament)
      : [...note.ornaments, ornament];

    set((state) => ({
      notes: state.notes.map((item) =>
        item.id === selectedId ? { ...item, ornaments: nextOrnaments } : item
      ),
    }));
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setPlayingId: (id) => set({ playingId: id }),
}));
