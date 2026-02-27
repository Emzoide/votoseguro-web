import Link from "next/link";
import { CountdownElecciones } from "@/components/CountdownElecciones";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full">
      {/* Barra superior con countdown */}
      <div className="bg-gradient-to-r from-voto-rojo to-red-800 border-b border-red-700 py-1 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-red-100">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Elecciones Generales — Domingo 12 de abril de 2026
          </span>
          <CountdownElecciones compact />
        </div>
      </div>

      {/* Navegación principal — fondo blanco para contraste */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[52px] py-1 gap-2">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 min-h-[44px]"
            >
              {/* Bandera Perú */}
              <div className="flex h-6 w-5 sm:h-7 sm:w-6 rounded-sm overflow-hidden shadow-sm shrink-0 border border-gray-200">
                <div className="w-1/3 bg-voto-rojo" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-voto-rojo" />
              </div>
              <div className="leading-none">
                <span className="font-black text-base sm:text-lg tracking-tight whitespace-nowrap block text-gray-900">
                  VotoSeguro
                  <span className="text-voto-rojo ml-1">2026</span>
                </span>
                <span className="text-[9px] text-gray-400 hidden sm:block">
                  Simulador oficial educativo
                </span>
              </div>
            </Link>

            {/* Navegación */}
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                           text-gray-600 hover:text-voto-rojo hover:bg-red-50 transition-colors min-h-[44px]"
              >
                Inicio
              </Link>
              <Link
                href="/guia"
                className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                           text-gray-600 hover:text-voto-rojo hover:bg-red-50 transition-colors min-h-[44px]"
              >
                Guía
              </Link>
              <Link
                href="/candidatos"
                className="hidden sm:inline-flex items-center px-3 py-2 rounded-md text-sm font-medium
                           text-gray-600 hover:text-voto-rojo hover:bg-red-50 transition-colors min-h-[44px]"
              >
                Candidatos
              </Link>
              <Button asChild className="bg-voto-rojo hover:bg-red-700 text-white font-bold shadow-sm min-h-[44px]">
                <Link href="/simulador" className="gap-1.5 whitespace-nowrap">
                  <span className="text-base leading-none">🗳️</span>
                  <span className="sm:hidden">Simular</span>
                  <span className="hidden sm:inline">Simular mi voto</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
