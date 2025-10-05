import { useState, useRef, useEffect } from 'react';
import '../styles/textEditor.scss';
import { IGraph } from 'src/types'; 

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
  // const [isEditing, setIsEditing] = useState(false);
  const [fontSize, setFontSize] = useState<number>(inputData?.fontSize || 40);
  const [fontColor, setFontColor] = useState<string>(
    inputData?.fontColor || '#000000'
  );
  const [isBold, setIsBold] = useState<boolean>(inputData?.isBold || false);
  const [isItalic, setIsItalic] = useState<boolean>(
    inputData?.isItalic || false
  );
  const [rotation, setRotation] = useState<number>(inputData?.rotation || 0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditableText(inputData?.title);
    setFontSize(inputData?.fontSize || 16);
    setFontColor(inputData?.fontColor || '#000000');
    setIsBold(inputData?.isBold || false);
    setIsItalic(inputData?.isItalic || false);
    setRotation(inputData?.rotation || 0);
  }, [inputData]);

  useEffect(() => {
    if (isChartTitleChange && boxRef.current) {
      boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isChartTitleChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateGraphStyle = (key: string, value: any) => {
    setGraphs((prev: IGraph[]) =>
      prev.map((g) =>
        g.code === code
          ? {
              ...g,
              data: {
                ...g.data,
                [key]: value,
              },
            }
          : g
      )
    );
  };

  const handleTextChange = (val: string) => {
    setEditableText(val);
    updateGraphStyle('title', val);
    updateGraphStyle('query', val);
    updateGraphStyle('questions', val);
  };

  const handleFontSize = (size: number) => {
    setFontSize(size);
    updateGraphStyle('fontSize', size);
  };

  const handleFontColor = (color: string) => {
    setFontColor(color);
    updateGraphStyle('fontColor', color);
  };

  const toggleBold = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    updateGraphStyle('isBold', newBold);
  };

  const toggleItalic = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    updateGraphStyle('isItalic', newItalic);
  };

  const handleRotate90 = () => {
    const nextRotation = (rotation + 90) % 360;
    setRotation(nextRotation);
    updateGraphStyle('rotation', nextRotation);
  };

  const textStyle: React.CSSProperties = {
    color: fontColor,
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <>
     { isEditing && !isPublished &&<div className="vg-textedit" ref={wrapperRef}>
        {/* Toolbar */}
        {/* {isEditing && !isPublished && ( */}
          <div className="vg-textedit--tool text-toolbar">
            <label>
              Size:
              <input
                type="range"
                min={5}
                max={50}
                value={fontSize}
                onChange={(e) => handleFontSize(Number(e.target.value))}
              />
              {fontSize}px
            </label>

            <input
              type="color"
              className="no-drag-color"
              value={fontColor}
              onChange={(e) => handleFontColor(e.target.value)}
            />

            <button
              onClick={toggleBold}
              className="no-drag-bold"
              style={{
                fontWeight: isBold ? 'bold' : 'normal',
              }}
            >
              B
            </button>

            <button
              className="no-drag-italic"
              onClick={toggleItalic}
              style={{
                fontStyle: isItalic ? 'italic' : 'normal',
              }}
            >
              I
            </button>
            <button onClick={() => setShowPicker(true)}>Chart Color</button>
            {isEditing && !isPublished && (
              <>
                <button onClick={handleRotate90}>Rotate</button>
                <button onClick={() => onDelete(code)}>Remove</button>
              </>
            )}
          </div>
        {/* )} */}

        {/* Text Box */}
        <div ref={boxRef} className="vg-textedit--textbox">
          {isEditing && !isPublished && (
            <textarea
              value={editableText}
              autoFocus
              onChange={(e) => handleTextChange(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="text-area"
            />
          )}
        </div>
      </div>}
    </>
  );
};

export default TextEditor;
