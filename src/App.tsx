import { Header } from "./components/Header";
import { ToolSidebar } from "./components/ToolSidebar";
import { EditorCanvas } from "./components/EditorCanvas";
import { PropertySidebar } from "./components/PropertySidebar";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <div className="workspace">
        <ToolSidebar />
        <EditorCanvas />
        <PropertySidebar />
      </div>
    </div>
  );
}
