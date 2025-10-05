import { useState, useRef, useEffect } from 'react';
import '../styles/textEditor.scss';

const TitleChart = ({
  code,
  isChartTitleChange,
  inputData,
  setChartCode,
  setTextTilteData,
  setIsEditing,
  isPublished,
}: any) => {
  const [editableText, setEditableText] = useState('');

  const [fontSize, setFontSize] = useState<number>(inputData?.fontSize || 16);
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

  const textStyle: React.CSSProperties = {
    color: fontColor,
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    transform: `rotate(${rotation}deg)`,
  };

  const handleTextEdit = () => {
    setIsEditing(true);
    setChartCode(code);
    setTextTilteData(inputData);
  };
  return (
    <>
      <div
        onClick={() => {
          if (!isPublished) {
            handleTextEdit();
          }
        }}
        className="text-display"
        style={{ ...textStyle, cursor: 'pointer' }}
      >
        {editableText ? editableText : 'Click to edit text'}
      </div>
    </>
  );
};

export default TitleChart;
