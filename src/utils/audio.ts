import type { Note } from "../types/editor";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
}

export function noteToFrequency(note: Note): number {
  const baseByString = [196, 220, 246.94, 261.63, 293.66, 329.63, 392];
  const base = baseByString[Math.max(0, Math.min(6, note.string - 1))];
  const huiOffset = (13 - note.hui) * 12;
  return Math.max(80, Math.min(1200, base + huiOffset));
}

export async function playSequence(
  notes: Note[],
  onHighlight?: (id: string | null) => void
) {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.position.row !== b.position.row) return a.position.row - b.position.row;
    return a.position.col - b.position.col;
  });

  for (const note of sorted) {
    onHighlight?.(note.id);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = noteToFrequency(note);

    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + Math.max(0.18, note.duration * 0.45)
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + Math.max(0.2, note.duration * 0.5));

    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(260, note.duration * 420))
    );
  }

  onHighlight?.(null);
}
