import { useState, useRef, useEffect } from 'react';
import { IGraph } from 'src/types';
import '../styles/textEditor.scss';

const TitleChart = ({
  code,
  isChartTitleChange,
  inputData,
  setChartCode,
  setTextTilteData,
  setIsEditing,
  isPublished,
  setGraphs,
}: any) => {
  const [editableText, setEditableText] = useState('');
  const [isEditingLocal, setIsEditingLocal] = useState(false);

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
    const text = inputData?.title || '';
    setEditableText(text);
    setFontSize(inputData?.fontSize || 16);
    setFontColor(inputData?.fontColor || '#000000');
    setIsBold(inputData?.isBold || false);
    setIsItalic(inputData?.isItalic || false);
    setRotation(inputData?.rotation || 0);
    
    // Set text content directly with LTR direction
    if (boxRef.current) {
      const displayText = text || 'Enter text here';
      boxRef.current.innerHTML = '';
      const textNode = document.createTextNode(displayText);
      boxRef.current.appendChild(textNode);
      boxRef.current.setAttribute('dir', 'ltr');
      boxRef.current.setAttribute('lang', 'en');
      boxRef.current.style.direction = 'ltr';
      boxRef.current.style.unicodeBidi = 'bidi-override';
      
      // Add placeholder styling when empty
      if (!text) {
        boxRef.current.classList.add('text-placeholder');
      } else {
        boxRef.current.classList.remove('text-placeholder');
      }
    }
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
        setIsEditingLocal(false);
        if (typeof setIsEditing === 'function') {
          setIsEditing(false);
        }
      }
    };

    if (isEditingLocal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditingLocal, setIsEditing]);

  const textStyle: React.CSSProperties = {
    color: fontColor,
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    transform: `rotate(${rotation}deg)`,
    direction: 'ltr',
    unicodeBidi: 'bidi-override' as any, // Changed to bidi-override for stronger enforcement
    textAlign: 'left',
  };

  const handleTextEdit = () => {
    setIsEditingLocal(true);
    if (typeof setIsEditing === 'function') {
      setIsEditing(true);
    }
    setChartCode(code);
    // `setTextTilteData` is optional — guard the call to avoid runtime errors
    if (typeof setTextTilteData === 'function') {
      setTextTilteData(inputData);
    }
  };

  // Update graph data when text changes
  const updateGraphTitle = (newText: string) => {
    // Ensure title is always a string, never undefined or null
    const titleValue = newText || '';
    setEditableText(titleValue);
    // Update the graph's data.title in the graphs array
    if (setGraphs && code) {
      setGraphs((prev: IGraph[]) =>
        prev.map((g) =>
          g.code === code
            ? {
                ...g,
                data: {
                  ...g.data,
                  title: titleValue,
                },
              }
            : g
        )
      );
    }
  };

  const handleTextChange = (newText: string) => {
    updateGraphTitle(newText);
  };

  // Sync contentEditable when inputData changes
  useEffect(() => {
    if (boxRef.current && isEditingLocal) {
      const text = inputData?.title || '';
      // Clear and set text using innerHTML with explicit LTR direction
      boxRef.current.innerHTML = '';
      const textNode = document.createTextNode(text);
      boxRef.current.appendChild(textNode);
      boxRef.current.setAttribute('dir', 'ltr');
      boxRef.current.setAttribute('lang', 'en');
      // Force direction via style
      boxRef.current.style.direction = 'ltr';
      boxRef.current.style.unicodeBidi = 'bidi-override';
      boxRef.current.style.textAlign = 'left';
    }
  }, [inputData, isEditingLocal]);

  // Force LTR direction when editing starts
  useEffect(() => {
    if (boxRef.current && isEditingLocal) {
      // Aggressively set direction properties
      boxRef.current.setAttribute('dir', 'ltr');
      boxRef.current.setAttribute('lang', 'en');
      boxRef.current.style.direction = 'ltr';
      boxRef.current.style.unicodeBidi = 'bidi-override';
      boxRef.current.style.textAlign = 'left';
      boxRef.current.style.writingMode = 'horizontal-tb';
      boxRef.current.style.textOrientation = 'mixed';
      
      // Set cursor to end of text when editing starts (only if no cursor position exists)
      setTimeout(() => {
        if (boxRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount === 0) {
            const range = document.createRange();
            range.selectNodeContents(boxRef.current);
            range.collapse(false); // false = collapse to end
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }, 0);
    }
  }, [isEditingLocal]);

  // Ensure text displays correctly when not editing
  useEffect(() => {
    if (boxRef.current && !isEditingLocal) {
      const text = editableText || '';
      const displayText = text || 'Enter text here';
      // Clear and set text using innerHTML with explicit LTR direction
      boxRef.current.innerHTML = '';
      const textNode = document.createTextNode(displayText);
      boxRef.current.appendChild(textNode);
      boxRef.current.setAttribute('dir', 'ltr');
      boxRef.current.setAttribute('lang', 'en');
      // Force direction via style
      boxRef.current.style.direction = 'ltr';
      boxRef.current.style.unicodeBidi = 'bidi-override';
      
      // Add placeholder styling when empty
      if (!text) {
        boxRef.current.classList.add('text-placeholder');
      } else {
        boxRef.current.classList.remove('text-placeholder');
      }
    }
  }, [editableText, isEditingLocal]);

  // Check for dragging state and show placeholder during drag
  useEffect(() => {
    const checkDragging = () => {
      if (boxRef.current && !isEditingLocal) {
        const parentGridItem = boxRef.current.closest('.react-grid-item');
        const isDragging = parentGridItem?.classList.contains('react-draggable-dragging');
        const currentText = boxRef.current.textContent || '';
        const isEmpty = !editableText || editableText.trim() === '';
        
        if (isDragging && isEmpty) {
          // During dragging, always show placeholder if text is empty
          boxRef.current.innerHTML = '';
          const textNode = document.createTextNode('Enter text here');
          boxRef.current.appendChild(textNode);
          boxRef.current.classList.add('text-placeholder');
          boxRef.current.setAttribute('dir', 'ltr');
          boxRef.current.style.direction = 'ltr';
          boxRef.current.style.unicodeBidi = 'bidi-override';
        } else if (!isDragging && isEmpty) {
          // When not dragging and text is empty, show placeholder
          if (currentText !== 'Enter text here') {
            boxRef.current.innerHTML = '';
            const textNode = document.createTextNode('Enter text here');
            boxRef.current.appendChild(textNode);
            boxRef.current.classList.add('text-placeholder');
          }
        }
      }
    };

    // Check periodically for dragging state (more frequent during potential drag)
    const interval = setInterval(checkDragging, 50);
    
    return () => {
      clearInterval(interval);
    };
  }, [editableText, isEditingLocal]);

  return (
    <>
      <div
        ref={boxRef}
        onClick={() => {
          if (!isPublished && !isEditingLocal) {
            handleTextEdit();
          }
        }}
        className={`text-display ${isEditingLocal ? 'text-display-editable' : ''}`}
        contentEditable={isEditingLocal}
        suppressContentEditableWarning={true}
        dir="ltr"
        lang="en"
        onInput={(e) => {
          if (isEditingLocal) {
            const target = e.currentTarget;
            const newText = target.innerText || target.textContent || '';
            
            // Save cursor position before any state updates
            const selection = window.getSelection();
            let savedRange: Range | null = null;
            if (selection && selection.rangeCount > 0) {
              savedRange = selection.getRangeAt(0).cloneRange();
            }
            
            // Update state
            handleTextChange(newText);
            
            // Set direction/style properties without touching text content
            target.setAttribute('dir', 'ltr');
            target.setAttribute('lang', 'en');
            target.style.direction = 'ltr';
            target.style.unicodeBidi = 'bidi-override';
            target.style.textAlign = 'left';
            target.style.writingMode = 'horizontal-tb';
            
            // Restore cursor position immediately after DOM updates
            requestAnimationFrame(() => {
              if (target && selection && savedRange) {
                try {
                  // Try to restore the exact cursor position
                  const textNode = savedRange.startContainer;
                  if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.parentNode === target) {
                    const offset = savedRange.startOffset;
                    const newRange = document.createRange();
                    newRange.setStart(textNode, Math.min(offset, textNode.textContent?.length || 0));
                    newRange.setEnd(textNode, Math.min(offset, textNode.textContent?.length || 0));
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                  } else {
                    // Fallback: move cursor to end
                    const fallbackRange = document.createRange();
                    const textNode = target.firstChild;
                    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                      fallbackRange.setStart(textNode, textNode.textContent?.length || 0);
                      fallbackRange.setEnd(textNode, textNode.textContent?.length || 0);
                    } else {
                      fallbackRange.selectNodeContents(target);
                      fallbackRange.collapse(false);
                    }
                    selection.removeAllRanges();
                    selection.addRange(fallbackRange);
                  }
                } catch (err) {
                  // Final fallback: move cursor to end
                  try {
                    const fallbackRange = document.createRange();
                    fallbackRange.selectNodeContents(target);
                    fallbackRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(fallbackRange);
                  } catch (e) {
                    // Ignore errors
                  }
                }
              }
            });
          }
        }}
        onBlur={() => {
          if (isEditingLocal && boxRef.current) {
            const finalText = boxRef.current.innerText || boxRef.current.textContent || '';
            // Update both local state and graph data
            updateGraphTitle(finalText);
            boxRef.current.setAttribute('dir', 'ltr');
            setIsEditingLocal(false);
            if (typeof setIsEditing === 'function') {
              setIsEditing(false);
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            boxRef.current?.blur();
          }
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          if (isEditingLocal) {
            e.stopPropagation();
          }
        }}
        style={{ 
          ...textStyle, 
          cursor: isEditingLocal ? 'text' : 'pointer',
          direction: 'ltr',
          unicodeBidi: 'bidi-override' as any,
          textAlign: 'left',
          writingMode: 'horizontal-tb',
          textOrientation: 'mixed',
        } as React.CSSProperties}
      >
        {/* Text content is set via useEffect to ensure proper direction */}
      </div>
    </>
  );
};

export default TitleChart;
