import React, { useState, useMemo } from 'react';
import { Show } from '../types';
import { MapPin, Ticket, Zap, X, List, Map as MapIcon, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Realized tour dates and Eventfrog links for Kiko's "Nöd Dä Hellscht" Tour 2026
const shows: Show[] = [
  { id: '1', date: '10.04.26', venue: 'Kino Stüssihof', city: 'Zürich', status: 'available', price: '45 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-zuerich-7415053850250360982.html' },
  { id: '2', date: '11.04.26', venue: 'Kino Stüssihof', city: 'Zürich', status: 'available', price: '45 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-zuerich-7415059045936046291.html' },
  { id: '3', date: '16.04.26', venue: 'Fauteuil', city: 'Basel', status: 'last-chance', price: '42 CHF', ticketUrl: 'https://tickets.fauteuil.ch/webshop/webticket/eventlist?production=115' },
  { id: '4', date: '17.04.26', venue: 'Mood 12', city: 'Amriswil', status: 'available', price: '38 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-amriswil-7410644825186286214.html' },
  { id: '5', date: '18.04.26', venue: 'ROK Klub', city: 'Luzern', status: 'available', price: '40 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-luzern-7411346272320241984.html' },
  { id: '6', date: '21.04.26', venue: 'Oxil', city: 'Zofingen', status: 'available', price: '35 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-zofingen-7420762565083404558.html' },
  { id: '7', date: '24.04.26', venue: "Let's Fetz", city: 'Einsiedeln', status: 'available', price: '35 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-kabarett/kabarett-comedy/kiko-noed-dae-hellscht-7288627885368305891.html' },
  { id: '8', date: '25.04.26', venue: 'Harley Davidson', city: 'Rümlang', status: 'available', price: '45 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-x-harley-davidson-ruemlang-7420767330131544712.html' },
  { id: '9', date: '30.04.26', venue: 'AP Café', city: 'Aadorf', status: 'available', price: '30 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-aadorf-7416516113431810489.html' },
  { id: '15', date: '02.05.26', venue: 'Le Portier', city: 'Bern', status: 'available', price: '40 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-bern-7423271039776342403.html' },
  { id: '10', date: '08.05.26', venue: 'Nordportal', city: 'Baden', status: 'available', price: '45 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-baden-7414989730788426596.html' },
  { id: '16', date: '09.05.26', venue: 'QUARTIER Klub', city: 'Schaffhausen', status: 'available', price: '40 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-schaffhausen-7423269413929920693.html' },
  { id: '11', date: '13.06.26', venue: 'Weid Am Berg', city: 'Heiden', status: 'available', price: '38 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-kabarett/kabarett-comedy/kiko-noed-dae-hellscht-7288627885368305895.html' },
  { id: '12', date: '02.09.26', venue: 'Madlen', city: 'Heerbrugg', status: 'available', price: '40 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-kabarett/kabarett-comedy/kiko-noed-dae-hellscht-7288627885368305896.html' },
  { id: '13', date: '03.09.26', venue: 'Caverno', city: 'Bülach', status: 'available', price: '38 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-7415044026284408384.html' },
  { id: '14', date: '11.09.26', venue: 'Plaza Klub', city: 'Zürich', status: 'last-chance', price: '50 CHF', ticketUrl: 'https://eventfrog.ch/de/p/theater-buehne/comedy-kabarett/kiko-noed-dae-hellscht-zuerich-7420476829704705780.html' },
];

// Refined coordinates for Swiss map visualization
const cityCoords: Record<string, { x: number; y: number }> = {
  'Zürich': { x: 650, y: 175 },
  'Basel': { x: 530, y: 120 },
  'Amriswil': { x: 810, y: 140 },
  'Luzern': { x: 610, y: 260 },
  'Zofingen': { x: 560, y: 220 },
  'Einsiedeln': { x: 690, y: 270 },
  'Rümlang': { x: 640, y: 155 },
  'Aadorf': { x: 730, y: 165 },
  'Baden': { x: 610, y: 160 },
  'Heiden': { x: 850, y: 155 },
  'Heerbrugg': { x: 870, y: 185 },
  'Bülach': { x: 655, y: 135 },
  'Bern': { x: 450, y: 300 },
  'Schaffhausen': { x: 665, y: 95 },
};

const EVENTFROG_LOGO = "https://static.eventfrog.ch/img/branding/eventfrog-logo-pos.svg";
const SPONSOR_LOGO = "https://bonnieandclyde.ch/cdn/shop/files/WhatsApp_Image_2025-12-17_at_21.40.06.jpg?v=1766004594&width=310";

const Shows: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  const filteredShows = useMemo(() => 
    selectedCity ? shows.filter(s => s.city === selectedCity) : [], 
  [selectedCity]);

  const uniqueCities = useMemo(() => Array.from(new Set(shows.map(s => s.city))), []);

  const handleTicketClick = (url: string, venue: string) => {
    setIsRedirecting(venue);
    // Nuclear Launch Sequence
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsRedirecting(null);
    }, 1800);
  };

  return (
    <section id="shows" className="py-20 bg-sky relative overflow-hidden border-t-8 border-jet scroll-mt-32">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-12">
          {/* OFFIZIELLER SPONSORING PARTNER SECTION */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col items-center group"
          >
            <span className="font-display text-xl md:text-3xl text-jet bg-banana px-6 py-2 border-4 border-jet shadow-flyer transform -rotate-1 mb-4 z-10 uppercase tracking-tighter font-black">
              OFFIZIELLER SPONSORING PARTNER
            </span>
            <div className="bg-white p-3 border-4 border-jet shadow-flyer transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
              <img src={SPONSOR_LOGO} alt="Bonnie & Clyde" className="h-20 md:h-28 w-auto object-contain" />
            </div>
          </motion.div>

          <h2 className="text-7xl md:text-9xl font-display text-white mb-6 text-center uppercase tracking-tighter banana-text">
            TOUR <span className="text-vest">TICKETS</span>
          </h2>
          
          <div className="flex bg-jet p-1 border-4 border-jet shadow-flyer transform -rotate-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-2 font-display text-2xl transition-all ${viewMode === 'list' ? 'bg-banana text-jet shadow-sm' : 'text-white hover:text-banana'}`}
            >
              <List size={20} /> LISTE
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-6 py-2 font-display text-2xl transition-all ${viewMode === 'map' ? 'bg-banana text-jet shadow-sm' : 'text-white hover:text-banana'}`}
            >
              <MapIcon size={20} /> KARTE
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {viewMode === 'map' ? (
            <div className="flex flex-col xl:flex-row gap-8 bg-white/10 backdrop-blur-md p-4 md:p-8 border-4 border-jet shadow-flyer rounded-xl">
              <div className="flex-[3] relative bg-jet/90 rounded-lg overflow-hidden min-h-[450px] md:min-h-[600px] border-4 border-jet shadow-inner">
                <svg viewBox="0 0 1000 650" className="w-full h-full drop-shadow-2xl">
                  {/* Abstract Swiss Map Shape */}
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M500,50 L550,60 L600,40 L650,70 L700,55 L750,90 L800,80 L850,110 L900,100 L950,130 L930,180 L960,230 L940,280 L970,330 L930,380 L950,430 L910,480 L930,530 L880,560 L830,540 L780,580 L730,560 L680,600 L630,580 L580,620 L530,600 L480,640 L430,610 L380,630 L330,600 L280,620 L230,590 L180,610 L130,580 L80,600 L50,560 L80,510 L40,460 L70,410 L30,360 L60,310 L20,260 L50,210 L30,160 L80,130 L130,150 L180,120 L230,140 L280,110 L330,130 L380,100 L430,120 L480,90 Z" 
                    className="fill-banana/10 stroke-banana stroke-[8] stroke-linejoin-round"
                  />
                  {uniqueCities.map((city) => {
                    const coords = cityCoords[city] || { x: 500, y: 300 };
                    const isSelected = selectedCity === city;
                    const isHovered = hoveredCity === city;
                    return (
                      <motion.g 
                        key={city}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredCity(city)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => setSelectedCity(city)}
                      >
                        <motion.circle cx={coords.x} cy={coords.y} r="25" fill={isSelected ? '#c62828' : '#f8e434'} animate={{ opacity: isHovered || isSelected ? 0.3 : 0, scale: isHovered || isSelected ? 1.5 : 1 }} />
                        <motion.g animate={isHovered || isSelected ? { y: -10 } : { y: 0 }}>
                          <circle cx={coords.x} cy={coords.y} r="10" className={`${isSelected ? 'fill-vest' : 'fill-banana'} stroke-jet stroke-2`} />
                          <MapPin x={coords.x - 16} y={coords.y - 36} size={32} className={`${isSelected ? 'text-vest' : 'text-banana'} drop-shadow-lg`} fill={isSelected ? 'white' : 'currentColor'} />
                        </motion.g>
                      </motion.g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex-[2] min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  {selectedCity ? (
                    <motion.div key={selectedCity} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white border-4 border-jet shadow-flyer p-6 md:p-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-8 border-b-4 border-jet pb-4">
                        <h3 className="font-display text-7xl text-jet leading-none uppercase">{selectedCity}</h3>
                        <button onClick={() => setSelectedCity(null)} className="p-3 bg-jet text-white hover:bg-vest transition-colors"><X size={24} /></button>
                      </div>
                      <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredShows.map((show) => (
                          <div key={show.id} className="border-4 border-jet p-6 hover:bg-sky/5 transition-all">
                             <div className="flex justify-between items-center mb-3">
                                <span className="font-display text-3xl text-vest">{show.date}</span>
                                <span className="font-display text-2xl text-jet bg-banana px-3 border-2 border-jet">{show.price}</span>
                             </div>
                             <h4 className="font-display text-4xl text-jet mb-4 leading-tight">{show.venue}</h4>
                             <button 
                                onClick={() => handleTicketClick(show.ticketUrl, show.venue)} 
                                className="w-full flex items-center justify-center gap-3 py-4 font-display text-3xl border-4 border-jet shadow-flyer transition-all bg-banana text-jet hover:bg-jet hover:text-white uppercase"
                             >
                                <Ticket size={24} /> TICKETS SICHERN
                             </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white border-4 border-jet shadow-flyer p-12 text-center flex flex-col items-center justify-center h-full">
                      <MapPin size={80} className="text-sky mb-8 animate-bounce" />
                      <h3 className="font-display text-6xl text-jet mb-6 uppercase">STADT WÄHLEN</h3>
                      <p className="font-comic text-xl text-gray-500 italic">"Wähl eine Stadt, bevor ich es mir anders überlege!"</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="bg-white border-8 border-jet shadow-flyer max-w-5xl mx-auto">
               <div className="divide-y-4 divide-jet">
                  {shows.map((show) => (
                    <div key={show.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-banana/10 transition-colors">
                       <div className="flex items-center gap-6">
                          <div className="text-center bg-sky border-4 border-jet p-4 shadow-sm transform -rotate-2 min-w-[100px]">
                             <div className="font-display text-4xl text-white leading-none">{show.date.split('.')[0]}</div>
                             <div className="font-display text-xl text-jet">{show.date.split('.')[1]}</div>
                          </div>
                          <div>
                             <h4 className="font-display text-4xl text-jet uppercase leading-none mb-1">{show.venue}</h4>
                             <p className="font-display text-2xl text-vest uppercase tracking-widest">{show.city}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          {show.status === 'last-chance' && (
                            <span className="hidden lg:block bg-vest text-white px-3 py-1 font-bold text-xs animate-pulse border-2 border-jet rotate-3">FAST AUSVERKAUFT!</span>
                          )}
                          <button 
                            onClick={() => handleTicketClick(show.ticketUrl, show.venue)} 
                            className="bg-jet text-banana px-8 py-4 font-display text-3xl hover:bg-vest hover:text-white transition-all shadow-flyer flex items-center gap-3 uppercase"
                          >
                            <Ticket size={24} /> TICKETS
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Eventfrog Partnership Info */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 px-8 py-4 rounded-full">
                <span className="text-white font-display text-xl uppercase tracking-widest opacity-60">Offizieller Ticket-Partner:</span>
                <img src={EVENTFROG_LOGO} alt="Eventfrog" className="h-8 md:h-10 grayscale brightness-200" />
            </div>
        </div>
      </div>

      {/* High-Energy Redirect Overlay */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-jet/95 backdrop-blur-2xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white border-8 border-jet p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_100px_rgba(248,228,52,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-banana animate-pulse"></div>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-10 text-vest"
              >
                <Zap size={100} fill="currentColor" />
              </motion.div>

              <h3 className="text-5xl md:text-7xl font-display text-jet leading-none mb-6 banana-text uppercase">
                ATOMARER START!
              </h3>
              
              <div className="space-y-6 mb-10">
                <p className="font-comic text-2xl text-jet leading-tight">
                  Du wirst jetzt sicher zu <span className="text-vest font-black underline uppercase">{isRedirecting}</span> auf <span className="text-sky font-black">Eventfrog</span> gebeamt!
                </p>
                
                <div className="flex flex-col items-center gap-2">
                    <img src={EVENTFROG_LOGO} alt="Eventfrog" className="h-8 mx-auto" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Offizieller Checkout</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-jet font-display text-2xl uppercase tracking-[0.2em] bg-banana p-4 border-4 border-jet">
                <Loader2 className="animate-spin" size={32} /> BITTE WARTEN...
              </div>

              <div className="mt-8 flex justify-center opacity-40 grayscale pointer-events-none">
                 <img src="https://kikomedy.com/img/Kiko_Head_001-01-frei_cropped.png" className="w-24 h-24 object-contain" alt="Kiko" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Shows;