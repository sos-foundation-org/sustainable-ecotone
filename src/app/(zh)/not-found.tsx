import NotFoundPage, { notFoundMetadata } from "@/components/pages/NotFoundPage";

export const metadata = notFoundMetadata("zh");

export default function NotFound() {
  return <NotFoundPage lang="zh" />;
}
