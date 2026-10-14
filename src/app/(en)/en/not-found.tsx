import NotFoundPage, { notFoundMetadata } from "@/components/pages/NotFoundPage";

export const metadata = notFoundMetadata("en");

export default function NotFound() {
  return <NotFoundPage lang="en" />;
}
