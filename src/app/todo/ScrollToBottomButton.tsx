"use client";
import { Button } from "@/components/ui/button";
import { HiOutlinePlusSm } from "react-icons/hi";
import { cn } from "@/lib/utils";

type ScrollToBottomButtonProps = {
  className?: string;
};

export default function ScrollToBottomButton({
  className,
}: ScrollToBottomButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      className={cn(
        "absolute right-0 sm:top-0 sm:right-6 z-10 data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
        "text-muted-foreground",
        className ?? "",
        "",
        "",
      )}
      onClick={() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }}
    >
      <HiOutlinePlusSm />
    </Button>
  );
}
