import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Supabase Debug",
  robots: {
    index: false,
    follow: false
  }
};

type ShopDebugRow = {
  name: string | null;
};

export default async function DebugSupabasePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasUrl = Boolean(supabaseUrl);
  const hasKey = Boolean(supabaseAnonKey);

  let shopNames: string[] = [];
  let shopCount = 0;
  let errorMessage = "";

  if (hasUrl && hasKey) {
    try {
      const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false
        },
        global: {
          fetch: (input, init) =>
            fetch(input, {
              ...init,
              cache: "no-store"
            } as RequestInit)
        }
      });

      const { data, error, count } = await supabase
        .from("shops")
        .select("name", { count: "exact" })
        .limit(10);

      if (error) {
        errorMessage = error.message;
      } else {
        const rows = (data ?? []) as ShopDebugRow[];
        shopCount = count ?? rows.length;
        shopNames = rows.map((shop) => shop.name).filter((name): name is string => Boolean(name));
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unknown Supabase connection error.";
    }
  } else {
    errorMessage = "Missing Supabase URL or anon key environment variable.";
  }

  return (
    <section className="container-shell py-8">
      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase text-teal">Temporary diagnostics</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Supabase Debug</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          This page checks the public Supabase connection for the <code>shops</code> table. The anon key is never shown.
        </p>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <DebugItem label="Supabase URL present" value={hasUrl ? "yes" : "no"} />
          <DebugItem label="Supabase key present" value={hasKey ? "yes" : "no"} />
          <DebugItem label="Number of shops returned" value={String(shopCount)} />
          <DebugItem label="Supabase error message" value={errorMessage || "None"} />
        </dl>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-ink">First 10 shop names</h2>
          {shopNames.length > 0 ? (
            <ol className="mt-4 grid gap-2 text-sm text-muted">
              {shopNames.map((name) => (
                <li key={name} className="rounded-lg border border-line bg-paper px-3 py-2">
                  {name}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-muted">
              No shop names returned.
            </p>
          )}
        </section>
      </div>
    </section>
  );
}

function DebugItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <dt className="font-bold text-ink">{label}</dt>
      <dd className="mt-2 break-words text-muted">{value}</dd>
    </div>
  );
}
