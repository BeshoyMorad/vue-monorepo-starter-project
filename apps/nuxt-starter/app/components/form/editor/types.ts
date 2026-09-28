export interface ToolbarItem {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  isActive?: () => boolean;
  disabled?: () => boolean;
  class?: string;
}
