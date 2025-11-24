import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import productsData from '@/data/products.json';
import styles from './InfiniteMenu.module.css';
import clsx from 'clsx';

type Item = {
  id: string | number;
  title: string;
  image?: string | null;
  href?: string | null;
};

const MAX_ITEMS = 36;

async function fetchSupabaseItems(): Promise<Item[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, image_url, affiliate_link, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(MAX_ITEMS);

    if (error) {
      console.warn('InfiniteMenu: supabase fetch error', error.message || error);
      return null;
    }

    if (!data) return null;

    return data.map((p: any) => ({
      id: p.id,
      title: p.name || 'Untitled',
      image: p.image_url || null,
      href: p.affiliate_link || `/product/${p.id}`,
    }));
  } catch (err) {
    console.warn('InfiniteMenu: supabase fetch failed', err);
    return null;
  }
}

function buildFallback(): Item[] {
  return productsData
    .slice(0, MAX_ITEMS)
    .map((p: any) => ({ id: p.id, title: p.title, image: p.image, href: `/product/${p.id}` }));
}

export default function InfiniteMenu() {
  const [items, setItems] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const remote = await fetchSupabaseItems();
      if (!mounted) return;
      if (remote && remote.length > 0) setItems(remote);
      else setItems(buildFallback());
    })();

    return () => { mounted = false; };
  }, []);

  // duplicate items to create a smooth infinite feel
  const looped = useMemo(() => {
    if (items.length === 0) return [];
    // Ensure an even layout and nice grid by repeating 3x
    const repeats = 3;
    let out: Item[] = [];
    for (let i = 0; i < repeats; i++) out = out.concat(items);
    // limit a bit for perf
    return out.slice(0, MAX_ITEMS * 2);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className={clsx(styles.container, 'pointer-events-auto') + ' z-[70]'}>
      <div className={styles.topbar}>
        <div className="flex items-center gap-3">
          <button
            aria-label={isOpen ? 'Close product explorer' : 'Open product explorer'}
            onClick={() => setIsOpen(v => !v)}
            className="rounded-full bg-white/5 hover:bg-white/10 text-white px-3 py-1 text-sm border border-white/5"
          >
            {isOpen ? 'Hide' : 'Explore'} Products
          </button>
          <div className="text-xs text-muted-foreground">Quick browse — images link to product pages</div>
        </div>
      </div>

      <div className={clsx(styles.stage, isOpen ? styles.open : styles.closed)}>
        <div className={styles.ring} aria-hidden>
          {looped.map((it, idx) => (
            <a
              key={`${String(it.id)}-${idx}`}
              href={it.href || `/product/${it.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.item}
              title={it.title}
            >
              <img
                alt={it.title}
                src={it.image ?? '/placeholder-200.png'}
                loading="lazy"
                className={styles.itemImg}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
