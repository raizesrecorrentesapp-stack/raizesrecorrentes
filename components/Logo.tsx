
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 64, className = "", showText = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Container que emula a moldura da logo enviada (Squircle com bordas suaves) */}
      <div 
        style={{ width: size, height: size }}
        className="relative overflow-hidden rounded-[22%] shadow-2xl bg-[#1A1F26] flex items-center justify-center border border-white/5"
      >
        <img 
          src="logo.png" 
          alt="Raízes Recorrentes" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Caso a imagem logo.png não exista, mostra um fallback elegante com as cores da marca
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div class="flex flex-col items-center justify-center w-full h-full bg-[#1A1F26]">
                  <span style="color: #C69372; font-weight: 900; font-style: italic; font-size: ${size * 0.4}px;">RR</span>
                </div>
              `;
            }
          }}
        />
      </div>
      
      {showText && (
        <div className="mt-4 text-center animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-2xl font-black text-white tracking-tighter leading-none">
            Raízes<br/><span className="text-[#C69372]">Recorrentes</span>
          </h1>
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mt-2">Professional Tech</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
