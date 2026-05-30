export interface StcgLtcgData {
  balance: number;
  gain: number;
}

export interface HoldingItem {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: StcgLtcgData;
  ltcg: StcgLtcgData;
}

export interface CapitalGainsSummary {
  stcg: {
    profits: number;
    losses: number;
  };
  ltcg: {
    profits: number;
    losses: number;
  };
}