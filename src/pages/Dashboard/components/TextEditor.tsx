import { useState, useRef, useEffect } from 'react';
import '../styles/textEditor.scss';
import { IGraph } from 'src/types';
import { Tooltip } from '@mantine/core';
import {
  Type,
  Bold,
  Italic,
  PaintBucket,
  RotateCw,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalSpaceAround,
  AlignVerticalJustifyCenter,
  AlignVerticalSpaceBetween,
  Palette,
  Droplet,
} from 'lucide-react';


const FONT_FAMILIES = [
  'Arial', 'Roboto', 'Montserrat', 'Poppins', 'Lato',
  'Open Sans', 'Times New Roman', 'Courier New', 'Verdana'
];

const SHADOW_PRESETS = {
  none: 'none',
  subtle: '0 1px 2px rgba(0,0,0,0.25)',
  medium: '1px 2px 4px rgba(0,0,0,0.35)',
  strong: '2px 3px 6px rgba(0,0,0,0.45)',
  glow: '0 0 6px rgba(0,0,0,0.4)',
};

const TextEditor = ({
  setGraphs,
  code,
  isChartTitleChange,
  inputData,
  setShowPicker,
  isPublished,
  onDelete,
  setIsEditing,
  isEditing,
}: any) => {
  const [editableText, setEditableText] = useState('');
  const [fontSize, setFontSize] = useState<number>(inputData?.fontSize || 40);
  const [fontColor, setFontColor] = useState<string>(inputData?.fontColor || '#000000');
  const [isBold, setIsBold] = useState<boolean>(inputData?.isBold || false);
  const [isItalic, setIsItalic] = useState<boolean>(inputData?.isItalic || false);
  const [rotation, setRotation] = useState<number>(inputData?.rotation || 0);
  const [fontFamily, setFontFamily] = useState<string>(inputData?.fontFamily || 'Poppins');
  const [horizontalAlign, setHorizontalAlign] = useState<string>(inputData?.horizontalAlign || 'center');
  const [verticalAlign, setVerticalAlign] = useState<string>(inputData?.verticalAlign || 'center');
  const [borderColor, setBorderColor] = useState<string>(inputData?.borderColor || '#999');
  const [borderWidth, setBorderWidth] = useState<number>(inputData?.borderWidth || 0);
  const [backgroundColor, setBackgroundColor] = useState<string>(inputData?.backgroundColor || 'transparent');
  const [textShadow, setTextShadow] = useState<string>(inputData?.textShadow || '0 1px 2px rgba(0,0,0,0.25)');

  const wrapperRef = useRef<HTMLDivElement>(null);

  const updateGraphStyle = (key: string, value: any) => {
    setGraphs((prev: IGraph[]) =>
      prev.map((g) =>
        g.code === code ? { ...g, data: { ...g.data, [key]: value } } : g
      )
    );
  };

  /** 🔹 Live updates on Mantine card text */
  const applyStyleToCard = (property: string, value: any) => {
    try {
      const cardDisplay = wrapperRef.current
        ?.closest('.vg-textedit--wrap')
        ?.querySelector('.mantine-Card-section .text-display');
      if (cardDisplay) {
        (cardDisplay as HTMLElement).style.setProperty(property, value);
      }
    } catch (err) {
      console.warn('Live style update failed:', err);
    }
  };

  const applyAlignmentToCard = (hAlign: string, vAlign: string) => {
    try {
      const section = wrapperRef.current
        ?.closest('.vg-textedit--wrap')
        ?.querySelector('.mantine-Card-section');
      if (section) {
        const el = section as HTMLElement;
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        el.style.justifyContent =
          vAlign === 'top' ? 'flex-start' :
          vAlign === 'center' ? 'center' : 'flex-end';
        el.style.alignItems =
          hAlign === 'left' ? 'flex-start' :
          hAlign === 'center' ? 'center' : 'flex-end';
        el.style.height = '100%';
        el.style.width = '100%';
      }
    } catch (err) {
      console.warn('Alignment update failed:', err);
    }
  };

  /** 🧩 Handlers */
  const handleTextChange = (val: string) => {
    setEditableText(val);
    updateGraphStyle('title', val);
    updateGraphStyle('query', val);
    updateGraphStyle('questions', val);
  };

  const handleFontSize = (size: number) => {
    setFontSize(size);
    updateGraphStyle('fontSize', size);
    applyStyleToCard('font-size', `${size}px`);
  };

  const handleFontColor = (color: string) => {
    setFontColor(color);
    updateGraphStyle('fontColor', color);
    applyStyleToCard('color', color);
  };

  const toggleBold = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateGraphStyle('isBold', newBold);
    applyStyleToCard('font-weight', newBold ? 'bold' : 'normal');
  };

  const toggleItalic = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateGraphStyle('isItalic', newItalic);
    applyStyleToCard('font-style', newItalic ? 'italic' : 'normal');
  };

  const handleRotate90 = () => {
    const nextRotation = (rotation + 90) % 360;
    setRotation(nextRotation);
    updateGraphStyle('rotation', nextRotation);
    applyStyleToCard('transform', `rotate(${nextRotation}deg)`);
  };

  const handleHorizontalAlign = (value: string) => {
    setHorizontalAlign(value);
    updateGraphStyle('horizontalAlign', value);
    applyAlignmentToCard(value, verticalAlign);
  };

  const handleVerticalAlign = (value: string) => {
    setVerticalAlign(value);
    updateGraphStyle('verticalAlign', value);
    applyAlignmentToCard(horizontalAlign, value);
  };

  const handleBorderWidth = (width: number) => {
    setBorderWidth(width);
    updateGraphStyle('borderWidth', width);
    const borderValue = width ? `${width}px solid ${borderColor}` : 'none';
    applyStyleToCard('border', borderValue);
  };

  const handleBorderColor = (color: string) => {
    setBorderColor(color);
    updateGraphStyle('borderColor', color);
    const borderValue = borderWidth ? `${borderWidth}px solid ${color}` : 'none';
    applyStyleToCard('border', borderValue);
  };

  const handleBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    updateGraphStyle('backgroundColor', color);
    applyStyleToCard('background-color', color);
  };

  const handleTextShadow = (shadow: string) => {
    setTextShadow(shadow);
    updateGraphStyle('textShadow', shadow);
    applyStyleToCard('text-shadow', shadow);
  };

  /** 🧠 Effects */
  useEffect(() => {
    const text = inputData?.title || '';
    setEditableText(text);
  }, [inputData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const textStyle: React.CSSProperties = {
    color: fontColor,
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    fontFamily,
    textShadow,
    transform: `rotate(${rotation}deg)`,
    backgroundColor,
    border: borderWidth ? `${borderWidth}px solid ${borderColor}` : 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    direction: 'ltr',
    unicodeBidi: 'bidi-override' as any, // Changed to bidi-override for stronger enforcement
    textAlign: 'left',
  };

  return (
    <>
      {isEditing && !isPublished && (
        <div className="vg-textedit" ref={wrapperRef}>
<div className="text-toolbar">

  <div className="tool-item" title="Font Size">
    <Type size={16} />
    <input type="range" min={5} max={80} value={fontSize}
      onChange={(e) => handleFontSize(Number(e.target.value))} />
    <span>{fontSize}px</span>
  </div>

  {/* Text Shadow */}
  <div className="tool-item">
    <Tooltip label="Text Shadow" withArrow>
      <Droplet size={18} />
    </Tooltip>
    <select value={textShadow} onChange={(e) => handleTextShadow(e.target.value)}>
      {Object.entries(SHADOW_PRESETS).map(([name, val]) => (
        <option key={name} value={val}>{name}</option>
      ))}
    </select>
  </div>

  {/* Font Family */}
  <div className="font-dropdown">
    <Tooltip label="Font Family" withArrow>
      <button type="button"
        className="font-dropdown-btn"
        onClick={(e) => {
          e.stopPropagation();
          const el = e.currentTarget.nextElementSibling as HTMLElement;
          if (el) el.classList.toggle('show');
        }}>
        {fontFamily}
      </button>
    </Tooltip>
    <div className="font-dropdown-content">
      {FONT_FAMILIES.map((f) => (
        <div key={f} className="font-option" style={{ fontFamily: f }}
          onClick={() => {
            setFontFamily(f);
            updateGraphStyle('fontFamily', f);
            applyStyleToCard('font-family', f);
            const list = document.querySelector('.font-dropdown-content.show');
            if (list) list.classList.remove('show');
          }}>
          {f}
        </div>
      ))}
    </div>
  </div>

  {/* Horizontal Align */}
  <Tooltip label="Horizontal Align" withArrow>
    <div className="tool-item">
      {horizontalAlign === 'left' ? (
        <AlignLeft size={18} onClick={() => handleHorizontalAlign('center')} />
      ) : horizontalAlign === 'center' ? (
        <AlignCenter size={18} onClick={() => handleHorizontalAlign('right')} />
      ) : (
        <AlignRight size={18} onClick={() => handleHorizontalAlign('left')} />
      )}
    </div>
  </Tooltip>

  {/* Vertical Align */}
  <Tooltip label="Vertical Align" withArrow>
    <div className="tool-item">
      {verticalAlign === 'top' ? (
        <AlignVerticalSpaceAround size={18} onClick={() => handleVerticalAlign('center')} />
      ) : verticalAlign === 'center' ? (
        <AlignVerticalJustifyCenter size={18} onClick={() => handleVerticalAlign('bottom')} />
      ) : (
        <AlignVerticalSpaceBetween size={18} onClick={() => handleVerticalAlign('top')} />
      )}
    </div>
  </Tooltip>

  {/* Font Color */}
<Tooltip label="Font Color" withArrow>
  <div className="tool-item">
    <Palette size={18} />
    <input
      type="color"
      value={fontColor}
      onChange={(e) => handleFontColor(e.target.value)}
    />
  </div>
</Tooltip>

{/* Bold / Italic */}
<Tooltip label="Bold" withArrow>
  <Bold size={18} className={isBold ? 'active' : ''} onClick={toggleBold} />
</Tooltip>
<Tooltip label="Italic" withArrow>
  <Italic size={18} className={isItalic ? 'active' : ''} onClick={toggleItalic} />
</Tooltip>

{/* Background */}
<Tooltip label="Background" withArrow>
  <div className="tool-item">
    <PaintBucket size={18} />
    <input
      type="color"
      value={backgroundColor}
      onChange={(e) => handleBackgroundColor(e.target.value)}
    />
  </div>
</Tooltip>

{/* Rotate / Chart / Delete */}
<Tooltip label="Rotate 90°" withArrow>
  <RotateCw size={18} onClick={handleRotate90} className="icon-btn" />
</Tooltip>
<Tooltip label="Chart Color" withArrow>
  <Palette size={18} onClick={() => setShowPicker(true)} className="icon-btn" />
</Tooltip>
<Tooltip label="Remove" withArrow color="red">
  <Trash2 size={18} onClick={() => onDelete(code)} className="icon-btn danger" />
</Tooltip>

</div>
        </div>
      )}
    </>
  );
};

export default TextEditor;
