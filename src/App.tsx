import { useState } from "react";
import { ListPage } from "./pages/ListPage";
import { LoginPage } from "./pages/LoginPage";

export function App() {
  const [authed, setAuthed] = useState(
    () => !!localStorage.getItem("access_token"),
  );
  return authed ? (
    <ListPage onLogout={() => setAuthed(false)} />
  ) : (
    <LoginPage onLogin={() => setAuthed(true)} />
  );
}
