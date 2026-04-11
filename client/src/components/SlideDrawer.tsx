import type { ReactNode } from "react";

type SlideDrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export function SlideDrawer({ open, title, subtitle, onClose, children }: SlideDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>关闭</button>
        </div>
        <div className="drawer-content">{children}</div>
      </aside>
    </div>
  );
}