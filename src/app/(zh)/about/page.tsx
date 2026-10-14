import AboutPage, { aboutMetadata } from "@/components/pages/AboutPage";

export const metadata = aboutMetadata("zh");

export default function About() {
  return <AboutPage lang="zh" />;
}
