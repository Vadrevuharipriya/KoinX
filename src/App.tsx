import { useEffect, useMemo, useState } from 'react';
import { fetchCapitalGains, fetchHoldings } from './api/mockApi';
import type { CapitalGainsSummary, HoldingItem } from './types';
import { HarvestCard } from './components/HarvestCard';
import { HoldingsTable } from './components/HoldingsTable';

function calculateAfterHarvesting(
  base: CapitalGainsSummary,
  selectedHoldings: HoldingItem[]
): CapitalGainsSummary {
  const adjusted: CapitalGainsSummary = {
    stcg: { profits: base.stcg.profits, losses: base.stcg.losses },
    ltcg: { profits: base.ltcg.profits, losses: base.ltcg.losses },
  };

  selectedHoldings.forEach((holding) => {
    if (holding.stcg.gain > 0) {
      adjusted.stcg.profits += holding.stcg.gain;
    } else {
      adjusted.stcg.losses += Math.abs(holding.stcg.gain);
    }
    if (holding.ltcg.gain > 0) {
      adjusted.ltcg.profits += holding.ltcg.gain;
    } else {
      adjusted.ltcg.losses += Math.abs(holding.ltcg.gain);
    }
  });

  return adjusted;
}

function netRealised(gains: CapitalGainsSummary) {
  return (
    gains.stcg.profits - gains.stcg.losses + (gains.ltcg.profits - gains.ltcg.losses)
  );
}

export default function App() {
  const [holdings, setHoldings] = useState<HoldingItem[]>([]);
  const [capitalGains, setCapitalGains] = useState<CapitalGainsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [viewAll, setViewAll] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([h, g]) => {
        setHoldings(h);
        setCapitalGains(g);
      })
      .catch(() => setError('Unable to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const selectedHoldings = useMemo(
    () => [...selectedRows].map((i) => holdings[i]).filter(Boolean),
    [selectedRows, holdings]
  );

  const afterHarvesting = useMemo(() => {
  if (!capitalGains) return null;

  return calculateAfterHarvesting(
    capitalGains,
    selectedHoldings
  );
}, [capitalGains, selectedHoldings]);

  const preRealised = useMemo(() => (capitalGains ? netRealised(capitalGains) : 0), [capitalGains]);
  const afterRealised = useMemo(
    () => (afterHarvesting ? netRealised(afterHarvesting) : 0),
    [afterHarvesting]
  );
  const savings = parseFloat(Math.max(0, preRealised - afterRealised).toFixed(2));

  const allSelected = holdings.length > 0 && selectedRows.size === holdings.length;
  const someSelected = selectedRows.size > 0 && !allSelected;

  const toggleRow = (index: number) => {
    setSelectedRows((current) => {
      const next = new Set(current);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedRows(
      allSelected ? new Set() : new Set(holdings.map((_, i) => i))
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#eef3fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: '#475569',
          fontSize: 16,
        }}
      >
        Loading tax harvesting data...
      </div>
    );
  }

  if (error || !capitalGains) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#eef3fb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#dc2626',
            padding: 24,
            borderRadius: 12,
          }}
        >
          {error ?? 'Failed to load dashboard.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef3fb', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav
        className='navbar'
      >
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/logo.png"
            alt="KoinX Logo"
            style={{ width: 96, height: 24 }}
          />
        </div>
      </nav>

      {/* ── Page body ── */}
      <div className="page-body">

        {/* Page title */}
        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <h1 className="tax-header">
            Tax Harvesting
        </h1>

        <div style={{ position: 'relative', display: 'inline-block' }}>
            <a
            href="#"
            style={{
                color: '#1557e7',
                textDecoration: 'underline',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => e.preventDefault()}
            >
            How it works?
            </a>

            {showTooltip && (
            <div
                style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                left: 0,
                width: 410,
                background: '#08122d',
                color: '#ffffff',
                borderRadius: 16,
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '20px',
                zIndex: 9999,
                boxShadow: '0px 8px 24px rgba(0,0,0,0.18)',
                }}
            >
                <div
                style={{
                    position: 'absolute',
                    top: -7,
                    left: 22,
                    width: 14,
                    height: 14,
                    background: '#08122d',
                    transform: 'rotate(45deg)',
                }}
                />

                Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh
                semper mattis scelerisque tellus. Vel mattis diam duis morbi tellus
                dui consectetur.{' '}
                <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                    color: '#79A9FF',
                    textDecoration: 'underline',
                    fontWeight: 500,
                }}
                >
                Know More
                </a>
            </div>
            )}
        </div>
        </div>
        {/* Info banner */}
        <div
          style={{
            background: '#eaf2ff',
            border: '1px solid #0052fe',
            borderRadius: 10,
            padding: bannerOpen ? '12px 16px' : '10px 16px',
            marginBottom: 24,
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '2px solid #0052fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0052fe',
                fontWeight: 800,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              i
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ color: '#0052fe', fontSize: 13, fontWeight: 700 }}>
                  Important Notes & Disclaimers
                </strong>
                <button
                  type="button"
                  onClick={() => setBannerOpen((p) => !p)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0052fe',
                    fontSize: 16,
                    padding: 0,
                    lineHeight: 1,
                    marginLeft: 12,
                  }}
                >
                  {bannerOpen ? '▲' : '▼'}
                </button>
              </div>
              {bannerOpen && (
                <ul style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 13, lineHeight: 1.7, color: '#334155' }}>
                  <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
                  <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
                  <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
                  <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
                  <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Harvest cards */}
        <div className="cards-grid">
          <HarvestCard title="Pre Harvesting" gains={capitalGains} />
          <HarvestCard
            title="After Harvesting"
            gains={afterHarvesting ?? capitalGains}
            isAfterHarvest = {true}
            showSavings={savings > 0}
            savingsAmount={savings}
          />
        </div>

        {/* Holdings table */}
        <HoldingsTable
          holdings={holdings}
          selected={selectedRows}
          onToggle={toggleRow}
          onToggleAll={toggleAll}
          allSelected={allSelected}
          someSelected={someSelected}
          viewAll={viewAll}
          onViewAll={() => setViewAll((p) => !p)}
        />
      </div>
    </div>
  );
}