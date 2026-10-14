import AboutPage, { aboutMetadata } from "@/components/pages/AboutPage";

export const metadata = aboutMetadata("en");

export default function About() {
  return <AboutPage lang="en" />;
}
