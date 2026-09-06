import { Gift, History, Star, TrendingUp } from "lucide-react";

const STAR_POINTS = 250;
const POINTS_TO_NEXT_TIER = 50;
const TIER_PROGRESS_PCT = 83;

const POINT_LOGS = [
  { label: "Order #TS9283", date: "Apr 05, 2026", points: 50 },
  { label: "Product Review", date: "Mar 28, 2026", points: 20 },
  { label: "Profile Completion", date: "Mar 15, 2026", points: 100 },
];

export default function StarPointsPage() {
  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 gap-4 rounded-3xl bg-gray-900 p-8 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-green-400">
            <Star size={12} fill="currentColor" />
            Elite Tier Status
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-white">
            Your Reward <span className="text-green-400">Universe</span>
          </h1>
          <p className="mt-2 max-w-sm text-sm text-gray-400">
            Unlock exclusive discounts and early access to premium tech gear.
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
            Available Balance
          </p>
          <p className="mt-1 text-4xl font-extrabold text-white">
            {STAR_POINTS} <span className="text-lg font-bold text-green-400">PTS</span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-500"
              style={{ width: `${TIER_PROGRESS_PCT}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            {POINTS_TO_NEXT_TIER} points more to Gold Tier
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900">Earning Opportunities</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                <Gift size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">Refer a Friend</h3>
              <p className="mt-1 text-xs text-gray-500">
                Earn 500 PTS for every friend who makes their first purchase.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                <TrendingUp size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-gray-900">Shop & Earn</h3>
              <p className="mt-1 text-xs text-gray-500">
                Earn 5 points for every ৳100 spent on our platform.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              <History size={15} />
            </span>
            <h3 className="text-sm font-bold text-gray-900">Point Logs</h3>
          </div>

          <div className="mt-4 space-y-3">
            {POINT_LOGS.map((log, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-bold text-gray-900">{log.label}</p>
                  <p className="text-[11px] text-gray-400">{log.date}</p>
                </div>
                <span className="text-sm font-bold text-green-600">+{log.points}</span>
              </div>
            ))}
          </div>

          <button
            disabled
            className="mt-4 w-full cursor-not-allowed rounded-xl bg-gray-50 py-3 text-xs font-bold uppercase tracking-wide text-gray-300"
            title="Not built yet"
          >
            Full Statement →
          </button>
        </div>
      </div>
    </div>
  );
}
