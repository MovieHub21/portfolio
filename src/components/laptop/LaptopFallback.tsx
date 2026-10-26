import LaptopScreen from './LaptopScreen';

interface LaptopFallbackProps {
  scrollProgress?: number;
}

export default function LaptopFallback({ scrollProgress = 0 }: LaptopFallbackProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* CSS Simulated Laptop Chassis */}
      <div className="w-full max-w-2xl bg-[#14151b] rounded-2xl p-3 border border-white/10 shadow-2xl relative">
        {/* Top Camera Dot */}
        <div className="w-2 h-2 rounded-full bg-black/60 border border-white/10 mx-auto mb-2" />

        {/* Screen Bezel & Embedded Editor */}
        <div className="rounded-lg overflow-hidden border border-black/40 shadow-inner bg-[#0c0d12]">
          <div className="scale-[0.82] sm:scale-100 origin-top-left -mr-[18%] sm:mr-0 -mb-[18%] sm:mb-0">
            <LaptopScreen scrollStage={scrollProgress > 0.4 ? 1 : 0} />
          </div>
        </div>

        {/* Laptop Base Lip */}
        <div className="h-2.5 w-1/3 bg-[#242733] rounded-b-md mx-auto mt-2 border-t border-white/5" />
      </div>

      <p className="text-[11px] font-mono text-text-muted mt-3">
        [Interactive Workstation Editor &bull; Terminal active]
      </p>
    </div>
  );
}
