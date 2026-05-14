import { Card } from "@/components/ui/card";

type TypingPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function TypingPanel({ value, onChange, onKeyDown, onKeyUp }: TypingPanelProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Typing Capture</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Type naturally to profile dwell time, flight time, speed, and rhythm.
        </p>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        rows={6}
        placeholder="Start typing to generate real-time behavioral biometrics..."
        className="w-full resize-none rounded-xl border border-black/10 bg-white p-4 outline-none ring-blue-500 transition focus:ring-2 dark:border-white/20 dark:bg-zinc-950"
      />
    </Card>
  );
}
