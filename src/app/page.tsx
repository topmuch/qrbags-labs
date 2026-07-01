'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

const LandingChatbotWidget = dynamic(
  () => import('@/components/finder/LandingChatbotWidget'),
  { ssr: false, loading: () => null }
);
import TrackingWidget from '@/components/home/TrackingWidget';
import {
  Plane,
  Luggage,
  QrCode,
  Smartphone,
  MapPin,
  MessageCircle,
  Star,
  Menu,
  X,
  Mail,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Play,
  Lock,
  Bell,
  Zap,
  Users,
  Headphones,
  Shield,
  Globe,
  Heart,
  CheckCircle,
  ChevronRight,
  Search,
  Ship,
  Bus,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  BadgeCheck,
  Phone,
  LucideIcon,
} from "lucide-react";

/* ──────────────────────────────────────────────
   Fade-in wrapper (Framer Motion)
   ────────────────────────────────────────────── */
function FadeIn({ children, className, delay = 0, direction = 'up' }: { children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STICKY SEARCH BAR
   ══════════════════════════════════════════════ */
function StickySearchBar() {
  const router = useRouter();
  const [refValue, setRefValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pattern = useMemo(() => /^[A-Z]{2,4}\d{2}-[A-Z0-9]{4,8}$/, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRefValue(val);
    if (val.length === 0) {
      setIsValid(false);
      setError('');
    } else if (pattern.test(val)) {
      setIsValid(true);
      setError('');
    } else {
      setIsValid(false);
      if (val.length >= 7) {
        setError('Format : AB12-XXXX');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      router.push(`/suivi/${refValue}`);
    }
  };

  return (
    <div
      className={`fixed top-16 lg:top-20 left-0 right-0 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-slate-100">
        <div className="max-w-xl mx-auto px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={refValue}
                onChange={handleChange}
                placeholder="Suivre un bagage — ex: AB12-CDEF"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 ${
                  isValid
                    ? 'border-emerald-300 focus:ring-emerald-500/20 text-slate-900'
                    : error
                    ? 'border-red-300 focus:ring-red-500/20 text-slate-900'
                    : 'border-slate-200 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400'
                }`}
                maxLength={13}
              />
              {error && (
                <p className="absolute -bottom-5 left-3.5 text-xs text-red-500 font-medium">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={!isValid}
              className={`rounded-xl px-5 py-2.5 font-semibold text-sm transition-all gap-2 ${
                isValid
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Suivre</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NAVIGATION (Modern Glass)
   ══════════════════════════════════════════════ */
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Solutions', href: '/#solutions' },
    { label: 'Comment ça marche', href: '/#comment' },
    { label: 'Tarifs', href: '/#tarifs' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-slate-100'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center group">
            <img src="/logo.png" alt="QRBag" className="w-9 h-9 object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-all duration-200">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/agence/connexion">
              <Button variant="ghost" className="text-slate-500 hover:text-slate-900 text-sm font-medium hover:bg-slate-100/60">
                Espace Agence
              </Button>
            </Link>
            <Link href="/devenir-partenaire">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-full px-5 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all">
                Devenir Partenaire
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-slate-900 p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-slate-100 bg-white/98 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium py-2.5 px-3 rounded-lg text-base" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              ))}
              <hr className="border-slate-100 my-2" />
              <Link href="/agence/connexion" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-slate-500 justify-start hover:bg-slate-50">Espace Agence</Button>
              </Link>
              <Link href="/devenir-partenaire" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-slate-900 text-white font-medium rounded-full mt-1">
                  Devenir Partenaire
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════
   HERO SECTION (Modern Immersive)
   ══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-qrbags.png"
          alt="Voyageuse scannant un bagage QRBag"
          fill
          className="object-cover scale-105"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '48px 48px',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20">
        <FadeIn>
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 border border-white/15 rounded-full backdrop-blur-xl">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/90 tracking-wide">Protection intelligente pour vos bagages</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
            Un bagage perdu n&apos;est pas{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              une fatalité.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mt-6 leading-relaxed font-light">
            QRBag transforme la perte en opportunité — grâce à la technologie, la confiance, et le respect.
          </p>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link href="/demo">
              <Button className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-semibold text-base shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-[1.02] transition-all duration-300 gap-2.5">
                <Play className="w-4 h-4" />
                Découvrir la démo
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base backdrop-blur-sm transition-all duration-300 gap-2.5">
                Commander maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="flex flex-wrap justify-center gap-3 mt-14">
            {[
              { icon: Smartphone, text: 'Sans application' },
              { icon: Zap, text: 'Sans batterie' },
              { icon: MapPin, text: 'Géolocalisé en temps réel' },
              { icon: Lock, text: 'Sécurisé RGPD' },
            ].map((item, idx) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.07] border border-white/10 rounded-full backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
              >
                <item.icon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-white/70">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Bottom gradient fade into white */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent" />
    </section>
  );
}

/* ══════════════════════════════════════════════
   QRBag EN ACTION SECTION
   ══════════════════════════════════════════════ */
function QRBagEnActionSection() {
  const features = [
    'Scan instantané du QR code',
    'Notification WhatsApp en temps réel',
    'Géolocalisation précise du bagage',
    'Interface intuitive sans application',
  ];

  return (
    <section className="py-24 lg:py-32 px-4 bg-white" id="comment">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - QR Code Image */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-[2rem] blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
                <Image
                  src="/images/landing-v2/qrcode-reel.jpg"
                  alt="QR Code QRBag apposé sur un bagage"
                  width={1024}
                  height={1024}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating stat badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                98% de récupération
              </motion.div>
            </div>
          </FadeIn>

          {/* Right - Content */}
          <FadeIn direction="left" delay={0.2}>
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
                <Sparkles className="w-4 h-4" />
                QRBag en action
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Scannez, activez,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">voyagez.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Notre technologie QR code brevetée permet à n&apos;importe qui de signaler un bagage trouvé en un seul geste. Vous recevez instantanément une notification avec la localisation exacte de votre valise.
              </p>

              <div className="space-y-3.5">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-medium text-[15px]">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-4">
                <Link href="/demo">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all gap-2">
                    <Play className="w-4 h-4" />
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   TRANSPORT MODES SECTION
   ══════════════════════════════════════════════ */
function TransportModesSection() {
  const modes = [
    {
      title: 'Avion',
      description: 'Protégez vos bagages en soute et cabine lors de vos vols internationaux et domestiques.',
      image: '/images/landing-v2/transport-avion.jpg',
      stat: '15M+ passagers/an',
      icon: Plane,
    },
    {
      title: 'Train',
      description: 'Voyagez serein en TGV, Eurostar ou trains régionaux avec une protection continue.',
      image: '/images/landing-v2/transport-train.jpg',
      stat: '4.5M voyageurs/jour',
      icon: Zap,
    },
    {
      title: 'Bateau',
      description: 'Croisières et ferrys — QRBag protège vos bagages sur tous les mers du monde.',
      image: '/images/landing-v2/transport-bateau.jpg',
      stat: '30M croisiéristes',
      icon: Ship,
    },
    {
      title: 'Bus',
      description: 'Bus intercity et autocars — ne perdez plus jamais vos bagages en voyage.',
      image: '/images/landing-v2/transport-bus.jpg',
      stat: '200K trajets/jour',
      icon: Bus,
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-4 bg-slate-50/80">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
            <Globe className="w-4 h-4" />
            Tous les modes de transport
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Une protection pour tous vos voyages
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Avion, train, bateau, bus — QRBag vous suit partout.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modes.map((mode, i) => (
            <FadeIn key={mode.title} delay={i * 0.1}>
              <div className="group h-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1.5">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={mode.image}
                    alt={mode.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Icon */}
                  <div className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                    <mode.icon className="w-4 h-4 text-slate-700" />
                  </div>
                  {/* Stat badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {mode.stat}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{mode.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{mode.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   POURQUOI QRBAG
   ══════════════════════════════════════════════ */
function WhyQRBagSection() {
  const cards = [
    {
      icon: Globe,
      title: 'Ancré en Afrique, pensé pour le monde',
      description: 'Né à Dakar, déployé dans 15 pays. QRBag comprend les réalités du voyage africain et international avec une solution adaptée à chaque contexte.',
    },
    {
      icon: Shield,
      title: 'Sécurité certifiée RGPD',
      description: 'Zéro donnée sensible stockée publiquement. Vos informations personnelles sont chiffrées et protégées selon les normes européennes les plus strictes.',
    },
    {
      icon: Heart,
      title: 'Pour les pèlerins, les voyageurs, les agences',
      description: "Hajj, Omra, tourisme, affaires — une seule solution qui s'adapte à chaque voyageur. Plus de 10 000 bagages déjà protégés à travers le monde.",
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
            <BadgeCheck className="w-4 h-4" />
            Pourquoi QRBag
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight leading-[1.1]">
            La confiance, au-delà<br className="hidden sm:block" /> des frontières
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Une technologie conçue avec soin pour servir les voyageurs les plus exigeants.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.12}>
              <div className="group relative h-full bg-slate-50/80 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  <card.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   SOLUTIONS
   ══════════════════════════════════════════════ */
function SolutionsSection() {
  const solutions = [
    {
      title: 'Hajj & Omra',
      description: 'Protection complète pour les pèlerins avec 3 bagages inclus (cabine + 2 soutes). Gérée par votre agence de voyage partenaire.',
      icon: Shield,
      href: '/hajj-omra',
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
    },
    {
      title: 'Voyageurs Standard',
      description: 'Protection flexible pour tous vos voyages. Choisissez 1 ou 3 bagages avec une durée adaptée à vos besoins.',
      icon: Plane,
      href: '/voyageurs-standard',
      color: 'from-blue-500 to-indigo-500',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Devenir Partenaire',
      description: 'Agences de voyage, compagnies aériennes, hôtels — proposez QRBag à vos clients et générez des revenus complémentaires.',
      icon: Users,
      href: '/devenir-partenaire',
      color: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50',
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-4 bg-slate-50/80" id="solutions">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
            <Luggage className="w-4 h-4" />
            Nos solutions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Une solution pour chaque voyageur
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Que vous soyez pèlerin ou voyageur, QRBag s&apos;adapte à vos besoins avec des solutions sur mesure.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((sol, i) => (
            <FadeIn key={sol.title} delay={i * 0.12}>
              <Link href={sol.href} className="group block h-full">
                <div className="relative h-full bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
                  {/* Gradient accent top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sol.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className={`w-12 h-12 rounded-2xl ${sol.bgLight} flex items-center justify-center mb-6`}>
                    <sol.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{sol.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{sol.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    En savoir plus
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   STATS SECTION
   ══════════════════════════════════════════════ */
function StatsSection() {
  const stats = [
    { value: '10 000+', label: 'Bagages protégés' },
    { value: '15', label: 'Pays couverts' },
    { value: '98%', label: 'Taux de récupération' },
    { value: '24/7', label: 'Disponibilité' },
  ];

  return (
    <section className="py-20 lg:py-24 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   COMMENT ÇA MARCHE
   ══════════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: QrCode,
      title: 'Activez votre QR',
      description: 'Collez l\'autocollant QRBag sur votre bagage et scannez-le pour l\'activer en 30 secondes.',
    },
    {
      step: '02',
      icon: Plane,
      title: 'Voyagez serein',
      description: 'Profitez de votre voyage. Votre bagage est désormais protégé et traçable en temps réel.',
    },
    {
      step: '03',
      icon: MessageCircle,
      title: 'Soyez notifié',
      description: 'Si quelqu\'un trouve votre bagage, vous recevez instantanément une notification WhatsApp avec sa localisation.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
            <Zap className="w-4 h-4" />
            Comment ça marche
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Simple comme 1-2-3
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Trois étapes pour protéger vos bagages et voyager l&apos;esprit tranquille.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />

          {steps.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.15}>
              <div className="text-center relative">
                {/* Step number */}
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto relative z-10">
                    <step.icon className="w-7 h-7 text-slate-700" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center z-20">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   TESTIMONIALS
   ══════════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Fatou Diallo',
      role: 'Pèlerine Hajj 2025',
      content: "Grâce à QRBag, j'ai retrouvé ma valise à Djeddah en moins de 2 heures. Une invention géniale qui devrait être obligatoire pour tous les pèlerins.",
      avatar: 'FD',
      rating: 5,
    },
    {
      name: 'Marc Dupont',
      role: 'Voyageur fréquent',
      content: "Simple, efficace et pas cher. J'ai utilisé QRBag pour tous mes voyages cette année. Plus de stress à l'aéroport, enfin !",
      avatar: 'MD',
      rating: 5,
    },
    {
      name: 'Amina Benali',
      role: 'Directrice agence de voyage',
      content: "Nous avons adopté QRBag pour tous nos pèlerins. Le taux de perte de bagages a chuté de 90%. Nos clients sont ravis.",
      avatar: 'AB',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-4 bg-slate-50/80">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
            <Star className="w-4 h-4" />
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Ils nous font confiance
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.12}>
              <div className="h-full bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-lg hover:shadow-slate-200/30 transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-[15px] leading-relaxed mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PRICING SECTION
   ══════════════════════════════════════════════ */
function PricingSection() {
  const plans = [
    {
      name: 'Solo',
      price: '5',
      period: '/an',
      description: 'Idéal pour un voyage ponctuel',
      features: ['1 bagage protégé', 'Activation en 30 secondes', 'Notifications WhatsApp', 'Géolocalisation temps réel'],
      popular: false,
      href: '/voyageurs-standard',
    },
    {
      name: 'Famille',
      price: '12',
      period: '/an',
      description: 'Pour les familles ou voyageurs fréquents',
      features: ['3 bagages protégés', 'Activation en 30 secondes', 'Notifications WhatsApp', 'Géolocalisation temps réel', 'Support prioritaire'],
      popular: true,
      href: '/voyageurs-standard',
    },
    {
      name: 'Hajj & Omra',
      price: '15',
      period: '/pèlerin',
      description: 'Protection complète pour les pèlerins',
      features: ['3 bagages inclus', 'Géré par votre agence', 'Notifications WhatsApp', 'Support 24/7 dédié', 'Couverture internationale'],
      popular: false,
      href: '/hajj-omra',
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-4 bg-white" id="tarifs">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-600 mb-4">
            <Luggage className="w-4 h-4" />
            Tarifs
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Protégez vos bagages à partir de 5€
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Des prix simples et transparents. Pas de frais cachés.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.12}>
              <div className={`relative h-full rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-[1.02] border-0'
                  : 'bg-white border border-slate-200 hover:shadow-xl hover:shadow-slate-200/40'
              }`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Populaire
                  </span>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold tracking-tight ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.price}€</span>
                  <span className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-blue-400' : 'text-emerald-500'}`} />
                      <span className={plan.popular ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                  }`}>
                    Choisir {plan.name}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FINAL CTA SECTION
   ══════════════════════════════════════════════ */
function FinalCTASection() {
  return (
    <section className="py-24 lg:py-32 px-4 bg-slate-900 relative overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeIn>
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-blue-400 mb-4">
            <Sparkles className="w-4 h-4" />
            Prêt à voyager serein ?
          </span>
        </FadeIn>
        <FadeIn delay={0.15}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Rejoignez 10 000+ voyageurs qui protègent leurs bagages
          </h2>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Activation en 30 secondes, tranquillité pour tous vos voyages.
          </p>
        </FadeIn>
        <FadeIn delay={0.45}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-semibold text-base shadow-2xl shadow-black/30 hover:scale-[1.02] transition-all duration-300 gap-2">
                Commander maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/devenir-partenaire">
              <Button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base backdrop-blur-sm transition-all duration-300">
                Devenir partenaire
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   CONTACT CTA
   ══════════════════════════════════════════════ */
function ContactCTASection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Besoin d&apos;aide ?</h3>
                <p className="text-sm text-slate-500">Notre équipe est disponible 24/7 pour vous accompagner.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/contact">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold text-sm shadow-lg shadow-slate-900/10 gap-2">
                  <Mail className="w-4 h-4" />
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════ */
function Footer() {
  const columns = [
    {
      title: 'Produit',
      links: [
        { label: 'Solutions', href: '/#solutions' },
        { label: 'Comment ça marche', href: '/#comment' },
        { label: 'Tarifs', href: '/#tarifs' },
        { label: 'Démo', href: '/demo' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '/a-propos' },
        { label: 'Partenaires', href: '/devenir-partenaire' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'Mentions légales', href: '/mentions-legales' },
        { label: 'Confidentialité', href: '/confidentialite' },
        { label: 'CGU', href: '/cgu' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'Email', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src="/logo.png" alt="QRBag" className="w-9 h-9 object-contain" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500 mb-6">
              Protection intelligente des bagages pour voyageurs et pèlerins.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, href: 'https://facebook.com/qrbag', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com/qrbag', label: 'Instagram' },
                { icon: Twitter, href: 'https://twitter.com/qrbag', label: 'Twitter' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800/50 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors" aria-label={s.label}>
                  <s.icon className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} QRBag. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-700">
            Fait avec soin à Dakar, pour le monde.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main className="bg-white">
      <Navigation />
      <StickySearchBar />
      <HeroSection />
      <QRBagEnActionSection />
      <TransportModesSection />
      <WhyQRBagSection />
      <SolutionsSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTASection />
      <ContactCTASection />
      <Footer />
      <TrackingWidget />
      <LandingChatbotWidget />
    </main>
  );
}
