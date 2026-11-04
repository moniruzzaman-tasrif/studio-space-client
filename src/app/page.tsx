import StudioCategories from "@/components/home/Categories";
import HeroSlider from "@/components/home/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSlider></HeroSlider>
      <StudioCategories></StudioCategories>
    </div>
  );
}
