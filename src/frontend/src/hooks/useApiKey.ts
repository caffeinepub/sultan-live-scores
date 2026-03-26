import { useState } from "react";

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(
    () => localStorage.getItem("footballApiKey") || "",
  );

  const saveApiKey = (key: string) => {
    localStorage.setItem("footballApiKey", key);
    setApiKeyState(key);
  };

  return { apiKey, saveApiKey };
}
