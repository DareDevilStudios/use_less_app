import Image from "next/image";
import localFont from "next/font/local";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/ui/main_page/Hero";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
    </div>
  );
}