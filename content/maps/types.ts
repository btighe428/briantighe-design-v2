export type MapNode = {
  label: string;
  children?: MapNode[];
};

export type BranchDef = {
  id: string;
  color: string; // CSS color, used for the branch's subtree
};

export type MapData = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO date
  description: string;
  relatedEssays?: { href: string; title: string }[];
  // Branch colors, in the order the root's children are listed.
  branchColors: string[];
  root: MapNode;
};
