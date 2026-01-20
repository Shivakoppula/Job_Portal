import { createRoot } from "react-dom/client";
import App from "./App";
import UserContext from "./components/contexts/UserContext";

createRoot(document.getElementById("root")).render(<UserContext>
    <App></App>
    </UserContext>)