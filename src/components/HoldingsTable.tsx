import { useState } from 'react';
import type { HoldingItem } from '../types';
import './HoldingsTable.css';

interface HoldingsTableProps {
  holdings: HoldingItem[];
  selected: Set<number>;
  onToggle: (index: number) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  viewAll: boolean;
  onViewAll: () => void;
}

const COIN_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  USDT: '#26A17B',
  USDC: '#2775CA',
  MATIC: '#8247E5',
  WPOL: '#8247E5',
  SOL: '#9945FF',
  LINK: '#2A5ADA',
  FTM: '#1969FF',
  default: '#1557e7',
};

function fmt(n: number, decimals = 2) {
  return Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function CoinIcon({
  coin,
  logo,
}: {
  coin: string;
  logo: string;
}) {
  return (
    <img
      src={logo}
      alt={coin}
      className="coinIcon"
      onError={(e) => {
        e.currentTarget.src =
          'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
      }}
    />
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
}

function Checkbox({ checked, onChange, indeterminate = false }: CheckboxProps) {
  const boxClass = checked
    ? 'checkboxBox checkboxChecked'
    : 'checkboxBox checkboxUnchecked';

  return (
    <label className="checkboxWrapper">
      <input type="checkbox" checked={checked} onChange={onChange} className="checkboxInput" />
      <span className={boxClass}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!checked && indeterminate && <span className="checkboxIndeterminate" />}
      </span>
    </label>
  );
}

interface GainValueProps {
  gain: number;
  balance: number;
  coin: string;
}

function GainValue({ gain, balance, coin }: GainValueProps) {
  const pos = gain >= 0;
  return (
    <div className="gainValue">
      <div className={pos ? 'gainPositive' : 'gainNegative'}>
        {pos ? '+' : '-'}${fmt(gain)}
      </div>
      <div className="gainBalance">
        {Math.abs(balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} {coin}
      </div>
    </div>
  );
}

export function HoldingsTable({
  holdings,
  selected,
  onToggle,
  onToggleAll,
  allSelected,
  someSelected,
  viewAll,
  onViewAll,
}: HoldingsTableProps) {
  const visible = viewAll ? holdings : holdings.slice(0, 6);

const [sortField, setSortField] = useState<'stcg' | 'ltcg' | null>(null);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

const handleSort = (field: 'stcg' | 'ltcg') => {
  if (sortField === field) {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  } else {
    setSortField(field);
    setSortDirection('desc');
  }
};

const sortedVisible = [...visible];

if (sortField) {
  sortedVisible.sort((a, b) => {
    const aValue = sortField === 'stcg'
      ? a.stcg.gain
      : a.ltcg.gain;

    const bValue = sortField === 'stcg'
      ? b.stcg.gain
      : b.ltcg.gain;

    return sortDirection === 'asc'
      ? aValue - bValue
      : bValue - aValue;
  });
}

  return (
    <div className="tableSection">
      <h2 className="tableHeader">Holdings</h2>

      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="th thCheckbox">
                <Checkbox checked={allSelected} indeterminate={someSelected} onChange={onToggleAll} />
              </th>
                <th className="th thAsset">Asset</th>
                <th className="th thHoldings">
                <div className="holdingsHeader">
                    <div className="holdingsTitle">Holdings</div>
                    <div className="thSubLabel">Current Market Rate</div>
                </div>
                </th>

                <th className="th thRight">Total Current Value</th>
                <th
                className="th thRight sortable"
                onClick={() => handleSort('stcg')}
                >
                <span className="sortableLabel">
                    Short-term
                    <span className="sortIcon">
                    {sortField === 'stcg'
                        ? (sortDirection === 'asc' ? '↑' : '↓')
                        : '↑'}
                    </span>
                </span>
                </th>

                <th
                className="th thRight sortable"
                onClick={() => handleSort('ltcg')}
                >
                <span className="sortableLabel">
                    Long-Term
                    <span className="sortIcon">
                    {sortField === 'ltcg'
                        ? (sortDirection === 'asc' ? '↑' : '↓')
                        : '↑'}
                    </span>
                </span>
                </th>
                <th className="th thRight">Amount to Sell</th>
                </tr>
            </thead>
          <tbody>
            {sortedVisible.map((h) => {
              const globalIdx = holdings.indexOf(h);
              const isSel = selected.has(globalIdx);
              const totalVal = h.currentPrice * h.totalHolding;

              return (
                <tr
                  key={globalIdx}
                  className={isSel ? 'selectedRow' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onToggle(globalIdx)}
                >
                  <td className="td tdRight" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSel} onChange={() => onToggle(globalIdx)} />
                  </td>

                  <td className="td">
                    <div className="assetCell">
                      <CoinIcon
                        coin={h.coin}
                        logo={h.logo}
                    />
                      <div>
                        <div className="coinName">{h.coin}</div>
                        <div className="coinSubtitle">{h.coinName}</div>
                      </div>
                    </div>
                  </td>

                  <td className="td tdRight">
                    <div className="holdingsValue">
                      {h.totalHolding.toLocaleString(undefined, { maximumFractionDigits: 6 })} {h.coin}
                    </div>
                    <div className="holdingsRate">
                      $ {fmt(h.currentPrice)}/{h.coin}
                    </div>
                  </td>

                  <td className="td tdRight" style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                    $ {fmt(totalVal)}
                  </td>

                  <td className="td">
                    <GainValue gain={h.stcg.gain} balance={h.stcg.balance} coin={h.coin} />
                  </td>

                  <td className="td">
                    <GainValue gain={h.ltcg.gain} balance={h.ltcg.balance} coin={h.coin} />
                  </td>

                  <td className="td tdRight" style={{ fontWeight: 600, fontSize: 14 }}>
                    <span className={isSel ? 'amountSell amountSellSelected' : 'amountSell amountSellPlaceholder'}>
                      {isSel
                        ? `${h.totalHolding.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${h.coin}`
                        : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > 6 && (
        <button type="button" onClick={onViewAll} className="viewAllBtn">
          {viewAll ? 'Show less' : 'View all'}
        </button>
      )}
    </div>
  );
}