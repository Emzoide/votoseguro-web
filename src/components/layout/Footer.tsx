import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-400 mt-auto">
      {/* Franja decorativa superior */}
      <div className="h-1 bg-gradient-to-r from-voto-rojo via-voto-amarillo to-voto-rojo" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Columna 1: Marca */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5 w-4 rounded-sm overflow-hidden border border-white/10">
                <div className="w-1/3 bg-red-600" />
                <div className="w-1/3 bg-white/80" />
                <div className="w-1/3 bg-red-600" />
              </div>
              <p className="text-white font-black text-sm tracking-tight">
                VotoSeguro <span className="text-yellow-400">2026</span>
              </p>
            </div>
            <p className="text-xs leading-relaxed mb-3">
              Plataforma educativa gratuita para prepararte para las
              Elecciones Generales del Perú. Sin fines de lucro.
            </p>
            <Button asChild size="sm" className="bg-voto-amarillo hover:bg-yellow-300 text-gray-900 text-xs font-bold">
              <Link href="/simulador" className="gap-1.5">
                🗳️ Ir al simulador
              </Link>
            </Button>
          </div>

          {/* Columna 2: Aviso legal */}
          <div>
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-2">
              ⚠ Aviso Legal
            </p>
            <p className="text-xs leading-relaxed">
              Este simulador es una herramienta <strong className="text-white">educativa e independiente</strong>.
              No está afiliado a la ONPE, JNE ni a ningún partido político.
              La cédula oficial es emitida exclusivamente por la{" "}
              <a
                href="https://www.onpe.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 underline"
              >
                ONPE
              </a>
              . Los datos de candidatos provienen del portal público del{" "}
              <a
                href="https://portal.jne.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 hover:text-yellow-200 underline"
              >
                JNE
              </a>
              .
            </p>
          </div>

          {/* Columna 3: Info electoral */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">
              Elecciones 2026
            </p>
            <ul className="text-xs space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">📅</span>
                <span>Domingo <strong className="text-white">12 de abril de 2026</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">🕗</span>
                <span>Horario: <strong className="text-white">8:00 AM – 4:00 PM</strong></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">🪪</span>
                <span>Lleva tu DNI vigente el día de las elecciones</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-yellow-400 shrink-0">🏛️</span>
                <span>5 cargos en una sola cédula: Presidente, Senadores, Diputados y Parlamento Andino</span>
              </li>
            </ul>
            <div className="flex gap-2 mt-3">
              <a href="https://www.onpe.gob.pe" target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300/30 hover:bg-white/10 transition-colors cursor-pointer">ONPE</Badge>
              </a>
              <a href="https://portal.jne.gob.pe" target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300/30 hover:bg-white/10 transition-colors cursor-pointer">JNE</Badge>
              </a>
              <a href="https://www.reniec.gob.pe" target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300/30 hover:bg-white/10 transition-colors cursor-pointer">RENIEC</Badge>
              </a>
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
          <p>© {currentYear} VotoSeguro Perú — Educación cívica gratuita</p>
          <p className="text-gray-600">
            Datos referenciales · No reemplaza las instrucciones oficiales de la ONPE
          </p>
        </div>

        {/* Desarrollado por NeuraCode */}
        <div className="border-t border-white/10 mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Desarrollado por</span>
            <a
              href="https://neuracode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-black text-yellow-400 hover:text-yellow-300 transition-colors tracking-tight"
            >
              NeuraCode
            </a>
            <span className="text-[10px] text-gray-500 hidden sm:inline">— Soluciones digitales a medida</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/neuracode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition-colors"
              aria-label="Instagram de NeuraCode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-xs hidden sm:inline">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/neuracode/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Facebook de NeuraCode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs hidden sm:inline">Facebook</span>
            </a>
            <a
              href="https://neuracode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Sitio web de NeuraCode"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-xs hidden sm:inline">neuracode.dev</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
