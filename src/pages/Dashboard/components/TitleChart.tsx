import { useState, useRef, useEffect, useMemo } from 'react';
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
  const [fontFamily, setFontFamily] = useState<string>(inputData?.fontFamily || 'Poppins');
  const [horizontalAlign, setHorizontalAlign] = useState<string>(inputData?.horizontalAlign || 'center');
  const [verticalAlign, setVerticalAlign] = useState<string>(inputData?.verticalAlign || 'center');
  const [borderColor, setBorderColor] = useState<string>(inputData?.borderColor || '#999');
  const [borderWidth, setBorderWidth] = useState<number>(inputData?.borderWidth || 0);
  const [backgroundColor, setBackgroundColor] = useState<string>(inputData?.backgroundColor || 'transparent');
  const [textShadow, setTextShadow] = useState<string>(inputData?.textShadow || '0 1px 2px rgba(0,0,0,0.25)');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Use refs to track previous values and prevent unnecessary updates
  const isInternalUpdateRef = useRef(false);
  const skipNextUpdateRef = useRef(false);
  
  // Helper to serialize only text-related properties
  const getTextPropsString = (data: any) => {
    if (!data) return '';
    return JSON.stringify({
      title: data.title || '',
      fontSize: data.fontSize || 16,
      fontColor: data.fontColor || '#000000',
      isBold: data.isBold || false,
      isItalic: data.isItalic || false,
      rotation: data.rotation || 0,
      fontFamily: data.fontFamily || 'Poppins',
      horizontalAlign: data.horizontalAlign || 'center',
      verticalAlign: data.verticalAlign || 'center',
      borderColor: data.borderColor || '#999',
      borderWidth: data.borderWidth || 0,
      backgroundColor: data.backgroundColor || 'transparent',
      textShadow: data.textShadow || '0 1px 2px rgba(0,0,0,0.25)',
      query: data.query || '',
      questions: data.questions || '',
    });
  };

  // Store previous text props string for comparison
  const prevTextPropsStringRef = useRef<string>('');

  useEffect(() => {
    // Skip if this is an internal update to prevent loops
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      if (inputData) {
        prevTextPropsStringRef.current = getTextPropsString(inputData);
      }
      return;
    }

    // Skip if explicitly marked to skip
    if (skipNextUpdateRef.current) {
      skipNextUpdateRef.current = false;
      if (inputData) {
        prevTextPropsStringRef.current = getTextPropsString(inputData);
      }
      return;
    }

    if (!inputData) {
      prevTextPropsStringRef.current = '';
      return;
    }

    // Compare serialized text properties to detect actual changes
    const currentTextPropsString = getTextPropsString(inputData);
    const prevTextPropsString = prevTextPropsStringRef.current;
    
    // If text properties haven't changed, skip ALL updates (including DOM manipulation)
    // This prevents re-renders when only chartColor or other non-text properties change
    if (prevTextPropsString && currentTextPropsString === prevTextPropsString) {
      // Update ref but skip ALL updates to prevent loop
      prevTextPropsStringRef.current = currentTextPropsString;
      return; // Skip update to prevent loop
    }

    // Only update state if values are actually different from current state
    const text = inputData.title || '';
    if (editableText !== text) setEditableText(text);
    const newFontSize = inputData.fontSize || 16;
    if (fontSize !== newFontSize) setFontSize(newFontSize);
    const newFontColor = inputData.fontColor || '#000000';
    if (fontColor !== newFontColor) setFontColor(newFontColor);
    const newIsBold = inputData.isBold || false;
    if (isBold !== newIsBold) setIsBold(newIsBold);
    const newIsItalic = inputData.isItalic || false;
    if (isItalic !== newIsItalic) setIsItalic(newIsItalic);
    const newRotation = inputData.rotation || 0;
    if (rotation !== newRotation) setRotation(newRotation);
    const newFontFamily = inputData.fontFamily || 'Poppins';
    if (fontFamily !== newFontFamily) setFontFamily(newFontFamily);
    const newHorizontalAlign = inputData.horizontalAlign || 'center';
    if (horizontalAlign !== newHorizontalAlign) setHorizontalAlign(newHorizontalAlign);
    const newVerticalAlign = inputData.verticalAlign || 'center';
    if (verticalAlign !== newVerticalAlign) setVerticalAlign(newVerticalAlign);
    const newBorderColor = inputData.borderColor || '#999';
    if (borderColor !== newBorderColor) setBorderColor(newBorderColor);
    const newBorderWidth = inputData.borderWidth || 0;
    if (borderWidth !== newBorderWidth) setBorderWidth(newBorderWidth);
    const newBackgroundColor = inputData.backgroundColor || 'transparent';
    if (backgroundColor !== newBackgroundColor) setBackgroundColor(newBackgroundColor);
    const newTextShadow = inputData.textShadow || '0 1px 2px rgba(0,0,0,0.25)';
    if (textShadow !== newTextShadow) setTextShadow(newTextShadow);
    
    // Set text content directly with LTR direction - ONLY when text actually changed
    // Use requestAnimationFrame to batch DOM updates and prevent re-render loops
    requestAnimationFrame(() => {
      if (boxRef.current && !isEditingLocal) {
        const displayText = text || 'Enter text here';
        if (boxRef.current.textContent !== displayText) {
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
      }
    });

    // Update ref after processing
    prevTextPropsStringRef.current = currentTextPropsString;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Apply alignment styles to parent container via useEffect
  useEffect(() => {
    if (boxRef.current) {
      const parentSection = boxRef.current.closest('.mantine-Card-section');
      if (parentSection) {
        const sectionEl = parentSection as HTMLElement;
        sectionEl.style.display = 'flex';
        sectionEl.style.flexDirection = 'column';
        sectionEl.style.justifyContent = 
          verticalAlign === 'top' ? 'flex-start' :
          verticalAlign === 'center' ? 'center' : 'flex-end';
        sectionEl.style.alignItems = 
          horizontalAlign === 'left' ? 'flex-start' :
          horizontalAlign === 'center' ? 'center' : 'flex-end';
        sectionEl.style.height = '100%';
        sectionEl.style.width = '100%';
      }
    }
  }, [horizontalAlign, verticalAlign]);

  const textStyle: React.CSSProperties = {
    color: fontColor,
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    fontFamily: fontFamily,
    textShadow: textShadow,
    transform: `rotate(${rotation}deg)`,
    backgroundColor: backgroundColor,
    border: borderWidth ? `${borderWidth}px solid ${borderColor}` : 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    direction: 'ltr',
    unicodeBidi: 'bidi-override' as any,
    textAlign: horizontalAlign === 'left' ? 'left' : horizontalAlign === 'center' ? 'center' : 'right',
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
      // Set both flags to prevent the next useEffect from running
      skipNextUpdateRef.current = true;
      isInternalUpdateRef.current = true;
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

  // Sync contentEditable when inputData changes (only when editing)
  useEffect(() => {
    if (boxRef.current && isEditingLocal && !isInternalUpdateRef.current) {
      const text = inputData?.title || '';
      // Only update if text actually changed
      if (boxRef.current.textContent !== text) {
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
    }
  }, [inputData?.title, isEditingLocal]);

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
  // Only update DOM when editableText actually changes, not on every render
  const prevEditableTextRef = useRef<string>('');
  useEffect(() => {
    // Skip if text hasn't actually changed
    if (prevEditableTextRef.current === editableText && !isEditingLocal) {
      return;
    }
    
    if (boxRef.current && !isEditingLocal) {
      const text = editableText || '';
      const displayText = text || 'Enter text here';
      
      // Only update DOM if content actually changed
      if (boxRef.current.textContent !== displayText) {
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
          if (boxRef.current && !isEditingLocal) {
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
        });
      }
      prevEditableTextRef.current = editableText;
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
