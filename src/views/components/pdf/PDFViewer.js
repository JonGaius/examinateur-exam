import React from 'react';
// Import the main component
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({url}) => {
    return (
        <Viewer fileUrl={url} />
    );
};

export default PDFViewer;