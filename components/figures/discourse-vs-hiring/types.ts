export type GapRow = {
  slug: string;
  label: string;
  category: "ai" | "design-process" | "tooling" | "growth-pm" | "emergent";
  influencerShare: number;
  jdShare: number;
  gapRatio: number;
  logGap: number;
  influencerCount: number;
  jdCount: number;
};

export type ExcludedTopic = {
  slug: string;
  label: string;
  reason: "sample-size" | "zero-jd-share";
  influencerCount: number;
  jdCount: number;
};

export type GapReport = {
  snapshotDate: string;
  windowWeeks: 12 | 26 | 52;
  windowStart: string;
  windowEnd: string;
  totalPosts: number;
  totalJds: number;
  rows: GapRow[];
  excluded: ExcludedTopic[];
};
