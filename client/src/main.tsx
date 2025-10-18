import { createRoot } from "react-dom/client";
import App from "./App";

// Remove Vite-specific env and fetch override; use relative '/api' instead
createRoot(document.getElementById("root")!).render(<App />);
