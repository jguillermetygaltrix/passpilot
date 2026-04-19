import { ALL_TOPICS } from "@/lib/data/topics";
import { ChapterClient } from "./chapter-client";

export function generateStaticParams() {
  return ALL_TOPICS.map((t) => ({ topicId: t.id }));
}

export default function ChapterPage() {
  return <ChapterClient />;
}
