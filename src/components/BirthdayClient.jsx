"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BirthdayClient() {
  const searchParams = useSearchParams();
  const fromName = searchParams.get("from") || "Seseorang";

  const [stage, setStage] = useState("welcome"); // welcome | game | greeting | greeting-open | reply
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState("");

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
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 to-purple-300 text-gray-900 relative p-6">
      <style>{`
        .card-outer{perspective:800px}
        .card-inner{transition:transform .5s;transform-style:preserve-3d}
        .card-face{backface-visibility:hidden}
        .card-back{transform:rotateY(180deg)}
        .flipped .card-inner{transform:rotateY(180deg)}
        @keyframes floatUp{0%{transform:translateY(0)}100%{transform:translateY(-12px)}}
        .float{animation:floatUp 2s ease-in-out infinite}
        @keyframes fall{0%{transform:translateY(-10vh) rotate(0)}100%{transform:translateY(110vh) rotate(360deg)}}
        .conf{position:absolute;width:10px;height:14px;opacity:0.9;top:-10vh;animation:fall 3s linear forwards}
      `}</style>

      {stage === "welcome" && (
        <div className="text-center max-w-2xl bg-white/70 backdrop-blur rounded-2xl p-10 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            🎉 Selamat Ulang Tahun!
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Ada kejutan seru nih, siap main?
          </p>
          <button
            onClick={() => setStage("game")}
            className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg shadow hover:scale-105 transition"
          >
            🎁 Mulai Kejutan
          </button>
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
                  <div className="card-inner relative w-full h-24 bg-transparent">
                    <div className="card-face card-front absolute inset-0 flex items-center justify-center rounded-lg bg-pink-200 shadow">
                      ❓
                    </div>
                    <div className="card-face card-back absolute inset-0 flex items-center justify-center rounded-lg bg-white text-2xl shadow card-back">
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
              onClick={() => setStage("greeting-open")}
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
