"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Move,
  PaintBucket,
  ZoomIn,
  Undo,
  Redo,
  Download,
  Edit2,
  MousePointer,
} from "lucide-react";

interface Frame {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zIndex: number;
}

type ActionType =
  | "add"
  | "move"
  | "resize"
  | "delete"
  | "changeColor"
  | "changeZIndex";

interface Action {
  type: ActionType;
  frame: Frame;
  prevFrame?: Frame;
}

export default function ModernFluidFrameDrawerWithNewFeatures() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [history, setHistory] = useState<Action[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [gridSize, setGridSize] = useState(20);
  const [isDrawMode, setIsDrawMode] = useState(false);

  const drawFrames = useCallback(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas) return;

    const ctx = canvas.getContext("2d");
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!ctx || !offscreenCtx) return;

    offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    offscreenCtx.strokeStyle = "#e5e7eb";
    offscreenCtx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += gridSize) {
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(x, 0);
      offscreenCtx.lineTo(x, canvas.height);
      offscreenCtx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(0, y);
      offscreenCtx.lineTo(canvas.width, y);
      offscreenCtx.stroke();
    }

    frames
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((frame) => {
        drawFrame(offscreenCtx, frame, frame === selectedFrame);
      });

    if (currentFrame) {
      drawFrame(offscreenCtx, currentFrame, false, true);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
  }, [frames, selectedFrame, currentFrame, gridSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    offscreenCanvasRef.current = document.createElement("canvas");
    offscreenCanvasRef.current.width = canvas.width;
    offscreenCanvasRef.current.height = canvas.height;

    let animationFrameId: number;

    const render = () => {
      drawFrames();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawFrames]);

  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    frame: Frame,
    isSelected: boolean,
    isPreview: boolean = false
  ) => {
    ctx.save();
    ctx.strokeStyle = frame.color;
    ctx.fillStyle = isPreview ? `${frame.color}66` : `${frame.color}33`;
    ctx.lineWidth = 2;
    ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
    ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);

    if (isSelected) {
      drawResizeHandles(ctx, frame);
    }
    ctx.restore();
  };

  const drawResizeHandles = (ctx: CanvasRenderingContext2D, frame: Frame) => {
    const handles = [
      { x: frame.x, y: frame.y },
      { x: frame.x + frame.width, y: frame.y },
      { x: frame.x, y: frame.y + frame.height },
      { x: frame.x + frame.width, y: frame.y + frame.height },
    ];

    handles.forEach((handle) => {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawMode) {
      setIsDrawing(true);
      setStartPos({ x, y });
      setCurrentFrame({
        id: "temp",
        x,
        y,
        width: 0,
        height: 0,
        color: getRandomColor(),
        zIndex: frames.length,
      });
    } else {
      const clickedFrame = frames.find(
        (frame) =>
          x >= frame.x &&
          x <= frame.x + frame.width &&
          y >= frame.y &&
          y <= frame.y + frame.height
      );

      if (clickedFrame) {
        setSelectedFrame(clickedFrame);
        const handle = getResizeHandle(x, y, clickedFrame);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
        } else {
          setIsDragging(true);
          setDragOffset({ x: x - clickedFrame.x, y: y - clickedFrame.y });
        }
      } else {
        setSelectedFrame(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing && currentFrame) {
      const width = x - startPos.x;
      const height = y - startPos.y;

      setCurrentFrame({
        ...currentFrame,
        width: Math.abs(width),
        height: Math.abs(height),
        x: width < 0 ? x : startPos.x,
        y: height < 0 ? y : startPos.y,
      });
    } else if (isDragging && selectedFrame) {
      const newX = Math.round((x - dragOffset.x) / gridSize) * gridSize;
      const newY = Math.round((y - dragOffset.y) / gridSize) * gridSize;

      setFrames(
        frames.map((frame) =>
          frame.id === selectedFrame.id ? { ...frame, x: newX, y: newY } : frame
        )
      );
    } else if (isResizing && selectedFrame && resizeHandle) {
      const newFrame = { ...selectedFrame };

      switch (resizeHandle) {
        case "nw":
          newFrame.width += newFrame.x - x;
          newFrame.height += newFrame.y - y;
          newFrame.x = x;
          newFrame.y = y;
          break;
        case "ne":
          newFrame.width = x - newFrame.x;
          newFrame.height += newFrame.y - y;
          newFrame.y = y;
          break;
        case "sw":
          newFrame.width += newFrame.x - x;
          newFrame.height = y - newFrame.y;
          newFrame.x = x;
          break;
        case "se":
          newFrame.width = x - newFrame.x;
          newFrame.height = y - newFrame.y;
          break;
      }

      newFrame.width = Math.round(newFrame.width / gridSize) * gridSize;
      newFrame.height = Math.round(newFrame.height / gridSize) * gridSize;
      newFrame.x = Math.round(newFrame.x / gridSize) * gridSize;
      newFrame.y = Math.round(newFrame.y / gridSize) * gridSize;

      setFrames(
        frames.map((frame) =>
          frame.id === selectedFrame.id ? newFrame : frame
        )
      );
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentFrame) {
      const newFrame = {
        ...currentFrame,
        id: uuidv4(),
        width: Math.round(currentFrame.width / gridSize) * gridSize,
        height: Math.round(currentFrame.height / gridSize) * gridSize,
        x: Math.round(currentFrame.x / gridSize) * gridSize,
        y: Math.round(currentFrame.y / gridSize) * gridSize,
      };
      setFrames([...frames, newFrame]);
      addToHistory({ type: "add", frame: newFrame });
    } else if (isDragging && selectedFrame) {
      addToHistory({
        type: "move",
        frame: selectedFrame,
        prevFrame: frames.find((f) => f.id === selectedFrame.id),
      });
    } else if (isResizing && selectedFrame) {
      addToHistory({
        type: "resize",
        frame: selectedFrame,
        prevFrame: frames.find((f) => f.id === selectedFrame.id),
      });
    }

    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
    setCurrentFrame(null);
    setResizeHandle(null);
  };

  const getResizeHandle = (
    x: number,
    y: number,
    frame: Frame
  ): string | null => {
    const handleSize = 10;
    const handles = [
      { name: "nw", x: frame.x, y: frame.y },
      { name: "ne", x: frame.x + frame.width, y: frame.y },
      { name: "sw", x: frame.x, y: frame.y + frame.height },
      { name: "se", x: frame.x + frame.width, y: frame.y + frame.height },
    ];

    for (const handle of handles) {
      if (
        x >= handle.x - handleSize / 2 &&
        x <= handle.x + handleSize / 2 &&
        y >= handle.y - handleSize / 2 &&
        y <= handle.y + handleSize / 2
      ) {
        return handle.name;
      }
    }

    return null;
  };

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const handleClear = () => {
    setFrames([]);
    setSelectedFrame(null);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleDeleteSelected = () => {
    if (selectedFrame) {
      addToHistory({ type: "delete", frame: selectedFrame });
      setFrames(frames.filter((frame) => frame.id !== selectedFrame.id));
      setSelectedFrame(null);
    }
  };

  const handleChangeColor = () => {
    if (selectedFrame) {
      const newColor = getRandomColor();
      addToHistory({
        type: "changeColor",
        frame: { ...selectedFrame, color: newColor },
        prevFrame: selectedFrame,
      });
      setFrames(
        frames.map((frame) =>
          frame.id === selectedFrame.id ? { ...frame, color: newColor } : frame
        )
      );
    }
  };

  const handleBringToFront = () => {
    if (selectedFrame) {
      const maxZIndex = Math.max(...frames.map((f) => f.zIndex));
      addToHistory({
        type: "changeZIndex",
        frame: { ...selectedFrame, zIndex: maxZIndex + 1 },
        prevFrame: selectedFrame,
      });
      setFrames(
        frames.map((frame) =>
          frame.id === selectedFrame.id
            ? { ...frame, zIndex: maxZIndex + 1 }
            : frame
        )
      );
    }
  };

  const addToHistory = (action: Action) => {
    const newHistory = [...history.slice(0, historyIndex + 1), action];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      switch (action.type) {
        case "add":
          setFrames(frames.filter((f) => f.id !== action.frame.id));
          break;
        case "move":
        case "resize":
        case "changeColor":
        case "changeZIndex":
          if (action.prevFrame) {
            setFrames(
              frames.map((f) =>
                f.id === action.frame.id ? action.prevFrame! : f
              )
            );
          }
          break;
        case "delete":
          setFrames([...frames, action.frame]);
          break;
      }
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const action = history[historyIndex + 1];
      switch (action.type) {
        case "add":
          setFrames([...frames, action.frame]);
          break;
        case "move":
        case "resize":
        case "changeColor":
        case "changeZIndex":
          setFrames(
            frames.map((f) => (f.id === action.frame.id ? action.frame : f))
          );
          break;
        case "delete":
          setFrames(frames.filter((f) => f.id !== action.frame.id));
          break;
      }
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a new canvas for the black and white version
    const bwCanvas = document.createElement("canvas");
    bwCanvas.width = canvas.width;
    bwCanvas.height = canvas.height;
    const bwCtx = bwCanvas.getContext("2d");
    if (!bwCtx) return;

    // Fill the background with white
    bwCtx.fillStyle = "#ffffff";
    bwCtx.fillRect(0, 0, bwCanvas.width, bwCanvas.height);

    // Draw black frames
    frames.forEach((frame) => {
      bwCtx.strokeStyle = "#000000";
      bwCtx.lineWidth = 2;
      bwCtx.strokeRect(frame.x, frame.y, frame.width, frame.height);
    });

    // Create a download link
    const link = document.createElement("a");
    link.download = "frame-drawing.png";
    link.href = bwCanvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex space-x-4 p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col space-y-4">
        <Button
          onClick={() => setIsDrawMode(!isDrawMode)}
          variant={isDrawMode ? "secondary" : "outline"}
          className="w-12 h-12 p-2"
        >
          {isDrawMode ? (
            <MousePointer className="w-6 h-6" />
          ) : (
            <Edit2 className="w-6 h-6" />
          )}
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <Trash2 className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleDeleteSelected}
          disabled={!selectedFrame}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <Trash2 className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleChangeColor}
          disabled={!selectedFrame}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <PaintBucket className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleBringToFront}
          disabled={!selectedFrame}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <ZoomIn className="w-6 h-6" />
        </Button>
        <Button
          onClick={undo}
          disabled={historyIndex < 0}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <Undo className="w-6 h-6" />
        </Button>
        <Button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <Redo className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-12 h-12 p-2"
        >
          <Download className="w-6 h-6" />
        </Button>
      </div>
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-gray-300 rounded-lg shadow-lg bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <div className="w-64 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="grid-size">Grid Size:</Label>
            <Input
              id="grid-size"
              type="number"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-20"
              min={1}
              max={100}
            />
          </div>
        </div>
        <AnimatePresence>
          {selectedFrame && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h2 className="text-lg font-semibold mb-2">Selected Frame</h2>
              <p>
                Position: ({selectedFrame.x.toFixed(2)},{" "}
                {selectedFrame.y.toFixed(2)})
              </p>
              <p>
                Size: {selectedFrame.width.toFixed(2)} x{" "}
                {selectedFrame.height.toFixed(2)}
              </p>
              <p>Color: {selectedFrame.color}</p>
              <p>Z-Index: {selectedFrame.zIndex}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
