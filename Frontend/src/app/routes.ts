import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { PoliticianProfile } from "./pages/PoliticianProfile";
import { Comparison } from "./pages/Comparison";
import { Analytics } from "./pages/Analytics";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "politician/:id", Component: PoliticianProfile },
      { path: "comparison", Component: Comparison },
      { path: "analytics", Component: Analytics },
      { path: "*", Component: NotFound },
    ],
  },
]);