import { useEffect } from "react";

export function UseLessonTimer(lessonId, onTimeLogged) {
  useEffect(() => {
    const start = Date.now();

    const handleUnload = () => {
      const timeSpentInMinutes = Math.floor((Date.now() - start) / 1000 / 60);
      const timeSpent = Math.max(timeSpentInMinutes, 0);
      if (timeSpent > 0) {
        onTimeLogged(lessonId, timeSpent);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [lessonId, onTimeLogged]);
}
