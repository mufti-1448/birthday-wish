"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BirthdayClient() {
  const searchParams = useSearchParams();
  const fromName = searchParams.get("from") || "Seseorang";
  const charSlug = searchParams.get("char") || null;

  const [stage, setStage] = useState("welcome"); // welcome | game | greeting | greeting-open | reply
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState("");
  const [muted, setMuted] = useState(false);
  const bgRef = useRef(null);
  const sfxClickRef = useRef(null);
  const sfxOpenRef = useRef(null);
  const sfxSendRef = useRef(null);

  // sample icons for cards (8 pairs -> 16 cards)
  const icons = ["🎈", "🎂", "🎁", "🎉", "🕯️", "🍭", "🎊", "🍩"];

  useEffect(() => {
    if (stage === "game") initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initGame() {
    const doubled = icons
      .concat(icons)
      .map((icon, idx) => ({ id: idx + "-" + icon, icon }));
    setCards(shuffle(doubled));
    setFlipped([]);
    setMatched([]);
    setBusy(false);
  }

  function handleCardClick(index) {
    if (busy) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    // play click sound
    try {
      if (sfxClickRef.current && !muted) {
        sfxClickRef.current.currentTime = 0;
        sfxClickRef.current.play().catch(() => {});
      }
    } catch (e) {}

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped;
      const cardA = cards[a];
      const cardB = cards[b];
      if (cardA.icon === cardB.icon) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
        // if finished
        if (matched.length + 2 >= cards.length) {
          // play celebrate/open sound
          try {
            if (sfxOpenRef.current && !muted) {
              sfxOpenRef.current.currentTime = 0;
              sfxOpenRef.current.play().catch(() => {});
            }
            if (bgRef.current && !muted) {
              bgRef.current.currentTime = 0;
              bgRef.current.play().catch(() => {});
            }
          } catch (e) {}
          setTimeout(() => setStage("greeting"), 700);
        }
      } else {
        setBusy(true);
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 700);
      }
    }
    // fallback: if last pair matched
    if (cards.length > 0 && matched.length + 1 >= cards.length) {
      setTimeout(() => setStage("greeting"), 700);
    }
  }

  function openReply() {
    setStage("reply");
  }

  function sendWA() {
    const msg = reply.trim() || `Makasih banyak ya ${fromName} ❤️✨`;
    // play send sfx then open WA
    try {
      if (sfxSendRef.current && !muted) {
        sfxSendRef.current.currentTime = 0;
        sfxSendRef.current.play().catch(() => {});
      }
    } catch (e) {}
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-yellow-100 to-purple-400 text-gray-900 relative p-6 overflow-hidden">
      <style>{`
        /* Card flip */
        .card-outer{perspective:1000px}
        .card-inner{transition:transform .55s cubic-bezier(.2,.8,.2,1);transform-style:preserve-3d}
        .card-face{backface-visibility:hidden;border-radius:12px}
        .card-front{background:linear-gradient(180deg,#fde68a,#fb923c);}
        .card-back{transform:rotateY(180deg);background:white}
        .flipped .card-inner{transform:rotateY(180deg)}

        /* subtle bounce for CTA */
        @keyframes pulseFast{0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)}}
        .cta-pulse{animation:pulseFast 1.6s ease-in-out infinite}

        /* balloon float */
        @keyframes floatUp{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
        .balloon{animation:floatUp 3.5s ease-in-out infinite}

        /* confetti */
        @keyframes confettiFall{0%{transform:translateY(-30vh) rotate(0)}100%{transform:translateY(120vh) rotate(540deg)}}
        .conf{position:absolute;width:10px;height:14px;opacity:0.95;top:-30vh;animation:confettiFall 4s linear forwards}

        /* greeting open transition */
        .card-enter{opacity:0;transform:translateY(12px) scale(.98)}
        .card-enter-active{opacity:1;transform:translateY(0) scale(1);transition:all .45s ease}

        @media (max-width:640px){.card-inner{height:72px}}
      `}</style>

      {/* audio elements (put sound files in public/sounds/) */}
      <audio ref={bgRef} loop preload="auto">
        <source src="/music/birthday.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sfxClickRef} preload="auto">
        <source src="/sounds/click.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sfxOpenRef} preload="auto">
        <source src="/sounds/open.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sfxSendRef} preload="auto">
        <source src="/sounds/send.mp3" type="audio/mpeg" />
      </audio>

      {/* decorative balloons */}
      <div className="pointer-events-none absolute left-6 top-6 space-y-2">
        <div className="balloon transform -translate-x-2">🎈</div>
        <div className="balloon transform translate-x-2">🎈</div>
      </div>

      {/* subtle background shapes for depth */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#fff7ed" />
              <stop offset="1" stopColor="#fbe7ff" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g1)" />
        </svg>
      </div>

      {stage === "welcome" && (
        <div className="text-center max-w-2xl bg-white/70 backdrop-blur rounded-2xl p-10 shadow-lg">
          <div className="mb-4 flex justify-center items-end">
            {charSlug ? (
              <img
                src={`/character/${charSlug}.gif`}
                alt={charSlug}
                className="w-36 h-36 object-contain pointer-events-none"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src.includes("/character/")) {
                    e.currentTarget.src = `/characters/${charSlug}.gif`;
                  } else {
                    e.currentTarget.style.display = "none";
                  }
                }}
                aria-hidden="true"
              />
            ) : (
              <div className="text-6xl">🎈</div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            🎉 Selamat Ulang Tahun!
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Ada kejutan seru nih, siap main?
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setStage("game");
                // try to play click/open sound on start
                try {
                  if (sfxOpenRef.current && !muted) {
                    sfxOpenRef.current.currentTime = 0;
                    sfxOpenRef.current.play().catch(() => {});
                  }
                  if (bgRef.current && !muted) {
                    bgRef.current.currentTime = 0;
                    bgRef.current.play().catch(() => {});
                  }
                } catch (e) {}
              }}
              className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg shadow hover:scale-105 transition"
            >
              🎁 Mulai Kejutan
            </button>
            <button
              onClick={() => {
                setMuted((m) => {
                  const next = !m;
                  try {
                    if (bgRef.current) {
                      if (next) bgRef.current.pause();
                      else bgRef.current.play().catch(() => {});
                    }
                  } catch (e) {}
                  return next;
                });
              }}
              className="bg-white/80 text-pink-600 px-4 py-2 rounded-full text-sm shadow"
              aria-pressed={!muted}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      )}

      {stage === "game" && (
        <div className="w-full max-w-3xl bg-white/80 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Mini-Game: Temukan Pasangannya
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {cards.map((c, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(idx);
              return (
                <div
                  key={c.id}
                  className={`card-outer ${isFlipped ? "flipped" : ""}`}
                  onClick={() => handleCardClick(idx)}
                >
                  <div className="card-inner relative w-full h-28 bg-transparent">
                    <div className="card-face card-front absolute inset-0 flex items-center justify-center rounded-lg shadow-lg text-xl">
                      <div className="text-2xl">❓</div>
                    </div>
                    <div className="card-face card-back absolute inset-0 flex items-center justify-center rounded-lg shadow-lg text-4xl card-back">
                      {c.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={initGame}
              className="bg-yellow-400 px-4 py-2 rounded-full shadow"
            >
              Reset Game
            </button>
          </div>
        </div>
      )}

      {stage === "greeting" && (
        <div className="max-w-2xl bg-white/90 p-8 rounded-2xl shadow-lg text-center relative overflow-hidden">
          <div className="mb-4">
            <h2 className="text-3xl font-bold">🎂 Happy Birthday!</h2>
            <p className="mt-2 opacity-90">Klik "Ya" untuk buka ucapannya.</p>
          </div>
          <div className="space-x-4">
            <button
              disabled
              className="px-6 py-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              Tidak
            </button>
            <button
              onClick={() => {
                try {
                  if (sfxOpenRef.current && !muted) {
                    sfxOpenRef.current.currentTime = 0;
                    sfxOpenRef.current.play().catch(() => {});
                  }
                  if (bgRef.current && !muted) {
                    bgRef.current.currentTime = 0;
                    bgRef.current.play().catch(() => {});
                  }
                } catch (e) {}
                setStage("greeting-open");
              }}
              className="px-6 py-2 rounded-full bg-pink-500 text-white"
            >
              Ya
            </button>
          </div>
        </div>
      )}

      {stage === "greeting-open" && (
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-lg text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="conf"
                style={{
                  left: `${(i * 7) % 100}%`,
                  background: [`#F472B6`, `#FBBF24`, `#60A5FA`, `#34D399`][
                    i % 4
                  ],
                  animationDelay: `${(i % 6) * 0.12}s`,
                }}
              />
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-3xl font-bold">Surprise!</h2>
          </div>
          <div className="bg-pink-50 p-6 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed">
              Semoga di umur yang baru ini, kamu sehat, bahagia, dan selalu
              dikelilingi orang yang sayang.
            </p>
            <p className="mt-4 font-semibold">
              Ucapan ini dari <span className="text-pink-600">{fromName}</span>{" "}
              🤍
            </p>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={openReply}
              className="bg-green-500 text-white px-5 py-2 rounded-full"
            >
              💌 Balas Ucapan
            </button>
            <button
              onClick={() => {
                const msg = `Makasih banyak ya ${fromName} ❤️✨`;
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(msg)}`,
                  "_blank",
                );
              }}
              className="bg-gray-200 px-5 py-2 rounded-full"
            >
              Kirim Terima Kasih
            </button>
          </div>

          {/* show character in greeting if available */}
          {charSlug && (
            <div className="mt-6 flex justify-center">
              <img
                src={`/character/${charSlug}.gif`}
                alt={charSlug}
                className="w-40 h-40 object-contain"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src.includes("/character/")) {
                    e.currentTarget.src = `/characters/${charSlug}.gif`;
                  } else {
                    e.currentTarget.style.display = "none";
                  }
                }}
                aria-hidden="false"
              />
            </div>
          )}
        </div>
      )}

      {stage === "reply" && (
        <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Balas Ucapan</h3>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Tulis pesan untuk ${fromName}...`}
            className="w-full p-3 rounded-md border"
            rows={4}
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setStage("greeting-open")}
              className="px-4 py-2 rounded-full bg-gray-200"
            >
              Batal
            </button>
            <button
              onClick={sendWA}
              disabled={!reply.trim()}
              className={`px-4 py-2 rounded-full ${reply.trim() ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
