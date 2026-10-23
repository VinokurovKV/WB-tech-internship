import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router";

import { getUsers } from "./api/users";
import App from "./App";
import UserDetailsPage from "./pages/UserDetailsPage";
import type { User } from "./types/user";

export default function RoutedApp() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const listScrollPosition = useRef(0);

  const getListScrollPosition = useCallback(
    () => listScrollPosition.current,
    [],
  );
  const saveListScrollPosition = useCallback((position: number) => {
    listScrollPosition.current = position;
  }, []);

  useEffect(() => {
    let active = true;

    getUsers(1, 100)
      .then((data) => {
        if (active) {
          setAllUsers(data);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <App
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            loading={loading}
            error={error}
            getScrollPosition={getListScrollPosition}
            onScrollPositionChange={saveListScrollPosition}
          />
        }
      />
      <Route path="/users/:id" element={<UserDetailsPage />} />
    </Routes>
  );
}
