"use client";

import { useState } from "react";

export default function CodePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Benim Basit Sayfam</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">Sayaç değeri: {count}</p>

        <button
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Artır
        </button>
      </div>
    </div>
  );
}
