"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Code,
  Heart,
  MessageSquare,
  Share2,
  Plus,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  MoreVertical,
  ExternalLink,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  { name: "Popular", icon: Heart },
  { name: "JavaScript", icon: Code },
  { name: "CSS", icon: Code },
  { name: "HTML", icon: Code },
  { name: "React", icon: Code },
];

const pens = [
  {
    id: 1,
    title: "Animated Button",
    author: "CoolDev",
    likes: 423,
    comments: 18,
    language: "CSS",
  },
  {
    id: 2,
    title: "React Hooks Demo",
    author: "HookMaster",
    likes: 387,
    comments: 24,
    language: "JavaScript",
  },
  {
    id: 3,
    title: "CSS Grid Layout",
    author: "GridGuru",
    likes: 512,
    comments: 31,
    language: "CSS",
  },
  {
    id: 4,
    title: "SVG Animation",
    author: "AnimationPro",
    likes: 256,
    comments: 12,
    language: "SVG",
  },
  {
    id: 5,
    title: "Dark Mode Toggle",
    author: "ThemeSwitcher",
    likes: 689,
    comments: 37,
    language: "JavaScript",
  },
  {
    id: 6,
    title: "Responsive Navbar",
    author: "MobileFirst",
    likes: 721,
    comments: 45,
    language: "HTML",
  },
];

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scroll = (index: number, direction: "left" | "right") => {
    const container = scrollContainerRefs.current[index];
    if (container) {
      const scrollAmount =
        direction === "left" ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleDownload = (penId: string, title: string) => {
    // Örnek indirme fonksiyonu
    const content = {
      html: "<h1>Example</h1>",
      css: "h1 { color: blue; }",
      js: "console.log('Hello')",
    };

    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Proje başarıyla indirildi!");
  };

  const handleSave = (penId: string) => {
    // Kaydetme işlemi burada yapılacak
    toast.success("Proje koleksiyonunuza kaydedildi!");
  };

  const handleCopyLink = (penId: string) => {
    navigator.clipboard.writeText(`https://yoursite.com/pen/${penId}`);
    toast.success("Bağlantı panoya kopyalandı!");
  };

  return (
    <div className="flex flex-col min-h-screen  text-gray-100">
      {/* <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-blue-400">
                Dark<span className="text-gray-100">CodePen</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Explore
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Challenges
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Spark
              </Button>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pens..."
                  className="pl-8 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                />
              </div>
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button
                variant="ghost"
                className="md:hidden text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="mt-4 md:hidden">
              <Button
                variant="ghost"
                className="w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 mb-2"
              >
                Explore
              </Button>
              <Button
                variant="ghost"
                className="w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 mb-2"
              >
                Challenges
              </Button>
              <Button
                variant="ghost"
                className="w-full text-left text-gray-300 hover:text-white hover:bg-gray-700 mb-2"
              >
                Spark
              </Button>
              <Input
                placeholder="Search pens..."
                className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 mb-2"
              />
            </nav>
          )}
        </div>
      </header> */}

      <main className="flex-grow container mx-20 px-4 py-8">
        {categories.map((category, index) => (
          <div key={category.name} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                <category.icon className="h-6 w-6 mr-2 text-blue-400" />
                {category.name}
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll(index, "left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll(index, "right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar"
              ref={(el) => (scrollContainerRefs.current[index] = el)}
            >
              {pens.map((pen) => (
                <Card
                  key={pen.id}
                  className="flex-shrink-0 w-72 bg-gray-800 border-gray-700"
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-100 truncate">
                      {pen.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-32 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                      <Code className="h-16 w-16 text-blue-400" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex items-center justify-between bg-gray-750">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${pen.author}`}
                          alt={pen.author}
                        />
                        <AvatarFallback>{pen.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-300">
                        {pen.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-100"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {pen.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-100"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {pen.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-100"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
