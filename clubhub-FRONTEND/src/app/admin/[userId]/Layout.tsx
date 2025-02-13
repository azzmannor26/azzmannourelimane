import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

interface AdminLayoutProps {
  children: ReactNode;
  userId: string;
  name: string;
  profileImage: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, userId, name, profileImage }) => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/signup/Green and Black Minimalist Education Logo.png" alt="Logo" />
        </div>
        <nav className={styles.nav}>
          <ul>
            {[
              { href: 'dashboard', icon: 'dashboardicon.png', label: 'Dashboard' },
              { href: 'profile', icon: 'profileicon.png', label: 'Profile' },
              { href: 'club', icon: 'clubicon.png', label: 'Club' },
              { href: 'event', icon: 'eventicon.png', label: 'Event' },
              { href: 'notifications', icon: 'notificon.png', label: 'Notifications' },
              { href: 'upload-files', icon: 'uploadicon.png', label: 'Upload Files' },
              { href: 'chat', icon: 'chaticon.png', label: 'Chat' },
              { href: 'settings', icon: 'settingicon.png', label: 'Settings' },
              { href: 'members', icon: 'membericon.png', label: 'Members' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={`/admin/${userId}/${link.href}?name=${name}`}>
                  <img src={`/admin/${link.icon}`} alt={link.label} /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.mainContent}>{children}</div>
    </div>
  );
};

export default AdminLayout;
