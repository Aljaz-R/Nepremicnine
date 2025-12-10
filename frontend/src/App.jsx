// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";

/* Frontend-only CRUD: localStorage persistence */

const SEED = [
  { id: "apt-1", title: "Svetlo 2-sobno stanovanje", city: "Ljubljana", price: 285000, beds: 2, baths: 1, size: 58, type: "Stanovanje", image: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d20?q=80&w=1600&auto=format&fit=crop", description: "Prenovljeno stanovanje v Šiški, 5. nadstropje z dvigalom, balkon na zahod." },
  { id: "apt-2", title: "Garsonjera blizu centra", city: "Maribor", price: 125000, beds: 1, baths: 1, size: 32, type: "Stanovanje", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop", description: "Mirna lokacija, 10 min peš do Glavnega trga, idealno za par ali študenta." },
  { id: "house-1", title: "Družinska hiša z vrtom", city: "Kranj", price: 420000, beds: 4, baths: 2, size: 165, type: "Hiša", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop", description: "Samostojna hiša na dobri lokaciji, nadstrešek za 2 avtomobila, talno gretje." },
  { id: "house-2", title: "Moderna enodružinska hiša", city: "Celje", price: 510000, beds: 5, baths: 3, size: 210, type: "Hiša", image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1600&auto=format&fit=crop", description: "Nova gradnja 2022, pasivni standard, velik bivalni prostor s kuhinjo." },
  { id: "apt-3", title: "3-sobno z razgledom", city: "Koper", price: 339000, beds: 3, baths: 2, size: 86, type: "Stanovanje", image: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop", description: "Loža z razgledom na morje, klimatizirano, parkirno mesto v garaži." },
  { id: "house-3", title: "Rustikalna hiša v naravi", city: "Bled", price: 690000, beds: 4, baths: 2, size: 180, type: "Hiša", image: "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1600&auto=format&fit=crop", description: "Les-kamen kombinacija, kamin, 1200 m² zemljišča, 15 min do jezera." },
  { id: "apt-4", title: "Prenovljeno staromeščansko", city: "Ljubljana", price: 449000, beds: 3, baths: 2, size: 102, type: "Stanovanje", image: "https://images.unsplash.com/photo-1521783593447-5702fcdac515?q=80&w=1600&auto=format&fit=crop", description: "Visoki stropi, originalni parket, nova okna, center mesta." },
  { id: "house-4", title: "Hiša dvojček z atrijem", city: "Novo mesto", price: 298000, beds: 3, baths: 2, size: 124, type: "Hiša", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop", description: "Mirna soseska, JV orientacija, toplotna črpalka, bližina šole." },
  { id: "apt-5", title: "Duplex penthouse", city: "Ljubljana", price: 725000, beds: 4, baths: 3, size: 150, type: "Stanovanje", image: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?q=80&w=1600&auto=format&fit=crop", description: "Terasa 40 m², dvigalo do stanovanja, dve garažni mesti, pametna hiša." },
  { id: "house-5", title: "Manjša hiša za prenovo", city: "Ptuj", price: 149000, beds: 2, baths: 1, size: 74, type: "Hiša", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1600&auto=format&fit=crop", description: "Mirna ulica, potencial za nadzidavo, dvorišče in vrt." },
  { id: "apt-6", title: "Mini 1.5-sobno", city: "Velenje", price: 98000, beds: 1, baths: 1, size: 29, type: "Stanovanje", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop", description: "Nizek strošek upravljanja, lega JV, takoj vseljivo." },
  { id: "house-6", title: "Vila s pogledom", city: "Piran", price: 1100000, beds: 5, baths: 4, size: 260, type: "Hiša", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1600&auto=format&fit=crop", description: "Bazen, več teras, panoramski razgledi, zasebnost." },
];

function cls(...xs) { return xs.filter(Boolean).join(" "); }
const CURRENCY = new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" });
const TYPES = ["Stanovanje", "Hiša"];

export default function App() {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem("listings");
    return raw ? JSON.parse(raw) : SEED;
  });
  useEffect(() => {
    const hasLocal = localStorage.getItem("listings");
    if (hasLocal) return;

    fetch("http://localhost:3000/api/nepremicnine")
      .then((res) => {
        if (!res.ok) throw new Error("Napaka pri backendu");
        return res.json();
      })
      .then((data) => {
        const enriched = data.map((x) => ({
          ...x,
          image: x.image || "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop",
          description: x.description || "",
        }));
        setItems(enriched);
      })
      .catch((err) => {
        console.error("Napaka pri klicu backenda:", err);
      });
  }, []);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState(0);
  const [sort, setSort] = useState("relevant");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [favIds, setFavIds] = useState(() => {
    const raw = localStorage.getItem("favs"); return raw ? JSON.parse(raw) : [];
  });
  const [active, setActive] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create

  useEffect(() => { localStorage.setItem("listings", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("favs", JSON.stringify(favIds)); }, [favIds]);

  const cities = useMemo(() => Array.from(new Set(items.map(x => x.city))).sort(), [items]);

  const filtered = useMemo(() => {
    let r = items.filter((x) => {
      if (q && !(x.title + " " + x.description).toLowerCase().includes(q.toLowerCase())) return false;
      if (city && x.city !== city) return false;
      if (type && x.type !== type) return false;
      if (minPrice && x.price < Number(minPrice)) return false;
      if (maxPrice && x.price > Number(maxPrice)) return false;
      if (minBeds && x.beds < Number(minBeds)) return false;
      return true;
    });
    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    else if (sort === "size-desc") r.sort((a, b) => b.size - a.size);
    else if (sort === "beds-desc") r.sort((a, b) => b.beds - a.beds);
    return r;
  }, [items, q, city, type, minPrice, maxPrice, minBeds, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { setPage(1); }, [q, city, type, minPrice, maxPrice, minBeds, perPage, items.length]);

  const toggleFav = (id) => setFavIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onDelete = (id) => {
    if (!confirm("Izbrišem oglas?")) return;
    setItems((all) => all.filter((x) => x.id !== id));
    setFavIds((s) => s.filter((x) => x !== id));
    if (active?.id === id) setActive(null);
  };

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };

  const upsertItem = (payload) => {
    if (payload.id) {
      setItems((all) => all.map((x) => (x.id === payload.id ? payload : x)));
    } else {
      const id = slugId(payload.title);
      setItems((all) => [{ ...payload, id }, ...all]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-xl font-bold tracking-tight">Nepremičnine</div>
          <button onClick={openCreate} className="ml-auto px-3 py-1.5 text-sm rounded-full border hover:bg-gray-100">Dodaj oglas</button>
          <button
            className="px-3 py-1.5 text-sm rounded-full border hover:bg-gray-100"
            onClick={() => {
              setQ(""); setCity(""); setType(""); setMinPrice(""); setMaxPrice(""); setMinBeds(0); setSort("relevant");
            }}
            title="Ponastavi filtre"
          >
            Ponastavi
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 bg-white border rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Iskanje</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="naslov, opis ..." className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Mesto</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
                <option value="">Vsa</option>
                {cities.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Tip</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
                <option value="">Vsi</option>
                {TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Cena min</label>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Cena max</label>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Najmanj sob</label>
            <input type="number" value={minBeds} min={0} onChange={(e) => setMinBeds(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Razvrsti</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
              <option value="relevant">Privzeto</option>
              <option value="price-asc">Cena ↑</option>
              <option value="price-desc">Cena ↓</option>
              <option value="size-desc">Površina ↓</option>
              <option value="beds-desc">Št. sob ↓</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Na stran</label>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2">
              {[4, 8, 12].map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Najdeno {filtered.length} oglasov</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={cls("px-3 py-1.5 rounded-full border", page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100")}>← Prejšnja</button>
              <div className="text-sm">Stran {page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={cls("px-3 py-1.5 rounded-full border", page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100")}>Naslednja →</button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pageItems.map((x) => (
              <article key={x.id} className="bg-white border rounded-2xl overflow-hidden group">
                <div className="relative">
                  <img src={x.image} alt={x.title} className="h-44 w-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <IconBtn title="Priljubljeno" onClick={() => toggleFav(x.id)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={favIds.includes(x.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className={cls(favIds.includes(x.id) ? "text-pink-600" : "text-gray-700")}><path d="M12 21s-6.716-4.297-9.428-7.01C.86 12.278.5 10.54 1.05 8.998 1.8 6.93 3.88 5.5 6.07 5.5c1.41 0 2.74.57 3.73 1.57l.2.2.2-.2a5.27 5.27 0 0 1 3.73-1.57c2.19 0 4.27 1.43 5.02 3.5.55 1.54.19 3.28-1.52 5C18.716 16.703 12 21 12 21z"/></svg>
                    </IconBtn>
                    <IconBtn title="Uredi" onClick={() => openEdit(x)}>✎</IconBtn>
                    <IconBtn title="Izbriši" onClick={() => onDelete(x.id)}>🗑</IconBtn>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold leading-tight line-clamp-2">{x.title}</h3>
                  <div className="text-sm text-gray-600">{x.city} · {x.type}</div>
                  <div className="font-bold">{CURRENCY.format(x.price)}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span>🛏 {x.beds}</span><span>🛁 {x.baths}</span><span>📐 {x.size} m²</span>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <button onClick={() => setActive(x)} className="px-3 py-1.5 text-sm rounded-full border hover:bg-gray-100">Podrobno</button>
                    <button className="px-3 py-1.5 text-sm rounded-full border hover:bg-gray-100" onClick={() => alert("Simulirano povpraševanje.")}>Povpraševanje</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center text-gray-600 py-16 border rounded-2xl bg-white">Ni rezultatov za izbrane filtre.</div>
          )}
        </section>
      </main>

      {active && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActive(null)} />
          <div className="relative bg-white w-full max-w-3xl rounded-2xl border overflow-hidden shadow-xl">
            <div className="flex">
              <img src={active.image} alt={active.title} className="hidden md:block w-1/2 h-96 object-cover" />
              <div className="w-full md:w-1/2 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-tight">{active.title}</h3>
                  <button onClick={() => setActive(null)} className="p-2 rounded-full border hover:bg-gray-100" aria-label="Zapri">✕</button>
                </div>
                <div className="text-sm text-gray-600">{active.city} · {active.type}</div>
                <div className="font-bold text-xl">{CURRENCY.format(active.price)}</div>
                <div className="flex items-center gap-3 text-sm text-gray-700"><span>🛏 {active.beds}</span><span>🛁 {active.baths}</span><span>📐 {active.size} m²</span></div>
                <p className="text-sm text-gray-700">{active.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <CrudForm
          initial={editing}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
          onSave={upsertItem}
        />
      )}

      <footer className="py-8 text-center text-xs text-gray-500">Frontend demo. Podatki se shranjujejo v brskalnik (localStorage).</footer>
    </div>
  );
}

/* Reusable controls */
function IconBtn({ children, ...props }) {
  return (
    <button {...props} className={cls("rounded-full p-2 bg-white/90 border hover:bg-white text-sm", props.className)} />
  );
}

function slugId(title) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base || "oglas"}-${Date.now()}`;
}

/* Create/Edit form modal */
function CrudForm({ initial, onCancel, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(
    initial || {
      title: "", city: "", price: "", beds: 1, baths: 1, size: "", type: "Stanovanje",
      image: "", description: "",
    }
  );

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.city || !form.price || !form.size) { alert("Izpolni naslov, mesto, ceno in površino."); return; }
    const payload = { ...form, price: Number(form.price), size: Number(form.size), beds: Number(form.beds || 0), baths: Number(form.baths || 0) };
    if (isEdit) payload.id = initial.id;
    if (!payload.image) payload.image = placeholderFor(payload.type);
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <form onSubmit={submit} className="relative bg-white w-full max-w-2xl rounded-2xl border shadow-xl p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">{isEdit ? "Uredi oglas" : "Nov oglas"}</h3>
          <button type="button" onClick={onCancel} className="p-2 rounded-full border hover:bg-gray-100">✕</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Naslov</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.title} onChange={set("title")} required />
          </div>
          <div>
            <label className="text-sm font-medium">Mesto</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.city} onChange={set("city")} required />
          </div>
          <div>
            <label className="text-sm font-medium">Cena (€)</label>
            <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.price} onChange={set("price")} required />
          </div>
          <div>
            <label className="text-sm font-medium">Površina (m²)</label>
            <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.size} onChange={set("size")} required />
          </div>
          <div>
            <label className="text-sm font-medium">Št. sob</label>
            <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.beds} onChange={set("beds")} min={0} />
          </div>
          <div>
            <label className="text-sm font-medium">Št. kopalnic</label>
            <input type="number" className="mt-1 w-full rounded-xl border px-3 py-2" value={form.baths} onChange={set("baths")} min={0} />
          </div>
          <div>
            <label className="text-sm font-medium">Tip</label>
            <select className="mt-1 w-full rounded-xl border px-3 py-2" value={form.type} onChange={set("type")}>
              {TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">URL slike</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={form.image} onChange={set("image")} placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Opis</label>
            <textarea rows={3} className="mt-1 w-full rounded-xl border px-3 py-2" value={form.description} onChange={set("description")} />
          </div>
        </div>

        <div className="pt-2 flex gap-2 justify-end">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm rounded-full border hover:bg-gray-100">Prekliči</button>
          <button type="submit" className="px-3 py-1.5 text-sm rounded-full border hover:bg-gray-100">{isEdit ? "Shrani" : "Dodaj"}</button>
        </div>
      </form>
    </div>
  );
}

function placeholderFor(type) {
  if (type === "Hiša") return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop";
  return "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop";
}
