figma.showUI(__html__, { themeColors: true, width: 248, height: 278 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-grid') {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    const { maxWidth, columns, gutterWidth, marginWidth, columnWidth } = msg.data;
    
    // Create a frame
    const frame = figma.createFrame();
    frame.name = `Layout - ${maxWidth}`;
    frame.resize(maxWidth, 100);
    frame.clipsContent = true;

    // Find the lowest y-coordinate among existing frames
    let maxY = 0;
    figma.currentPage.children.forEach(node => {
      if (node.type === "FRAME") {
        const bottomY = node.y + node.height;
        maxY = Math.max(maxY, bottomY);
      }
    });

    // Position the new frame below others
    frame.y = maxY + 48;
    
    let xPosition = 0;

    // Create left margin only if marginWidth > 0
    if (marginWidth > 0) {
      const leftMargin = figma.createRectangle();
      leftMargin.name = "Left Margin";
      leftMargin.x = 0;
      leftMargin.resize(marginWidth, frame.height);
      leftMargin.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      frame.appendChild(leftMargin);

      // Add margin width text
      const marginText = figma.createText();
      marginText.characters = String(marginWidth);
      marginText.textAlignHorizontal = "CENTER";
      marginText.textAlignVertical = "CENTER";
      marginText.fontSize = 10;
      frame.appendChild(marginText);
      
      // Center the text
      marginText.x = (marginWidth - marginText.width) / 2;
      marginText.y = (frame.height - marginText.height) / 2;

      xPosition = marginWidth;
    }

    for (let i = 0; i < columns; i++) {
      // Create column
      const column = figma.createRectangle();
      column.name = `Column ${i + 1}`;
      column.x = xPosition;
      column.resize(Math.floor(columnWidth), frame.height);
      column.fills = [{ type: 'SOLID', color: { r: 1, g: 0.9412, b: 0.8627 } }];
      frame.appendChild(column);

      // Add column width text
      const columnText = figma.createText();
      columnText.characters = String(Math.floor(columnWidth));
      columnText.textAlignHorizontal = "CENTER";
      columnText.textAlignVertical = "CENTER";
      columnText.fontSize = 10;
      frame.appendChild(columnText);
      
      // Center the text
      columnText.x = xPosition + (columnWidth - columnText.width) / 2;
      columnText.y = (frame.height - columnText.height) / 2;

      xPosition += columnWidth;

      // Create gutter if not the last column and gutterWidth > 0
      if (i < columns - 1 && gutterWidth > 0) {
        const gutter = figma.createRectangle();
        gutter.name = `Gutter ${i + 1}`;
        gutter.x = xPosition;
        gutter.resize(gutterWidth, frame.height);
        gutter.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        frame.appendChild(gutter);

        // Add gutter width text
        const gutterText = figma.createText();
        gutterText.characters = String(gutterWidth);
        gutterText.textAlignHorizontal = "CENTER";
        gutterText.textAlignVertical = "CENTER";
        gutterText.fontSize = 10;
        frame.appendChild(gutterText);
        
        // Center the text
        gutterText.x = xPosition + (gutterWidth - gutterText.width) / 2;
        gutterText.y = (frame.height - gutterText.height) / 2;

        xPosition += gutterWidth;
      }
    }

    // Create right margin only if marginWidth > 0
    if (marginWidth > 0) {
      const rightMargin = figma.createRectangle();
      rightMargin.name = "Right Margin";
      rightMargin.x = maxWidth - marginWidth;
      rightMargin.resize(marginWidth, frame.height);
      rightMargin.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      frame.appendChild(rightMargin);

      // Add margin width text
      const marginText = figma.createText();
      marginText.characters = String(marginWidth);
      marginText.textAlignHorizontal = "CENTER";
      marginText.textAlignVertical = "CENTER";
      marginText.fontSize = 10;
      frame.appendChild(marginText);
      
      // Center the text
      marginText.x = maxWidth - marginWidth + (marginWidth - marginText.width) / 2;
      marginText.y = (frame.height - marginText.height) / 2;
    }

    // Add total width text at the top
    const totalWidthText = figma.createText();
    totalWidthText.characters = String(maxWidth);
    totalWidthText.x = 0;
    totalWidthText.y = -40;
    totalWidthText.fontSize = 12;
    frame.appendChild(totalWidthText);

    // Select and zoom to the frame
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
  }
};