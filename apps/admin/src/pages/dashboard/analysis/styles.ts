import type { CSSProperties } from "react";

/**
 * Ported from ant-design-pro-master's dashboard/analysis/style.style.ts
 * (antd-style `createStyles`, token-based). apps/admin doesn't have
 * antd-style installed, so these are plain style objects with the default
 * antd v6 light-theme token values hardcoded. Hover states and the
 * responsive `@media` breakpoints from the original (hiding the sales
 * extra controls / ranking title spacing on small screens) are dropped —
 * inline styles can't express either, and both are cosmetic polish, not
 * structural. Visuals are otherwise equivalent.
 */
const COLOR_TEXT = "rgba(0, 0, 0, 0.88)";
const COLOR_TEXT_SECONDARY = "rgba(0, 0, 0, 0.65)";
const COLOR_PRIMARY = "#1677ff";
const COLOR_BG_CONTAINER_DISABLED = "rgba(0, 0, 0, 0.04)";
const COLOR_BG_SPOTLIGHT = "rgba(0, 0, 0, 0.85)";

export const styles: Record<string, CSSProperties> = {
  currentDate: {
    color: COLOR_PRIMARY,
    fontWeight: "bold",
  },
  trendText: {
    marginLeft: 8,
    color: COLOR_TEXT,
  },
  salesBar: {
    padding: "0 0 32px 32px",
  },
  salesRank: {
    padding: "0 32px 32px 72px",
  },
  rankingTitle: {},
  rankingList: {
    margin: "25px 0 0",
    padding: 0,
    listStyle: "none",
  },
  rankingListItem: {
    display: "flex",
    alignItems: "center",
    marginTop: 16,
  },
  rankingItemNumber: {
    display: "inline-block",
    width: 20,
    height: 20,
    marginTop: 1.5,
    marginRight: 16,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "20px",
    textAlign: "center",
    borderRadius: 20,
    backgroundColor: COLOR_BG_CONTAINER_DISABLED,
  },
  rankingItemNumberActive: {
    display: "inline-block",
    width: 20,
    height: 20,
    marginTop: 1.5,
    marginRight: 16,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "20px",
    textAlign: "center",
    borderRadius: 20,
    color: "#fff",
    backgroundColor: COLOR_BG_SPOTLIGHT,
  },
  rankingItemTitle: {
    flex: 1,
    marginRight: 8,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  salesCardExtra: {
    height: "inherit",
  },
  salesTypeRadio: {
    position: "absolute",
    right: 54,
    bottom: 12,
  },
  salesExtra: {
    display: "inline-block",
    marginRight: 24,
  },
  salesExtraLink: {
    marginLeft: 24,
    color: COLOR_TEXT,
  },
  offlineCard: {},
};

export const iconGroupStyle: CSSProperties = {
  color: COLOR_TEXT_SECONDARY,
  cursor: "pointer",
};
