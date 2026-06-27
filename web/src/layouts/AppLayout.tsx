import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useZPCStore } from '../store/useZPCStore';
import styles from './AppLayout.module.css';

const navItems = [
  { to: '/', label: 'Command', end: true },
  { to: '/agents', label: 'Swarm' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/approvals', label: 'Approvals', badge: true },
  { to: '/finance', label: 'Finance' },
  { to: '/activity', label: 'Activity' },
  { to: '/settings', label: 'Settings' },
];

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingCount = useZPCStore((s) => s.approvals.filter((a) => a.status === 'pending').length);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.shell}>
      {menuOpen && (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`} aria-label="Main navigation">
        <div className={styles.brand}>
          <div className={styles.brandLabel}>Zero Person Company</div>
          <div className={styles.brandTitle}>ZPC Console</div>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
              onClick={closeMenu}
            >
              {item.label}
              {item.badge && pendingCount > 0 && (
                <span className={styles.badge}>{pendingCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
          <strong>ZPC</strong>
          <span aria-hidden style={{ width: 44 }} />
        </header>
        <main id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
