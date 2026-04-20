"use client";

import { useState, KeyboardEvent } from "react";
import styles from "./UserSearch.module.css";

export default function UserSearch() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUser(null);

      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchUser();
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        
        <h1 className={styles.title}>GitHub Explorer</h1>
        <p className={styles.subtitle}>
          Discover any developer profile, followers, and repositories instantly.
        </p>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />

          <button
            onClick={fetchUser}
            disabled={loading}
            className={styles.button}
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {user && (
          <div className={styles.profileCard}>
            <img
              src={user.avatar_url}
              alt="avatar"
              width={100}
              className={styles.avatar}
            />

            <h2 className={styles.name}>
              {user.name || user.login}
            </h2>

            <p className={styles.bio}>
              {user.bio || "No bio available"}
            </p>

            <div className={styles.stats}>
              <div className={styles.statBox}>
                <strong>{user.followers}</strong>
                <p>Followers</p>
              </div>
              <div className={styles.statBox}>
                <strong>{user.following}</strong>
                <p>Following</p>
              </div>
              <div className={styles.statBox}>
                <strong>{user.public_repos}</strong>
                <p>Repos</p>
              </div>
            </div>

            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.profileBtn}
            >
              View GitHub Profile →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}