// Simple resizer utility that injects invisible handles onto an element
// and allows resizing by dragging. It updates element.style.width/height (px).
type Cleanup = () => void;

export function attachResizable(el: HTMLElement, opts?: { minWidth?: number; minHeight?: number }): Cleanup {
  const minWidth = opts?.minWidth ?? 120;
  const minHeight = opts?.minHeight ?? 48;

  const handles = [
    'left',
    'right',
    'top',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];

  const created: HTMLElement[] = [];

  // ensure the element is positioned so absolute handles work
  const prevPosition = el.style.position;
  if (!prevPosition || prevPosition === 'static') {
    el.style.position = 'relative';
  }

  const rect = el.getBoundingClientRect();
  // set initial explicit size so resizing works predictably
  if (!el.style.width) el.style.width = `${Math.round(rect.width)}px`;
  if (!el.style.height) el.style.height = `${Math.round(rect.height)}px`;

  let active: { name: string; startX: number; startY: number; startW: number; startH: number; startMarginLeft: number; startMarginTop: number } | null = null;

  function onPointerMove(e: PointerEvent) {
    if (!active) return;
    const dx = e.clientX - active.startX;
    const dy = e.clientY - active.startY;
    let w = active.startW;
    let h = active.startH;

    if (active.name.includes('right')) {
      w = Math.max(minWidth, Math.round(active.startW + dx));
    }
    if (active.name.includes('left')) {
      w = Math.max(minWidth, Math.round(active.startW - dx));
    }
    if (active.name.includes('bottom')) {
      h = Math.max(minHeight, Math.round(active.startH + dy));
    }
    if (active.name.includes('top')) {
      h = Math.max(minHeight, Math.round(active.startH - dy));
    }

    // apply size
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;

    // If resizing from the left/top, shift the element so resizing feels natural
    const deltaW = Math.round(active.startW - w);
    const deltaH = Math.round(active.startH - h);
    if (active.name.includes('left')) {
      el.style.marginLeft = `${Math.round(active.startMarginLeft + deltaW)}px`;
    }
    if (active.name.includes('top')) {
      el.style.marginTop = `${Math.round(active.startMarginTop + deltaH)}px`;
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (active) {
      (document as any).removeEventListener('pointermove', onPointerMove);
      (document as any).removeEventListener('pointerup', onPointerUp);
      active = null;
    }
  }

  function makeHandle(name: string) {
    const h = document.createElement('div');
    h.className = `resize-handle resize-handle--${name}`;
    h.setAttribute('data-resize-handle', name);
    h.style.position = 'absolute';
    h.style.background = 'transparent';
    h.style.zIndex = '9999';
    // sizing/position via CSS rules (dynamicCard.scss)

    const onPointerDown = (ev: PointerEvent) => {
      ev.preventDefault();
      (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
      active = {
        name,
        startX: ev.clientX,
        startY: ev.clientY,
        startW: el.getBoundingClientRect().width,
        startH: el.getBoundingClientRect().height,
        startMarginLeft: parseFloat(getComputedStyle(el).marginLeft || '0') || 0,
        startMarginTop: parseFloat(getComputedStyle(el).marginTop || '0') || 0,
      };
      (document as any).addEventListener('pointermove', onPointerMove);
      (document as any).addEventListener('pointerup', onPointerUp);
    };

    h.addEventListener('pointerdown', onPointerDown);

    created.push(h);
    el.appendChild(h);
  }

  handles.forEach(makeHandle);

  return () => {
    created.forEach((n) => {
      n.remove();
    });
    (document as any).removeEventListener('pointermove', onPointerMove);
    (document as any).removeEventListener('pointerup', onPointerUp);
    // restore position if we changed it
    if (!prevPosition || prevPosition === 'static') {
      el.style.position = prevPosition || '';
    }
  };
}

export default attachResizable;
