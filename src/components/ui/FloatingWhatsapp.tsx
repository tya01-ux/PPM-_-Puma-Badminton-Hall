import Draggable from "react-draggable";
import { useRef } from "react";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsapp() {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className="fixed bottom-16 right-4 z-50"
      >
        <a
          href="https://wa.me/628151867890"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg"
        >
          <MessageCircle size={28} className="text-white" />
        </a>
      </div>
    </Draggable>
  );
}