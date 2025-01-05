"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  MessageSquare,
  Send,
  Play,
  X,
  Download,
  Save,
} from "lucide-react";
import Link from "next/link";

export default function Component() {
  const [html, setHtml] = useState("<h1>Hello, CodePen!</h1>");
  const [css, setCss] = useState("h1 { color: blue; }");
  const [js, setJs] = useState('console.log("Hello from JS!");');
  const [output, setOutput] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to CodePen Chat!",
      sender: "System",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: query,
        }),
      });

      const responseData = await response.json();
      const generatedText = responseData.openai.generated_text;
      setData(generatedText);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: query,
          sender: "You",
          timestamp: new Date().toLocaleTimeString(),
        },
        {
          id: Date.now() + 1,
          text: "Kod oluşturuldu",
          sender: "AI",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setQuery("");
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Bir hata oluştu. Lütfen tekrar deneyin.",
          sender: "System",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      const htmlMatch = data.match(/```html\n([\s\S]*?)```/);
      const cssMatch = data.match(/```css\n([\s\S]*?)```/);
      const jsMatch = data.match(/```javascript\n([\s\S]*?)```/);

      if (htmlMatch) {
        const htmlCode = htmlMatch[1]
          .replace("<!DOCTYPE html>\n", "")
          .replace(/<html.*?>[\s\S]*?<body>\n?/, "")
          .replace(/<\/body>[\s\S]*?<\/html>/, "")
          .trim();
        setHtml(htmlCode);
      }

      if (cssMatch) {
        setCss(cssMatch[1].trim());
      }

      if (jsMatch) {
        setJs(jsMatch[1].trim());
      }

      const combinedOutput = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${cssMatch ? cssMatch[1].trim() : css}</style>
          </head>
          <body>
            ${
              htmlMatch
                ? htmlMatch[1]
                    .replace("<!DOCTYPE html>\n", "")
                    .replace(/<html.*?>[\s\S]*?<body>\n?/, "")
                    .replace(/<\/body>[\s\S]*?<\/html>/, "")
                    .trim()
                : html
            }
            <script>${jsMatch ? jsMatch[1].trim() : js}</script>
          </body>
        </html>
      `;
      setOutput(combinedOutput);
    }
  }, [data]);

  useEffect(() => {
    const combinedOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    setOutput(combinedOutput);
  }, [html, css, js]);

  const runCode = () => {
    const combinedOutput = `
      <html>
        <style>${css}</style>
        <body>${html}</body>
        <script>${js}</script>
      </html>
    `;
    setOutput(combinedOutput);
  };

  // const sendMessage = () => {
  //   if (newMessage.trim()) {
  //     setMessages([
  //       ...messages,
  //       {
  //         id: messages.length + 1,
  //         text: newMessage,
  //         sender: "You",
  //         timestamp: new Date().toLocaleTimeString(),
  //       },
  //     ]);
  //     setNewMessage("");
  //   }
  // };

  const downloadCode = (content: string, type: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveToLocalStorage = () => {
    const codeState = {
      html,
      css,
      js,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("codepen-state", JSON.stringify(codeState));
  };

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem("codepen-state");
    if (savedState) {
      const {
        html: savedHtml,
        css: savedCss,
        js: savedJs,
      } = JSON.parse(savedState);
      setHtml(savedHtml);
      setCss(savedCss);
      setJs(savedJs);
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <div className="flex w-full flex-col h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">CodePenChat</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={saveToLocalStorage}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              title="Save to Local Storage"
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              onClick={runCode}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden">
        <div
          className={`flex-grow flex flex-col md:flex-row ${
            isChatOpen ? "md:w-3/4" : "w-full"
          }`}
        >
          <div className="w-full md:w-1/2 p-4 overflow-auto">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JS</TabsTrigger>
              </TabsList>
              <TabsContent value="html">
                <div className="relative">
                  <Textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    placeholder="Type your HTML here..."
                    className="w-full h-64 bg-gray-800 text-gray-100 border-gray-700"
                  />
                  <Button
                    onClick={() => downloadCode(html, "html")}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    title="Download HTML"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="css">
                <div className="relative">
                  <Textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    placeholder="Type your CSS here..."
                    className="w-full h-64 bg-gray-800 text-gray-100 border-gray-700"
                  />
                  <Button
                    onClick={() => downloadCode(css, "css")}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    title="Download CSS"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="js">
                <div className="relative">
                  <Textarea
                    value={js}
                    onChange={(e) => setJs(e.target.value)}
                    placeholder="Type your JavaScript here..."
                    className="w-full h-64 bg-gray-800 text-gray-100 border-gray-700"
                  />
                  <Button
                    onClick={() => downloadCode(js, "js")}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    title="Download JavaScript"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full md:w-1/2 p-4 overflow-auto">
            <Card className="bg-white h-full">
              <CardHeader>
                <CardTitle className="text-gray-800">Output</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe
                  srcDoc={output}
                  title="output"
                  sandbox="allow-scripts"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  className="bg-white"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {isChatOpen && (
          <div className="w-full md:w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat
              </CardTitle>
              <Button
                onClick={() => setIsChatOpen(false)}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent
              className="flex-grow overflow-auto"
              ref={chatContainerRef}
            >
              {messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`}
                      />
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{message.sender}</p>
                      <p className="text-sm text-gray-400">{message.text}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp}
                  </p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSearch} className="flex w-full">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Kod oluşturmak için bir şey sorun..."
                  className="flex-grow mr-2 bg-gray-700 border-gray-600 text-gray-100"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </CardFooter>
          </div>
        )}
      </main>
    </div>
  );
}
