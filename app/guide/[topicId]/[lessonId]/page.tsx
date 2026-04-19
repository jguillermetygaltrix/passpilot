import { ALL_LESSONS } from "@/lib/data/lessons";
import { LessonClient } from "./lesson-client";

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ topicId: l.topicId, lessonId: l.id }));
}

export default function LessonPage() {
  return <LessonClient />;
}
