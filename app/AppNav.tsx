"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  role: "user" | "it" | "admin";
};

type IconName = "ticket" | "book" | "users" | "clock" | "plus";
type NavLink = { href: string; label: string; icon: IconName };

const roleLabel = (role: User["role"]) => {
  if (role === "admin") return "Quản trị viên";
  if (role === "it") return "Nhân viên CNTT";
  return "Người dùng";
};

function NavIcon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "ticket") {
    return (
      <svg {...common}>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V9a2 2 0 0 0 0 4v4.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5V13a2 2 0 0 0 0-4Z" />
        <path d="M9 8h6M9 12h4" />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 20.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17a2 2 0 0 1 2-2h2.5a2.5 2.5 0 0 1 2.5 2.5Z" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function AppNav() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  if (!user) return null;

  const links: NavLink[] = [
    { href: "/tickets", label: "Yêu cầu hỗ trợ", icon: "ticket" },
    { href: "/knowledge-base", label: "Kho kiến thức", icon: "book" },
  ];

  if (user.role === "admin") {
    links.push(
      { href: "/admin/users", label: "Người dùng", icon: "users" },
      { href: "/admin/sla", label: "Thời hạn xử lý", icon: "clock" },
    );
  }

  return (
    <header className="app-nav">
      <div className="nav-top">
        <div className="nav-inner">
          <a className="brand" href="/" aria-label="Trang chủ Vinatex Đà Nẵng">
            <span className="brand-logo-wrap">
              <img
                className="brand-logo"
                src="/brand/vinatex-da-nang.png"
                alt="Vinatex Đà Nẵng"
              />
            </span>
            <span className="brand-copy">
              <strong>VINATEX</strong>
              <small>ĐÀ NẴNG</small>
            </span>
          </a>

          <div className="nav-user">
            <div className="user-profile">
              <span className="user-avatar">
                {user.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="user-copy">
                <strong>{user.name}</strong>
                <small>{roleLabel(user.role)}</small>
              </span>
            </div>
            <button className="logout-button" type="button" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="nav-menu">
        <div className="nav-menu-inner">
          <nav aria-label="Điều hướng chính">
            {links.map((link) => (
              <a
                key={link.href}
                className={pathname.startsWith(link.href) ? "active" : ""}
                href={link.href}
              >
                <span className="nav-icon">
                  <NavIcon name={link.icon} />
                </span>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          <a className="nav-home-action" href="/tickets/new">
            <NavIcon name="plus" />
            <span>Tạo yêu cầu hỗ trợ</span>
          </a>
        </div>
      </div>
    </header>
  );
}
