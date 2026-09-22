import { Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopied(false);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="bg-transparent cursor-pointer transition-transform hover:scale-105"
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>

      {copied && (
        <span className="text-sm text-green-600">
          Copied
        </span>
      )}
    </div>
  );
}