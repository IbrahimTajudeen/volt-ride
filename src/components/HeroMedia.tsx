import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface Props {
  poster: string;
  videoSrc: string;
  alt: string;
}

/**
 * Hero media: shows poster image, plays video on hover (desktop)
 * and autoplays muted on touch / mobile devices.
 */
export const HeroMedia = ({ poster, videoSrc, alt }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isMobile) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [isMobile]);

  const handleEnter = () => {
    if (isMobile) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  };
  const handleLeave = () => {
    if (isMobile) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-elevated bg-black aspect-[4/3]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img
        src={poster}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${playing ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
      />
      {!isMobile && !playing && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border text-xs font-medium pointer-events-none">
          <Play className="h-3 w-3 fill-primary text-primary" />
          Hover to play
        </div>
      )}
    </div>
  );
};