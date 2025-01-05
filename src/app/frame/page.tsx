"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Cerceve {
  x: number;
  y: number;
  genislik: number;
  yukseklik: number;
}

export default function CerceveUygulamasi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cizimYapiliyor, setCizimYapiliyor] = useState(false);
  const [baslangicPozisyonu, setBaslangicPozisyonu] = useState({ x: 0, y: 0 });
  const [cerceveler, setCerceveler] = useState<Cerceve[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      cerceveleriCiz();
    }
  }, [cerceveler]);

  const cerceveleriCiz = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      cerceveler.forEach((cerceve) => {
        ctx.strokeRect(
          cerceve.x,
          cerceve.y,
          cerceve.genislik,
          cerceve.yukseklik
        );
      });
    }
  };

  const cizimeBasla = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setBaslangicPozisyonu({ x, y });
      setCizimYapiliyor(true);
    }
  };

  const ciz = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cizimYapiliyor) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cerceveleriCiz();
      ctx.strokeRect(
        baslangicPozisyonu.x,
        baslangicPozisyonu.y,
        x - baslangicPozisyonu.x,
        y - baslangicPozisyonu.y
      );
    }
  };

  const cizimiBitir = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (cizimYapiliyor) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const yeniCerceve: Cerceve = {
          x: Math.min(baslangicPozisyonu.x, x),
          y: Math.min(baslangicPozisyonu.y, y),
          genislik: Math.abs(x - baslangicPozisyonu.x),
          yukseklik: Math.abs(y - baslangicPozisyonu.y),
        };

        setCerceveler([...cerceveler, yeniCerceve]);
      }
    }
    setCizimYapiliyor(false);
  };

  const canvasiTemizle = () => {
    setCerceveler([]);
  };

  const canvasiIndir = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "cerceveler.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Çerçeve Çizim Uygulaması</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={cizimeBasla}
        onMouseMove={ciz}
        onMouseUp={cizimiBitir}
        onMouseLeave={cizimiBitir}
        className="border border-gray-300 bg-white"
      />
      <div className="flex gap-4 mt-4">
        <Button onClick={canvasiTemizle}>Canvası Temizle</Button>
        <Button onClick={canvasiIndir} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          İndir
        </Button>
      </div>
    </div>
  );
}
