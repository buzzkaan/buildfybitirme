"use client";

import { useEffect, useState } from "react";
import { PhotoIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { FileUploader } from "react-drag-drop-files";
import { Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeViewer from "@/components/code-viewer";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { readStream } from "@/lib/utils";
import ModernFluidFrameDrawerWithNewFeatures from "@/components/framedrawer/frame-drawer";

export default function UploadComponent() {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );
  const [status, setStatus] = useState<
    "initial" | "uploading" | "uploaded" | "creating" | "created" | "error"
  >("initial");
  const [model, setModel] = useState("gemini-1.5-pro");
  const [modelName, setModelName] = useState("Gemini 1.5 Pro");
  const [generatedCode, setGeneratedCode] = useState("");
  const [shadcn, setShadcn] = useState(true);
  const [buildingMessage, setBuildingMessage] = useState(
    "Reading the image..."
  );
  const [errorMessage, setErrorMessage] = useState("");

  const loading = status === "creating";

  const loadingMessages = [
    "Analyzing the image...",
    "Identifying UI components...",
    "Generating React components...",
    "Applying Tailwind styles...",
    "Building your app...",
    "Almost there...",
  ];

  useEffect(() => {
    if (status === "creating") {
      let messageIndex = 0;
      const interval = setInterval(() => {
        setBuildingMessage(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const handleFileChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get image dimensions before upload
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = () => {
          setImageSize({
            width: img.width,
            height: img.height,
          });
          resolve(true);
        };
      });

      setStatus("uploading");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.url);
      setStatus("uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("initial");
    }
  };

  async function createApp() {
    setStatus("creating");
    setGeneratedCode("");
    setBuildingMessage(loadingMessages[0]);

    try {
      const res = await fetch("/api/generateCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          shadcn,
          imageUrl,
          imageSize,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too Many Requests");
        }
        throw new Error(res.statusText);
      }
      if (!res.body) throw new Error("No response body");

      for await (const chunk of readStream(res.body)) {
        setGeneratedCode((prev) => prev + chunk);
      }

      setStatus("created");
    } catch (error) {
      console.error("Generation error:", error);
      setStatus("error");
      setErrorMessage("Oops! Thank you for your interest!");
    }
  }

  function handleSampleImage() {
    setImageUrl(
      "https://res.cloudinary.com/dlqsssui0/image/upload/v1731159642/fhsjpck62rzljzfoukil.png"
    );
    setImageSize({ width: 800, height: 600 }); // Sample image dimensions
    setStatus("uploaded");
  }

  return (
    <div className="w-full  relative flex items-center justify-center flex-col px-4 md:px-0 py-8">
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 h-[150vh]" />

      <ModernFluidFrameDrawerWithNewFeatures />

      <div className="space-y-4 sm:space-y-6">
        {imageUrl ? (
          <div className="relative mt-2 p-4">
            <div
              className="rounded-xl overflow-hidden shadow-lg mx-auto"
              style={{ maxWidth: "500px" }}
            >
              <img
                alt="Screenshot"
                src={imageUrl}
                className="w-full h-full object-contain"
                style={{ maxHeight: "400px" }}
              />
            </div>
            <button
              className="absolute size-8 text-gray-600  hover:text-gray-800 rounded-full -top-2 z-10 -right-2 flex items-center justify-center shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                setImageUrl(undefined);
                setStatus("initial");
              }}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <FileUploader
            handleChange={handleFileChange}
            name="file"
            types={["png", "jpg", "jpeg"]}
            multiple={false}
          >
            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-blue-200 px-4 sm:px-6 py-8 sm:py-10 cursor-pointer bg-white/80 backdrop-blur-sm transition-colors hover:bg-blue-50/80 shadow-sm">
              <div className="text-center">
                <PhotoIcon
                  className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-blue-400"
                  aria-hidden="true"
                />
                <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload a screenshot</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </FileUploader>
        )}

        {!imageUrl && (
          <div className="text-center">
            <button
              className="font-medium text-blue-600 text-sm underline decoration-transparent hover:decoration-blue-600 decoration-2 underline-offset-4 transition hover:text-blue-500"
              onClick={handleSampleImage}
            >
              Need an example image? Try ours.
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-gray-800">
          <label className="whitespace-nowrap font-medium">AI Model:</label>
          <Select
            value={model}
            onValueChange={(value) => {
              setModel(value);
              const modelNames: { [key: string]: string } = {
                "gemini-1.5-pro": "Gemini 1.5 Pro",

                "meta-llama": "Meta Llama 3.1 8B",

                "gpt-4": "GPT-4 (Premium)",
                "claude-3": "Claude 3 (Premium)",
                "palm-2": "PaLM 2 (Premium)",
              };
              setModelName(modelNames[value]);
            }}
          >
            <SelectTrigger className="w-full sm:w-auto bg-white text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50">
              <img src="/gemini.png" alt="Gemini" className="size-5 mr-2" />
              <SelectValue placeholder={modelName} />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-800 border-gray-200">
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="meta-llama" disabled className="opacity-50">
                Meta Llama 3.1 8B 🔒
              </SelectItem>
              <SelectItem value="gpt-4" disabled className="opacity-50">
                GPT-4 (Premium) 🔒
              </SelectItem>
              <SelectItem value="claude-3" disabled className="opacity-50">
                Claude 3 (Premium) 🔒
              </SelectItem>
              <SelectItem value="palm-2" disabled className="opacity-50">
                PaLM 2 (Premium) 🔒
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy ${
                    status === "initial" ||
                    status === "uploading" ||
                    status === "creating"
                      ? "hidden"
                      : ""
                  }`}
                ></div>
                <button
                  onClick={createApp}
                  disabled={
                    status === "initial" ||
                    status === "uploading" ||
                    status === "creating"
                  }
                  className="relative flex items-center justify-center gap-2 rounded-full bg-white px-4 sm:px-6 py-3 w-full text-gray-800 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  )}
                  Generate app
                </button>
              </div>
            </TooltipTrigger>

            {status === "initial" && (
              <TooltipContent className="bg-white text-gray-800 border-gray-200 shadow-md">
                <p>Please upload an image first</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1">
        {status === "initial" ||
        status === "uploading" ||
        status === "uploaded" ? (
          <div className="flex flex-col justify-center items-center text-center h-full py-8">
            <div className="max-w-xl px-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <img
                  src="/before.png"
                  alt="Before"
                  className="w-full sm:w-48 h-auto sm:h-48 object-contain rounded-lg border border-gray-200 shadow-md"
                />
                <img
                  src="/after.png"
                  alt="After"
                  className="w-full sm:w-48 h-auto sm:h-48 object-contain rounded-lg border border-gray-200 shadow-md"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800 mb-4">
                Transform Your Design Vision into Reality
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Simply upload your design mockup and watch as we transform it
                into a fully functional React application with Tailwind styling.
              </p>
            </div>
          </div>
        ) : status === "creating" ? (
          <div className="relative h-[60vh] sm:h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-lg">
            <div className="absolute inset-0 flex flex-col gap-6 sm:gap-8 items-center justify-center bg-white p-4">
              <div className="relative">
                <motion.div
                  className="relative w-24 h-24 flex items-center justify-center"
                  animate={{
                    scale: [1, 0.9, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="absolute inset-0">
                    <motion.div
                      className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg"
                      animate={{
                        rotate: [0, 90, 180, 270, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                      }}
                    />
                  </div>
                  <Sparkles className="h-12 w-12 text-white z-10" />
                </motion.div>
              </div>

              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.p
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
                  key={buildingMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    textShadow: "0 2px 10px rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {buildingMessage}
                </motion.p>
                <motion.p
                  className="text-gray-600 text-sm"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Please wait while we process your design
                </motion.p>
              </motion.div>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="relative h-[60vh] sm:h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-lg">
            <div className="absolute inset-0 flex flex-col gap-6 items-center justify-center bg-white p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <XCircleIcon className="h-12 w-12 text-red-500" />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 max-w-md"
              >
                <h3 className="text-2xl font-bold text-gray-900">Oops!</h3>
                <p className="text-gray-600">Thank you for your interest!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStatus("uploaded");
                    setErrorMessage("");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </motion.button>
              </motion.div>
            </div>
          </div>
        ) : status === "created" && generatedCode ? (
          <div className="relative h-[60vh] sm:h-[80vh] overflow-hidden rounded-lg border border-gray-200 bg-white/90 shadow-lg">
            <CodeViewer code={generatedCode} showEditor />
          </div>
        ) : null}
      </div>
    </div>
  );
}
