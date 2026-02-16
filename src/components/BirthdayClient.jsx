"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function BirthdayClient() {
  const [showMessage, setShowMessage] = useState(false);
  const [started, setStarted] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const searchParams = useSearchParams();

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setMusicOn(true);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicOn) audioRef.current.pause();
    else audioRef.current.play();
    setMusicOn(!musicOn);
  };

  const handleGameClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowMessage(true);
      startMusic();
    }
  };

  const sendWA = () => {
    const fromName = searchParams.get("from") || "Seseorang";
    const msg = `Makasih banyak ya ${fromName} ❤️✨ Ucapannya bikin aku senyum hari ini.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 text-white relative">
      <audio ref={audioRef} loop>
        <source src="/music/birthday.mp3" type="audio/mpeg" />
      </audio>

      {showMessage && (
        <button
          onClick={toggleMusic}
          className="absolute top-4 right-4 bg-white text-pink-600 px-4 py-2 rounded-full text-sm shadow"
        >
          {musicOn ? "🔊 Music On" : "🔇 Music Off"}
        </button>
      )}

      <div className="text-center space-y-6 px-6 max-w-xl">
        {!started ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold animate-pulse">
              🎉 Selamat Ulang Tahun 🎂
            </h1>
            <p className="text-lg opacity-90">
              Klik tombol di bawah untuk kejutan!
            </p>
            <button
              onClick={() => setStarted(true)}
              className="bg-white text-pink-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
            >
              🎁 Mulai Kejutan
            </button>
          </>
        ) : !showMessage ? (
          <>
            <h2 className="text-2xl font-semibold animate-pulse">
              🎮 Klik tombol 5 kali untuk lihat ucapannya!
            </h2>
            <button
              onClick={handleGameClick}
              className="bg-yellow-400 text-pink-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-110 transition"
            >
              Klik aku! ({clickCount}/5)
            </button>
          </>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-3xl font-bold">🎂 Happy Birthday!</h2>
            <p className="text-lg leading-relaxed">
              Semoga di umur yang baru ini, kamu selalu diberi kesehatan,
              ketenangan, dan banyak hal baik yang datang tanpa kamu duga.
            </p>
            <p className="opacity-90">
              Ucapan ini dikirim dengan tulus dari{" "}
              <span className="font-semibold">
                {searchParams.get("from") || "Seseorang"}
              </span>{" "}
              🤍
            </p>
            <button
              onClick={sendWA}
              className="mt-6 bg-green-500 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
            >
              💌 Kirim Terima Kasih
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
