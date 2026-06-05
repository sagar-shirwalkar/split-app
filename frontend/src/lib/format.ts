/**
 * Display formatters — money, dates, names.
 * Centralized so the whole app formats consistently and currency
 * can be made group-aware later.
 */

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$",
  EUR: "€",
  INR: "₹",
  GBP: "£",
};

export function formatMoney(
  amount: number | string | null | undefined,
  currency: string = "USD",
): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount ?? 0;
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n).toFixed(2);
  // Group thousands: 1234.56 → 1,234.56
  const [whole, frac] = abs.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${symbol}${grouped}.${frac}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  // Treat as a calendar date (no time-zone shift) for an expense app
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const mi = Math.max(1, Math.min(12, parseInt(m, 10))) - 1;
  return `${monthNames[mi]} ${parseInt(d, 10)}, ${y}`;
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function initials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministic background color from a string.
 * Used for avatars so the same person always shows the same color.
 * Returns a Tailwind class pair (bg + text) for accessibility.
 */
const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
  { bg: "bg-rose-100",   text: "text-rose-700"   },
  { bg: "bg-amber-100",  text: "text-amber-800"  },
  { bg: "bg-emerald-100",text: "text-emerald-800"},
  { bg: "bg-sky-100",    text: "text-sky-700"    },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-fuchsia-100",text: "text-fuchsia-700"},
  { bg: "bg-teal-100",   text: "text-teal-800"   },
  { bg: "bg-orange-100", text: "text-orange-800" },
];

export function avatarPaletteFor(seed: string): { bg: string; text: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}
