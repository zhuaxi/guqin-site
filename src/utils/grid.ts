import type { LogicalPosition } from "../types/editor";

export const GRID = {
  leftPadding: 90,
  topPadding: 90,
  colWidth: 78,
  rowHeight: 118,
};

export function logicalToPixel(position: LogicalPosition) {
  return {
    x: GRID.leftPadding + position.col * GRID.colWidth,
    y: GRID.topPadding + position.row * GRID.rowHeight,
  };
}

export function pixelToLogical(x: number, y: number): LogicalPosition {
  const col = Math.max(0, Math.round((x - GRID.leftPadding) / GRID.colWidth));
  const row = Math.max(0, Math.round((y - GRID.topPadding) / GRID.rowHeight));
  return { row, col };
}
