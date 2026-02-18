import React, { useState } from 'react';
import { Mail, Lock, ChevronRight, Loader2, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { dataService } from '../services/dataService';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      await dataService.signIn(email, password);
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsAuthenticating(false);
    }
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
            <Lock size={12} className="text-[#C69372]" />
            <span className="text-[10px] font-black text-[#C69372] uppercase tracking-widest">Acesso Restrito</span>
          </div>
          <h2 className="text-xl font-bold text-white">Pronta para ver sua evolução?</h2>
          <p className="text-white/30 text-xs">Entre com suas credenciais para gerenciar sua arte e seu lucro.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 animate-in shake duration-300">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-500 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C69372] transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white font-medium outline-none focus:border-[#C69372] focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C69372] transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 text-white font-medium outline-none focus:border-[#C69372] focus:bg-white/[0.08] transition-all placeholder:text-white/20"
                required
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
                <span>Entrar</span>
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
            Acesso exclusivo para profissionais autorizados.
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
