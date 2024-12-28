import React from "react";
import { createRoot } from "react-dom/client";
import "./base.scss";

const App = () => {
  const [maxWidth, setMaxWidth] = React.useState(1440);
  const [columns, setColumns] = React.useState(12);
  const [gutterWidth, setGutterWidth] = React.useState(20);
  const [marginWidth, setMarginWidth] = React.useState(20);

  const ensureEvenNumber = (value) => {
    return Math.floor(value / 2) * 2;
  };

  const calculateAdjustedWidth = (width, cols) => {
    const remainingSpace = width % cols;
    if (remainingSpace === 0) return width;
    return width - remainingSpace;
  };

  const adjustedMaxWidth = React.useMemo(() => {
    const width = maxWidth > 1 ? ensureEvenNumber(maxWidth) : maxWidth;
    return calculateAdjustedWidth(width, columns);
  }, [maxWidth, columns]);

  const columnWidth = React.useMemo(() => {
    const totalGutterWidth = (columns - 1) * gutterWidth;
    const totalMarginWidth = 2 * marginWidth;
    const calculatedWidth = (adjustedMaxWidth - totalMarginWidth - totalGutterWidth) / columns;
    return Math.floor(calculatedWidth);
  }, [adjustedMaxWidth, columns, gutterWidth, marginWidth]);

  const handleMaxWidthChange = (e) => {
    if (e.target.value === '') {
      setMaxWidth(0);
      return;
    }
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue)) {
      setMaxWidth(inputValue);
    }
  };

  const handleMaxWidthBlur = () => {
    if (maxWidth > 1) {
      setMaxWidth(ensureEvenNumber(maxWidth));
    }
  };

  const createGrid = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'create-grid',
          data: {
            maxWidth: adjustedMaxWidth,
            columns,
            gutterWidth,
            marginWidth,
            columnWidth
          }
        }
      },
      '*'
    );
  };

  return (
    <div className="grid-calculator">
      <div className="input-section">
        <label>
          Max width
          <div className="input-wrapper">
            <input
              type="number"
              min="1"
              value={maxWidth || ''}
              onChange={handleMaxWidthChange}
              onBlur={handleMaxWidthBlur}
              onFocus={(e) => e.target.select()}
              placeholder="1440"
            />
            <span className="unit">px</span>
          </div>
        </label>

        <label>
          Columns
          <div className="input-wrapper">
            <input
              type="number"
              min="1"
              value={columns}
              onChange={(e) => setColumns(Math.max(1, Number(e.target.value)))}
              onFocus={(e) => e.target.select()}
              placeholder="Enter columns"
            />
            <span className="unit">cols</span>
          </div>
        </label>

        <label>
          Gutter width
          <div className="input-wrapper">
            <input
              type="number"
              min="0"
              value={gutterWidth}
              onChange={(e) => setGutterWidth(Math.max(0, Number(e.target.value)))}
              onFocus={(e) => e.target.select()}
              placeholder="Enter gutter width"
            />
            <span className="unit">px</span>
          </div>
        </label>

        <label>
          Margin width
          <div className="input-wrapper">
            <input
              type="number"
              min="0"
              value={marginWidth}
              onChange={(e) => setMarginWidth(Math.max(0, Number(e.target.value)))}
              onFocus={(e) => e.target.select()}
              placeholder="Enter margin width"
            />
            <span className="unit">px</span>
          </div>
        </label>
      </div>

      <div className="output-section">
        <div className="output-item">
          <span className="output-label">Page width: &nbsp;</span>
          <span className={`value ${adjustedMaxWidth !== maxWidth ? 'adjusted' : ''}`}>
            {adjustedMaxWidth}
          </span>
        </div>
        <div className="output-item">
          <span className="output-label">Column width: &nbsp;</span>
          <span className="value">{Math.round(columnWidth)}</span>
        </div>
      </div>

      <button 
        onClick={createGrid}
        className="create-button"
        disabled={columnWidth <= 0}
      >
        Generate Layout
      </button>
    </div>
  );
};

const container = document.getElementById("plugin");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}