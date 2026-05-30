import type { CapitalGainsSummary } from '../types';
import './HarvestCard.css';

interface HarvestCardProps {
  title: string;
  gains: CapitalGainsSummary;
  isAfterHarvest?: boolean;
  showSavings?: boolean;
  savingsAmount?: number;
}

function fmt(n: number, decimals = 2) {
  return Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function HarvestCard({
  title,
  gains,
  isAfterHarvest = false,
  showSavings = false,
  savingsAmount = 0,
}: HarvestCardProps) {
  const netShort = gains.stcg.profits - gains.stcg.losses;
  const netLong = gains.ltcg.profits - gains.ltcg.losses;
  const realised = netShort + netLong;

  const cardClass = isAfterHarvest ? 'card cardAfter' : 'card cardPre';
  const titleClass = isAfterHarvest ? 'title titleAfter' : 'title titlePre';
  const labelClass = isAfterHarvest ? 'label labelAfter' : 'label labelPre';
  const rowLabelClass = isAfterHarvest ? 'rowLabel rowLabelAfter' : 'rowLabel rowLabelPre';
  const rowValueClass = isAfterHarvest ? 'rowValue rowValueAfter' : 'rowValue rowValuePre';
  const footerLabelClass = isAfterHarvest ? 'footerLabel footerLabelAfter' : 'footerLabel footerLabelPre';
  const footerValueClass = isAfterHarvest ? 'footerValue footerValueAfter' : 'footerValue footerValuePre';

  return (
    <div className={cardClass}>
      <h2 className={titleClass}>{title}</h2>

      <div className="headerRow">
        <div />
        <div className={labelClass} style={{ textAlign: 'right' }}>Short-term</div>
        <div className={labelClass} style={{ textAlign: 'right' }}>Long-term</div>
      </div>

      <div className="row">
        <div className={rowLabelClass}>Profits</div>
        <div className={rowValueClass}>$ {fmt(gains.stcg.profits)}</div>
        <div className={rowValueClass}>$ {fmt(gains.ltcg.profits)}</div>
      </div>

      <div className="row">
        <div className={rowLabelClass}>Losses</div>
        <div className={rowValueClass}>- $ {fmt(gains.stcg.losses)}</div>
        <div className={rowValueClass}>- $ {fmt(gains.ltcg.losses)}</div>
      </div>

        <div className="row netRow">        <div className={rowLabelClass} style={{ fontWeight: 700 }}>Net Capital Gains</div>
        <div className={rowValueClass} style={{ fontWeight: 700 }}>
          {netShort < 0 ? '- ' : ''}$ {fmt(netShort)}
        </div>
        <div className={rowValueClass} style={{ fontWeight: 700 }}>
          {netLong < 0 ? '- ' : ''}$ {fmt(netLong)}
        </div>
      </div>

      <div className="footer">
        <span className={footerLabelClass}>
          {isAfterHarvest ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
        </span>
        <span className={footerValueClass}>
          {realised < 0 ? '- ' : ''}${fmt(realised)}
        </span>
      </div>

      {showSavings && savingsAmount > 0 && (
        <div className="savingsBanner">
          <span style={{ fontSize: 18 }}>🎉</span>
          <span style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>
            You are going to save upto{' '}
            <strong style={{ fontWeight: 700 }}>$ {fmt(savingsAmount)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}