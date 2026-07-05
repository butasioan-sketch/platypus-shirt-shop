'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/app/components/Logo';

interface FaqItem { q: string; a: string; }

const FAQS: FaqItem[] = [
  { q: 'Wie funktioniert das Gestalten meines Shirts?', a: 'Auf der Produktseite lädst du dein eigenes Motiv hoch — vorne und/oder hinten. Du kannst es per Maus oder Finger frei verschieben, in der Größe anpassen und zentrieren. Was du im Editor siehst, wird gedruckt.' },
  { q: 'Welche Bildqualität sollte mein Motiv haben?', a: 'Für ein scharfes Druckergebnis empfehlen wir eine hohe Auflösung (mindestens 1500×1500 Pixel). PNG mit transparentem Hintergrund eignet sich am besten. Je größer und schärfer dein Bild, desto besser der Druck.' },
  { q: 'Wie lange dauert die Lieferung?', a: 'Deutschland: 3–5 Werktage (€4.99). Rumänien: 5–7 Werktage (€6.99). Übrige EU: 5–10 Werktage (€8.99). Da jedes Shirt auf Bestellung gedruckt wird, kommt 1 Werktag Produktionszeit hinzu.' },
  { q: 'Kann ich meine Bestellung verfolgen?', a: 'Ja. Nach dem Kauf erhältst du eine Bestellnummer (Format PLT-...). Auf unserer Seite "Sendungsverfolgung" gibst du diese Nummer ein und siehst den aktuellen Status: Bezahlt, In Produktion, Versandt, Zugestellt.' },
  { q: 'Welche Größen gibt es?', a: 'Unsere Shirts sind unisex und in den Größen S, M, L, XL und XXL erhältlich. Du kannst zwischen Regular und Oversized Fit wählen. Im Zweifel: Oversized fällt eine Nummer größer aus.' },
  { q: 'Aus welchem Material sind die Shirts?', a: 'Helles Premium-Polyester, angenehm zu tragen und langlebig. Optimiert für brillanten Sublimationsdruck deiner Motive in fünf hellen Farben.' },
  { q: 'Wie wird gedruckt?', a: 'Wir nutzen ein hochwertiges Druckverfahren für volle Farben und scharfe Details — auch bei komplexen Motiven und Fotos. Der Druck ist waschbeständig bei normaler Pflege (auf links, 30°C).' },
  { q: 'Kann ich umtauschen oder zurückgeben?', a: 'Du hast Qualitätsgarantierecht. Bitte beachte: Individuell gestaltete Shirts mit deinem eigenen Motiv sind von der Rückgabe ausgenommen, sofern kein Produktionsfehler vorliegt. Bei Mängeln melde dich einfach bei uns.' },
  { q: 'Welche Zahlungsmethoden gibt es?', a: 'Die Zahlung läuft sicher über Stripe — Kreditkarte und weitere gängige Methoden. Deine Zahlungsdaten werden verschlüsselt verarbeitet und nicht bei uns gespeichert.' },
  { q: 'Wie erreiche ich den Kundenservice?', a: 'Nutze unseren Chat-Assistenten unten rechts auf jeder Seite — er beantwortet die meisten Fragen sofort. Für individuelle Anliegen kannst du uns über die im Impressum genannten Kontaktdaten erreichen.' },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 500px at 50% -10%, rgba(226,0,26,0.08), transparent 60%), linear-gradient(180deg, #0c0c0d 0%, #0a0a0a 100%)', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ padding: '1.1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={44} />
        <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>← Shop</Link>
      </header>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <p style={{ color: '#e2001a', fontSize: '0.72rem', letterSpacing: '0.22em', marginBottom: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>Hilfe & Antworten</p>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.6rem', color: '#fff', letterSpacing: '-0.02em' }}>Häufige Fragen</h1>
        <p style={{ color: '#999', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Alles Wichtige rund um Gestaltung, Versand und Rückgabe. Findest du keine Antwort? Frag unseren Chat-Assistenten.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#fff', padding: '1.15rem 1.35rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                >
                  <span>{item.q}</span>
                  <span style={{ color: '#e2001a', fontSize: '1.3rem', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.35rem 1.25rem', color: '#aaa', fontSize: '0.9rem', lineHeight: 1.65 }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Noch Fragen?</p>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Unser Assistent hilft dir sofort weiter.</p>
          <Link href="/product/1" style={{ display: 'inline-block', background: '#e2001a', color: '#fff', padding: '0.85rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
            Jetzt gestalten
          </Link>
        </div>
      </div>
    </div>
  );
}
