"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Pencil, ArrowRight } from "lucide-react";

export default function FrameToCode() {
  const [isAnimating, setIsAnimating] = useState(false);

  // IDE-like syntax highlighting için renkler
  const colors = {
    keyword: "text-purple-400", // function, return gibi keywordler
    component: "text-blue-400", // Component isimleri
    prop: "text-sky-300", // Props
    string: "text-green-400", // String değerler
    punctuation: "text-gray-400", // Parantezler, noktalama
    value: "text-orange-400", // Değerler
  };

  // Kod satırları ve syntax highlighting
  const codeLines = [
    [
      { text: "function ", color: colors.keyword },
      { text: "Button", color: colors.component },
      { text: "() {", color: colors.punctuation },
    ],
    [
      { text: "  ", color: "text-white" },
      { text: "return", color: colors.keyword },
      { text: " (", color: colors.punctuation },
    ],
    [
      { text: "    <", color: colors.punctuation },
      { text: "button", color: colors.component },
      { text: " ", color: "text-white" },
      { text: "className", color: colors.prop },
      { text: "=", color: colors.punctuation },
      { text: '"px-4 py-2 bg-blue-500 rounded"', color: colors.string },
      { text: ">", color: colors.punctuation },
    ],
    [{ text: "      Click me", color: colors.value }],
    [
      { text: "    </", color: colors.punctuation },
      { text: "button", color: colors.component },
      { text: ">", color: colors.punctuation },
    ],
    [{ text: "  )", color: colors.punctuation }],
    [{ text: "}", color: colors.punctuation }],
  ];

  const handleTransform = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  };

  return (
    <div className="w-full p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex gap-8 items-stretch">
          {/* Sol taraf - Frame */}
          <motion.div className="flex-1 bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Frame Tasarımı</h2>
              </div>

              <div className="border-2 border-dashed border-gray-300 p-4 rounded-md min-h-[200px] flex items-center justify-center">
                <motion.div
                  animate={
                    isAnimating
                      ? {
                          scale: [1, 0.9, 0.9, 1],
                          x: [0, 20, -20, 0],
                          opacity: [1, 0.5, 0.5, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
                  className="w-32 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-medium"
                >
                  Click me
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Orta - Ok İşareti */}
          <div className="flex items-center">
            <motion.div
              animate={
                isAnimating
                  ? {
                      x: [0, 10, -10, 0],
                      scale: [1, 1.2, 1.2, 1],
                      color: ["#1d4ed8", "#2563eb", "#2563eb", "#1d4ed8"],
                    }
                  : {}
              }
              transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
            >
              <ArrowRight className="w-8 h-8 text-blue-700" />
            </motion.div>
          </div>

          {/* Sağ taraf - Kod */}
          <motion.div className="flex-1 bg-gray-900 rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Kod</h2>
              </div>

              <div className="relative">
                <pre className="text-sm font-mono bg-gray-800 p-4 rounded-md overflow-x-auto min-h-[200px]">
                  <code>
                    {codeLines.map((line, lineIndex) => (
                      <motion.div
                        key={lineIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isAnimating ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.3,
                          delay: lineIndex * 0.2,
                        }}
                        className="whitespace-pre"
                      >
                        {line.map((segment, segmentIndex) => (
                          <motion.span
                            key={segmentIndex}
                            initial={{ opacity: 0 }}
                            animate={isAnimating ? { opacity: 1 } : {}}
                            transition={{
                              duration: 0.1,
                              delay: lineIndex * 0.2 + segmentIndex * 0.05,
                            }}
                            className={segment.color}
                          >
                            {segment.text}
                          </motion.span>
                        ))}
                      </motion.div>
                    ))}
                  </code>
                </pre>

                {/* Yanıp sönen kursor efekti */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={
                    isAnimating
                      ? {
                          opacity: [0, 1, 0],
                          transition: {
                            duration: 0.8,
                            repeat: 3,
                            repeatType: "reverse",
                          },
                        }
                      : { opacity: 0 }
                  }
                  className="absolute bottom-4 left-4 w-2 h-4 bg-white"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dönüştürme butonu */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleTransform}
            disabled={isAnimating}
            className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium 
              hover:bg-blue-600 transition-colors disabled:opacity-50 
              disabled:cursor-not-allowed"
          >
            Koda Dönüştür
          </button>
        </div>
      </div>
    </div>
  );
}
