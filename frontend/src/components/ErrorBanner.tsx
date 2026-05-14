import { useState, useEffect } from "react";

type Props = {
  errors: string[];
};

export default function ErrorBanner({ errors }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 60000); // 60 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [errors]);

  if (!isVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 border border-foreground bg-background-muted text-primary flex justify-between items-center">
      <div>
        {errors.map((err, idx) => (
          <div key={idx} className="text-sm font-semibold">{err}</div>
        ))}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 text-primary hover:text-primary-muted transition-colors font-bold text-lg shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
