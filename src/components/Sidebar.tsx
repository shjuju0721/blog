"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

type Props = {
  counts: Record<string, number>;
  total: number;
};

export default function Sidebar({ counts, total }: Props) {
  const raw = usePathname();
  let pathname = raw;
  try {
    pathname = decodeURIComponent(raw);
  } catch {
    // 디코딩 실패 시 원본 사용
  }

  return (
    <aside className="w-full shrink-0 md:w-44">
      <nav className="sticky top-8 space-y-1">
        <h2 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          카테고리
        </h2>
        <CatLink href="/" label="전체" count={total} active={pathname === "/"} />
        {CATEGORIES.map((c) => (
          <CatLink
            key={c}
            href={`/category/${encodeURIComponent(c)}`}
            label={c}
            count={counts[c] ?? 0}
            active={pathname === `/category/${c}`}
          />
        ))}
      </nav>
    </aside>
  );
}

function CatLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-gray-900 font-medium text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span>{label}</span>
      <span className={active ? "text-xs text-gray-300" : "text-xs text-gray-400"}>
        {count}
      </span>
    </Link>
  );
}
