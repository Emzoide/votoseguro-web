import Link from "next/link";
import { CountdownElecciones } from "@/components/CountdownElecciones";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLUMNAS = [
  {
    num: "1", titulo: "Fórmula Presidencial", icon: "🏛️",
    desc: "Presidente + 2 Vicepresidentes. Marca con aspa dentro del recuadro del partido.",
    prefs: "Sin preferencial",
    color: "bg-red-50 border-red-200 hover:border-red-400 hover:shadow-md",
    numColor: "bg-red-700",
  },
  {
    num: "2", titulo: "Senadores Nacionales", icon: "🗳️",
    desc: "Elegidos a nivel nacional. Puedes marcar hasta 2 candidatos preferidos.",
    prefs: "Hasta 2 preferenciales",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-md",
    numColor: "bg-blue-700",
  },
  {
    num: "3", titulo: "Senadores Regionales", icon: "📍",
    desc: "Representan tu departamento en el Senado. Solo 1 preferencial.",
    prefs: "Hasta 1 preferencial",
    color: "bg-green-50 border-green-200 hover:border-green-400 hover:shadow-md",
    numColor: "bg-green-700",
  },
  {
    num: "4", titulo: "Diputados", icon: "🏛️",
    desc: "Cámara de Diputados de tu región. El preferencial define el orden dentro de la lista.",
    prefs: "Hasta 2 preferenciales",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400 hover:shadow-md",
    numColor: "bg-purple-700",
  },
  {
    num: "5", titulo: "Parlamento Andino", icon: "🌎",
    desc: "Representación del Perú ante la Comunidad Andina de Naciones.",
    prefs: "Hasta 2 preferenciales",
    color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400 hover:shadow-md",
    numColor: "bg-yellow-600",
  },
];

const PREFERENCIAL_INFO = [
  {
    icon: "✅", titulo: "Es opcional",
    desc: "No estás obligado a marcar un preferencial. Puedes votar solo por el partido y tu voto sigue siendo válido.",
    color: "border-green-200 hover:border-green-400",
  },
  {
    icon: "🔢", titulo: "Escribe el número",
    desc: "Anota el número de posición del candidato preferido. El número debe estar dentro del espacio designado en la cédula.",
    color: "border-blue-200 hover:border-blue-400",
  },
  {
    icon: "📊", titulo: "Reordena la lista",
    desc: "Los preferenciales reordenan a los candidatos dentro de su partido. No compiten con candidatos de otros partidos.",
    color: "border-purple-200 hover:border-purple-400",
  },
];

const VOTO_NULO = [
  "Usas palomita ✓, círculo u otro símbolo diferente a aspa o cruz",
  "La intersección del aspa cae fuera del recuadro del partido",
  "Marcas más preferenciales de los permitidos",
  "Repites el mismo número preferencial",
  "Escribes frases, dibujos o realizas tachaduras",
  "Marcas preferenciales de dos partidos distintos en una columna",
];

const VOTO_VALIDO = [
  "Marcas con aspa (✗) o cruz (+) dentro del recuadro",
  "La intersección de las líneas está dentro del recuadro",
  "El voto cruzado está permitido (partidos distintos por columna)",
  "Un nulo en una columna NO invalida las demás",
  "Votar en blanco es válido (pero no se cuenta para nadie)",
  "Puedes no votar en una columna sin anular las demás",
];

export default function HomePage() {
  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative bg-gradient-to-br from-voto-rojo via-red-800 to-slate-900 text-white overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 pt-14 pb-12">
          {/* Bandera + título oficial */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-9 rounded overflow-hidden shadow-lg border border-white/20">
                <div className="w-1/3 bg-red-500" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-red-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-red-200 uppercase tracking-widest font-semibold">República del Perú</div>
                <div className="text-sm font-black text-white leading-tight">ONPE · JNE · 2026</div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            Aprende a votar
            <br />
            <span className="text-voto-amarillo">correctamente</span>
          </h1>

          <p className="text-base sm:text-lg text-red-100 mb-8 max-w-xl mx-auto leading-relaxed">
            Simula tu cédula de sufragio con los <strong className="text-white">candidatos reales</strong> del JNE.
            Practica las 5 columnas y llega preparado el día de las elecciones.
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <p className="text-xs text-red-200 uppercase tracking-widest font-semibold mb-2">
              Faltan para las elecciones
            </p>
            <CountdownElecciones />
            <p className="text-xs text-red-200/80 mt-2 font-medium">
              Domingo 12 de abril de 2026 · 8:00 AM – 4:00 PM
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-voto-amarillo hover:bg-yellow-300 text-gray-900 font-bold text-base sm:text-lg px-8 sm:px-10 py-6 shadow-xl">
              <Link href="/simulador" className="gap-2">
                <span className="text-xl">🗳️</span>
                Simular mi voto ahora
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/60 text-white hover:bg-white hover:text-red-800 font-bold text-base py-6 px-8 bg-transparent">
              <a href="#como-funciona">
                ¿Cómo funciona?
              </a>
            </Button>
          </div>

          {/* Stats — glassmorphism */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-sm mx-auto">
            {[
              { value: "5", label: "columnas\nen la cédula" },
              { value: "9,061", label: "candidatos\nreales JNE" },
              { value: "100%", label: "gratuito\ny educativo" },
            ].map((s) => (
              <div key={s.value} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl py-3 border border-white/10">
                <div className="text-2xl font-black text-voto-amarillo">{s.value}</div>
                <div className="text-[10px] text-red-200 mt-0.5 leading-tight whitespace-pre-line">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Franja decorativa inferior */}
        <div className="h-1 bg-gradient-to-r from-voto-amarillo via-yellow-300 to-voto-amarillo" />
      </section>

      {/* ─── Aviso urgente ─── */}
      <AnimateOnScroll animation="fade-in">
        <section className="bg-amber-50 border-b border-amber-200 py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-center">
            <span className="text-amber-600 text-lg shrink-0">⚠️</span>
            <p className="text-xs sm:text-sm text-amber-800 font-medium">
              En las últimas elecciones, <strong>más del 18% de votos fueron nulos o en blanco</strong>.
              Practica ahora y evita anular tu voto.
            </p>
          </div>
        </section>
      </AnimateOnScroll>

      {/* ─── Las 5 columnas ─── */}
      <section id="como-funciona" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 uppercase tracking-wider mb-3 hover:bg-red-100">
                Guía electoral 2026
              </Badge>
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Las 5 columnas de tu cédula
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                En las Elecciones Generales 2026 votarás por hasta 5 cargos distintos en una sola cédula.
                Puedes elegir partidos diferentes en cada columna (<strong>voto cruzado</strong>).
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COLUMNAS.map((col, i) => (
              <AnimateOnScroll key={col.num} animation="fade-up" delay={i * 100}>
                <Card className={`border-2 transition-all ${col.color} h-full`}>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-7 h-7 ${col.numColor} text-white rounded-full flex items-center justify-center font-black text-xs shrink-0`}>
                        {col.num}
                      </div>
                      <span className="text-lg">{col.icon}</span>
                    </div>
                    <CardTitle className="text-sm">{col.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{col.desc}</p>
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {col.prefs}
                    </Badge>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Voto preferencial ─── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 uppercase tracking-wider mb-3 hover:bg-yellow-100">
                Voto preferencial
              </Badge>
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                ¿Cómo funciona el voto preferencial?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                Además de elegir tu partido, puedes impulsar a un candidato específico dentro de esa lista.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREFERENCIAL_INFO.map((item, i) => (
              <AnimateOnScroll key={item.titulo} animation="fade-up" delay={i * 150}>
                <Card className={`border-2 transition-all hover:shadow-md h-full ${item.color}`}>
                  <CardContent className="pt-6 px-6 pb-6">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.titulo}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Votos nulos ─── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 uppercase tracking-wider mb-3 hover:bg-red-100">
                Evita el voto nulo
              </Badge>
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                ¿Cuándo se anula tu voto?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                En las últimas elecciones, más del 18% de votos fueron nulos o blancos. Aprende a evitarlo.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <AnimateOnScroll animation="fade-left">
              <Card className="border-red-200 border-2 bg-red-50 h-full">
                <CardContent className="pt-5 px-5 pb-5">
                  <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-base">
                    <span className="text-xl">❌</span> Tu voto es NULO si:
                  </h3>
                  <ul className="space-y-2">
                    {VOTO_NULO.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-red-500 shrink-0 mt-0.5 font-bold">✗</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-right">
              <Card className="border-green-200 border-2 bg-green-50 h-full">
                <CardContent className="pt-5 px-5 pb-5">
                  <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-base">
                    <span className="text-xl">✅</span> Tu voto es VÁLIDO si:
                  </h3>
                  <ul className="space-y-2">
                    {VOTO_VALIDO.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 shrink-0 mt-0.5 font-bold">✓</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── CTA Final ─── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-red-900 to-voto-rojo text-white py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <AnimateOnScroll animation="scale-up">
          <div className="relative max-w-2xl mx-auto">
            <div className="text-5xl mb-5">🗳️</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              ¿Listo para practicar tu voto?
            </h2>
            <p className="text-red-100 mb-8 text-base sm:text-lg leading-relaxed">
              Usa nuestro simulador con los candidatos reales del JNE y llega preparado
              el <strong className="text-voto-amarillo">12 de abril de 2026</strong>.
            </p>
            <Button asChild size="lg" className="bg-voto-amarillo hover:bg-yellow-300 text-gray-900 font-bold text-base sm:text-lg px-8 sm:px-10 py-6 shadow-xl">
              <Link href="/simulador" className="gap-2">
                <span className="text-xl">🗳️</span>
                Ir al simulador de cédula
              </Link>
            </Button>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Badge variant="outline" className="text-red-200 border-red-200/30 text-xs">Gratuito</Badge>
              <Badge variant="outline" className="text-red-200 border-red-200/30 text-xs">Sin registro</Badge>
              <Badge variant="outline" className="text-red-200 border-red-200/30 text-xs">Datos reales JNE</Badge>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
