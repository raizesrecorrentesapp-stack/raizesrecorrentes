
import React, { useState } from 'react';
import { Mail, Lock, ChevronRight, Loader2, Sparkles, UserCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    // Simula uma autenticação com delay premium para experiência de demo
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0c0c0c] flex flex-col justify-between px-8 py-12 animate-in fade-in duration-700">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-[#C69372]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[10%] left-[-20%] w-[250px] h-[250px] bg-[#C69372]/5 rounded-full blur-[100px]"></div>

      <div className="relative z-10 flex flex-col items-center text-center mt-20">
        {/* Logo removida temporariamente */}
        <h1 className="text-5xl font-black text-white tracking-tighter mb-2 text-center leading-none italic animate-in slide-in-from-top duration-1000">
          Raízes Recorrentes
        </h1>
        <p className="text-[#C69372] text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-60">
          Tecnologia para Trancistas
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto space-y-8">
        <div className="space-y-4 text-center mb-4">
           <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C69372]/10 rounded-full border border-[#C69372]/20">
              <Sparkles size={12} className="text-[#C69372]" />
              <span className="text-[10px] font-black text-[#C69372] uppercase tracking-widest">Acesso Demonstração</span>
           </div>
           <h2 className="text-xl font-bold text-white">Pronta para ver sua evolução?</h2>
           <p className="text-white/30 text-xs">Explore como a IA organiza sua arte e seu lucro.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 opacity-50">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C69372] transition-colors" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail profissional (opcional)" 
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white font-medium outline-none focus:border-[#C69372] focus:bg-white/[0.08] transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <div className="space-y-2 opacity-50">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C69372] transition-colors" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha (opcional)" 
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white font-medium outline-none focus:border-[#C69372] focus:bg-white/[0.08] transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full h-16 bg-[#C69372] text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-2xl shadow-[#C69372]/20 active:scale-[0.97] transition-all disabled:opacity-50 uppercase tracking-widest overflow-hidden relative"
          >
            {isAuthenticating ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <span>Acessar Demo</span>
                <ChevronRight size={20} />
              </>
            )}
            {isAuthenticating && (
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
            Não é necessário cadastro para testar as telas.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 text-white/10">
           <UserCheck size={12} />
           <span className="text-[9px] font-black uppercase tracking-[0.5em]">RAÍZES RECORRENTES V2.5</span>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
