import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SandboxApp } from "@/components/Sandbox/SandboxApp";
import "@/styles/globals.scss";

const root = document.getElementById("sandbox-root");

if (!root) throw new Error("Elemento raiz #sandbox-root não encontrado.");

createRoot(root).render(
  <StrictMode>
    <SandboxApp />
  </StrictMode>,
);
