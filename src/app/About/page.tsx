"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Bot,
  Brain,
  Code,
  Cpu,
  Github,
  Lightbulb,
  Paintbrush,
  Rocket,
  Sparkles,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div
      className=" bg-gradient-to-b from-background to-background/80"
      ref={containerRef}
    >
      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative  flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-background/20 backdrop-blur-3xl" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl"
          />
        </div>
        <div className="container mx-auto px-4 py-24 text-center relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                Yapay Zeka ile Tasarımdan Koda
              </h1>
            </motion.div>
            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              Geleceğin web geliştirme sürecini bugünden yaşayın. Yapay zeka
              destekli platformumuz, tasarımlarınızı anında modern ve responsive
              web uygulamalarına dönüştürüyor. Frame&apos;lerinizi koda
              çeviriyor, yaratıcılığınızı özgür bırakıyoruz.
            </motion.p>
            <motion.div variants={fadeIn} className="flex gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Hemen Başla
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Daha Fazla Bilgi
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Vision Section */}
      <section className="py-32 bg-gradient-to-b from-background/80 to-background">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Vizyonumuz</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Web geliştirme sürecini demokratikleştirmek ve herkes için
              erişilebilir kılmak için çalışıyoruz. Yapay zeka teknolojimiz,
              tasarımcılar ve geliştiriciler arasındaki köprüyü kurarak,
              yaratıcı süreçleri hızlandırıyor ve optimize ediyor.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeIn}
              className="relative aspect-square rounded-3xl overflow-hidden"
            >
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Vision"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </motion.div>
            <motion.div variants={fadeIn} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Neden Biz?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Yapay zeka teknolojimiz, yıllarca süren araştırma ve
                  geliştirme çalışmalarının ürünüdür. En son teknolojileri
                  kullanarak, tasarımlarınızı sadece koda dönüştürmekle
                  kalmıyor, aynı zamanda optimize ediyor ve en iyi performansı
                  sağlıyoruz.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Nasıl Çalışıyoruz?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Gelişmiş yapay zeka algoritmalarımız, tasarım dosyalarınızı
                  analiz ederek komponentlere ayırır ve modern web teknolojileri
                  kullanarak temiz, ölçeklenebilir ve performanslı kod üretir.
                  Bu süreç, geleneksel geliştirme sürecini hızlandırır ve hata
                  payını minimize eder.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-4xl font-bold mb-6">
              Özelliklerimiz
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              En son teknolojileri kullanarak geliştirdiğimiz platformumuz,
              tasarımdan koda dönüşüm sürecini otomatikleştiriyor ve optimize
              ediyor.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Wand2 className="w-12 h-12" />,
                title: "AI Destekli Dönüşüm",
                description:
                  "Yapay zeka algoritmalarımız, tasarımlarınızı analiz ederek en uygun kod yapısını oluşturur. Komponentleri otomatik olarak belirler ve optimize eder.",
              },
              {
                icon: <Paintbrush className="w-12 h-12" />,
                title: "Frame'den Koda",
                description:
                  "Figma, Sketch veya Adobe XD gibi tasarım araçlarından direkt olarak React komponentlerine dönüşüm sağlar. Pixel-perfect sonuçlar elde edersiniz.",
              },
              {
                icon: <Code className="w-12 h-12" />,
                title: "Modern Teknolojiler",
                description:
                  "React, Next.js ve Tailwind CSS gibi modern teknolojileri kullanarak, performanslı ve ölçeklenebilir web uygulamaları geliştirmenizi sağlar.",
              },
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: "Otomatik Optimizasyon",
                description:
                  "Üretilen kod, en iyi performans için otomatik olarak optimize edilir. SEO dostu yapı ve hızlı yükleme süreleri garanti edilir.",
              },
              {
                icon: <Rocket className="w-12 h-12" />,
                title: "Hızlı Geliştirme",
                description:
                  "Geliştirme sürecini önemli ölçüde hızlandırır. Saatler süren işlemler dakikalar içinde tamamlanır.",
              },
              {
                icon: <Bot className="w-12 h-12" />,
                title: "Akıllı Öneriler",
                description:
                  "Yapay zeka, tasarımınızı geliştirmek için öneriler sunar. En iyi uygulamaları ve trendleri takip ederek güncel kalmanızı sağlar.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="relative overflow-hidden group h-full">
                  <CardContent className="p-8">
                    <div className="mb-6 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 bg-gradient-to-b from-background to-background/80">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="container mx-auto px-4"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Çalışma Sürecimiz</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tasarımdan koda dönüşüm sürecimiz, yapay zeka teknolojimiz
              sayesinde hızlı ve verimli bir şekilde gerçekleşir.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "AI Analiz",
                description:
                  "Yapay zeka algoritmalarımız tasarımınızı detaylı bir şekilde analiz eder. Komponentleri, stilleri ve yapıyı belirler. Bu aşamada, tasarımınızın en verimli şekilde koda dönüştürülmesi için gerekli hazırlıklar yapılır.",
              },
              {
                icon: <Bot className="w-8 h-8" />,
                title: "Otomatik Dönüşüm",
                description:
                  "Analiz sonuçlarına göre, tasarımınız modern React komponentlerine dönüştürülür. Bu süreçte, en güncel web teknolojileri ve best practice'ler kullanılır. Responsive tasarım, accessibility ve performans kriterleri göz önünde bulundurulur.",
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: "Optimizasyon",
                description:
                  "Üretilen kod, performans ve SEO açısından optimize edilir. Gereksiz kod tekrarları temizlenir, asset'ler optimize edilir ve sayfa yükleme süreleri minimize edilir. Bu aşamada ayrıca kod kalitesi kontrolleri yapılır.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="flex gap-8 items-start mb-16 last:mb-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Geleceğin Web Geliştirme Sürecini Keşfedin
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Yapay zeka destekli platformumuz ile tasarımlarınızı hayata
              geçirin. Zaman kazanın, maliyetleri düşürün ve en iyi sonuçları
              elde edin. Hemen ücretsiz denemeye başlayın ve farkı görün.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">Ücretsiz Deneyin</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                asChild
              >
                <Link href="https://github.com">
                  <Github className="w-6 h-6 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
