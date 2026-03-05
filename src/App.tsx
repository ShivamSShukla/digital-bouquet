import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Heart, Sparkles } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';

type Vibe = 'Romantic' | 'Friendly' | 'Sympathy';

type Flower = {
  id: string;
  name: string;
  meaning: string;
  emoji: string;
  color: string;
};

type BouquetFlower = {
  flowerId: string;
  x: number;
  y: number;
  z: number;
};

type BouquetPayload = {
  recipient: string;
  message: string;
  vibe: Vibe;
  flowers: BouquetFlower[];
};

const FLOWERS: Flower[] = [
  { id: 'rose', name: 'Rose', meaning: 'Deep love and devotion', emoji: '🌹', color: '#f87171' },
  { id: 'peony', name: 'Peony', meaning: 'Prosperity and happy romance', emoji: '🌸', color: '#f9a8d4' },
  { id: 'daisy', name: 'Daisy', meaning: 'Innocence and loyal friendship', emoji: '🌼', color: '#fde68a' },
  { id: 'lily', name: 'Lily', meaning: 'Grace and admiration', emoji: '🪷', color: '#ddd6fe' },
  { id: 'sunflower', name: 'Sunflower', meaning: 'Loyalty and warmth', emoji: '🌻', color: '#facc15' },
  { id: 'tulip', name: 'Tulip', meaning: 'Perfect affection', emoji: '🌷', color: '#f472b6' },
  { id: 'orchid', name: 'Orchid', meaning: 'Refined beauty and strength', emoji: '💮', color: '#c4b5fd' },
  { id: 'dahlia', name: 'Dahlia', meaning: 'Inner strength and elegance', emoji: '🏵️', color: '#fb7185' },
  { id: 'anemone', name: 'Anemone', meaning: 'Protection and anticipation', emoji: '🌺', color: '#93c5fd' },
  { id: 'zinnia', name: 'Zinnia', meaning: 'Enduring affection', emoji: '🪻', color: '#f9a8d4' },
];

const vibeMap: Record<Vibe, string> = {
  Romantic: 'from-pink-100 via-rose-50 to-purple-100',
  Friendly: 'from-yellow-50 via-lime-50 to-sky-100',
  Sympathy: 'from-slate-100 via-blue-50 to-purple-50',
};

const slug = () => `${Math.random().toString(36).slice(2, 6)}-${Date.now().toString(36).slice(-4)}`;

function getStoredBouquet(key: string): BouquetPayload | null {
  const item = localStorage.getItem(`bouquet:${key}`);
  if (!item) return null;
  try {
    return JSON.parse(item) as BouquetPayload;
  } catch {
    return null;
  }
}

function emojiFlower(flower: Flower, size = 44) {
  return (
    <div
      style={{ backgroundColor: `${flower.color}33`, width: size, height: size }}
      className="flex items-center justify-center rounded-full border border-black/10 text-2xl shadow-sm"
      title={`${flower.name}: ${flower.meaning}`}
    >
      {flower.emoji}
    </div>
  );
}

function GiftView({ payload }: { payload: BouquetPayload }) {
  const meanings = payload.flowers
    .map((f) => FLOWERS.find((x) => x.id === f.flowerId))
    .filter((f): f is Flower => Boolean(f));

  return (
    <main className={`min-h-screen bg-gradient-to-b ${vibeMap[payload.vibe]} p-4 text-black`}>
      <div className="mx-auto max-w-md pt-8">
        <Card className="overflow-hidden border-black/10 bg-white/70">
          <CardHeader>
            <h1 className="font-playfair text-center text-3xl">A Digital Bouquet for {payload.recipient || 'You'}</h1>
            <p className="mt-1 text-center text-xs uppercase tracking-[0.2em] text-black/60">with flower meanings</p>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto h-72 w-full max-w-xs rounded-[2.2rem] bg-[#edf5e8]">
              <AnimatePresence>
                {payload.flowers.map((f, i) => {
                  const flower = FLOWERS.find((x) => x.id === f.flowerId);
                  if (!flower) return null;
                  return (
                    <motion.div
                      key={`${f.flowerId}-${i}`}
                      initial={{ opacity: 0, y: 40, scale: 0.6 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                      className="absolute"
                      style={{ left: f.x, top: f.y, zIndex: f.z }}
                    >
                      {emojiFlower(flower, 52)}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div className="absolute bottom-0 left-1/2 h-24 w-52 -translate-x-1/2 rounded-t-[2rem] border border-black/20 bg-white/90" />
            </div>

            <Card className="mt-4 border-dashed border-black/20 bg-white/70">
              <CardContent className="space-y-2 p-4">
                <p className="text-sm leading-relaxed">{payload.message || 'A little bouquet to brighten your day.'}</p>
                <div className="space-y-1 text-xs text-black/70">
                  {meanings.map((f) => (
                    <p key={f.id}>
                      <span className="font-semibold">{f.name}</span>: {f.meaning}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const giftId = params.get('gift');
  const giftPayload = giftId ? getStoredBouquet(giftId) : null;

  const [selected, setSelected] = useState<BouquetFlower[]>([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('This bouquet carries all the words I struggle to say out loud.');
  const [vibe, setVibe] = useState<Vibe>('Romantic');
  const [hovered, setHovered] = useState<Flower | null>(null);
  const [generatedLink, setGeneratedLink] = useState('');

  const selectedMeanings = useMemo(
    () => selected.map((f) => FLOWERS.find((x) => x.id === f.flowerId)).filter((f): f is Flower => Boolean(f)),
    [selected]
  );

  if (giftPayload) return <GiftView payload={giftPayload} />;

  const toggleFlower = (flower: Flower) => {
    const currentlySelected = selected.filter((s) => s.flowerId === flower.id).length;
    if (currentlySelected >= 2) return;

    if (selected.some((s) => s.flowerId === flower.id)) {
      const index = selected.findIndex((s) => s.flowerId === flower.id);
      setSelected((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    setSelected((prev) => [
      ...prev,
      {
        flowerId: flower.id,
        x: 40 + (prev.length % 4) * 52,
        y: 70 + Math.floor(prev.length / 4) * 45,
        z: prev.length + 1,
      },
    ]);
  };

  const randomArrange = () => {
    setSelected((prev) =>
      prev.map((item, i) => ({
        ...item,
        x: 20 + Math.random() * 170,
        y: 45 + Math.random() * 130,
        z: i + 1,
      }))
    );
  };

  const sendBouquet = () => {
    if (!selected.length) return;
    const id = slug();
    const payload: BouquetPayload = { recipient, message, vibe, flowers: selected };
    localStorage.setItem(`bouquet:${id}`, JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}?gift=${id}`;
    setGeneratedLink(url);
  };

  const copy = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
  };

  return (
    <main className={`min-h-screen bg-gradient-to-b ${vibeMap[vibe]} p-4 text-black`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:grid lg:grid-cols-[1.2fr_1fr]">
        <section>
          <div className="mb-4 text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.25em]">
              <Sparkles size={14} /> Digital Bouquet Creator
            </p>
            <h1 className="font-playfair mt-2 text-4xl">Build a bouquet that means something.</h1>
            <p className="mt-1 text-sm text-black/70">Tap to pick flowers (up to two of each) and drag them in your bouquet vase.</p>
          </div>

          <Card className="border-black/10 bg-white/65">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {FLOWERS.map((flower) => {
                  const chosen = selected.some((f) => f.flowerId === flower.id);
                  return (
                    <button
                      key={flower.id}
                      onMouseEnter={() => setHovered(flower)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => toggleFlower(flower)}
                      className={`rounded-2xl border p-3 transition hover:-translate-y-1 ${
                        chosen ? 'border-black bg-white shadow-sm' : 'border-black/10 bg-white/50'
                      }`}
                    >
                      <div className="mx-auto mb-1 w-fit">{emojiFlower(flower)}</div>
                      <p className="text-xs font-semibold">{flower.name}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-white/50 p-3 text-sm">
                <p className="font-semibold">Meaning spotlight</p>
                <p className="text-black/70">{(hovered || selectedMeanings[0])?.meaning || 'Hover any flower to discover its symbolism.'}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Card className="border-black/10 bg-white/65">
            <CardHeader>
              <h2 className="font-playfair text-2xl">Bouquet Builder</h2>
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto h-80 w-72 rounded-[2.2rem] bg-[#ecf4e8]">
                {selected.map((item, i) => {
                  const flower = FLOWERS.find((x) => x.id === item.flowerId);
                  if (!flower) return null;
                  return (
                    <motion.div
                      key={`${item.flowerId}-${i}`}
                      drag
                      dragMomentum={false}
                      onDragEnd={(_, info) => {
                        setSelected((prev) =>
                          prev.map((f, idx) =>
                            idx === i ? { ...f, x: Math.max(0, f.x + info.offset.x), y: Math.max(0, f.y + info.offset.y) } : f
                          )
                        );
                      }}
                      className="absolute cursor-grab active:cursor-grabbing"
                      style={{ left: item.x, top: item.y, zIndex: item.z }}
                    >
                      {emojiFlower(flower, 52)}
                    </motion.div>
                  );
                })}
                <div className="absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2 rounded-t-[2rem] border border-black/20 bg-white/95" />
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={randomArrange}>Auto Arrange</Button>
                <Button variant="ghost" onClick={() => setSelected([])}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10 bg-white/65">
            <CardHeader>
              <h2 className="font-playfair text-2xl">Personalizer</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient Name" />
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Secret Message" />

              <div>
                <p className="mb-1 text-sm font-medium">Vibe</p>
                <div className="flex gap-2">
                  {(['Romantic', 'Friendly', 'Sympathy'] as Vibe[]).map((item) => (
                    <Button key={item} variant={vibe === item ? 'default' : 'outline'} onClick={() => setVibe(item)}>
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={sendBouquet} disabled={!selected.length}>
                <Heart size={16} className="mr-2 inline" /> Send Bouquet
              </Button>

              {generatedLink && (
                <div className="rounded-2xl border border-black/10 bg-white/60 p-3 text-xs">
                  <p className="mb-2 font-semibold">Shareable gift URL:</p>
                  <p className="mb-2 break-all">{generatedLink}</p>
                  <Button variant="outline" onClick={copy}>
                    <Copy size={14} className="mr-2 inline" /> Copy Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
