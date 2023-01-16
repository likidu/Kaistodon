import type { SvelteComponent } from 'svelte';

type ContextMenuItem = {
  icon?: typeof SvelteComponent;
  imageUrl?: string;
  label: string;
  workingLabel?: string;
  onSelect: () => Promise<void> | void;
};

type ContextMenuShortcut = {
  icon: typeof SvelteComponent;
  label: string;
  onSelect: () => Promise<void> | void;
};

export type ContextMenu = {
  title: string;
  body?: string;
  shortcuts?: ContextMenuShortcut[];
  items: ContextMenuItem[];
  onMenu?: () => void;
};
