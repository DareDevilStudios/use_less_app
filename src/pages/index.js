import Image from "next/image";
import localFont from "next/font/local";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/ui/main_page/Hero";
import Footer from "@/components/common/Footer";
import Features from "@/components/ui/main_page/Features";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Features/>
      <Footer/>
    </div>
  );
}