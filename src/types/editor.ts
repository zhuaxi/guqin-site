export type Technique = "勾" | "抹" | "挑" | "托" | "擘";
export type Ornament = "吟" | "猱" | "绰" | "注";
export type ViewMode = "standard" | "teaching" | "art";

export interface LogicalPosition {
  row: number;
  col: number;
}

export interface Note {
  id: string;
  string: number;
  hui: number;
  technique: Technique;
  ornaments: Ornament[];
  duration: number;
  position: LogicalPosition;
}

export interface ToolState {
  technique: Technique;
  string: number;
  hui: number;
  ornaments: Ornament[];
  duration: number;
}
