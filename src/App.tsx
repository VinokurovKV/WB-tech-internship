import { useEffect, useState } from "react";
import { getUsers } from "./api/users";
import type { User } from "./types/user";

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h1>WB-Tech</h1>
      <p>Users loaded: {users.length}</p>
    </div>
  );
}

export default App;
