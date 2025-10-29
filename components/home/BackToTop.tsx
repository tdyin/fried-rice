import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  show: boolean;
}

export function BackToTop({ show }: BackToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
