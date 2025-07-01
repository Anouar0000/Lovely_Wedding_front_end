// src/components/canvas/FinalPDFDocument.js

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import RenderCardPage from './RenderCardPage'; // <-- IMPORT THE NEW COMPONENT

// --- FONT REGISTRATION (UNCHANGED) ---
Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: '/fonts/PlayfairDisplay-Regular.ttf' },
    { src: '/fonts/PlayfairDisplay-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/PlayfairDisplay-Italic.ttf', fontStyle: 'italic' },
    { src: '/fonts/PlayfairDisplay-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
  ]
});
Font.register({ family: 'Pinyon Script', src: '/fonts/PinyonScript-Regular.ttf' });
Font.register({ family: 'Amiri Quran', src: '/fonts/AmiriQuran-Regular.ttf' });
Font.register({ family: 'Josefin Sans', src: '/fonts/JosefinSans-VariableFont_wght.ttf' });
Font.register({ family: 'Urbanist', src: '/fonts/Urbanist-VariableFont_wght.ttf' });
Font.register({ family: 'Antic Didone', src: '/fonts/AnticDidone-Regular.ttf' });
Font.register({ family: 'Roboto', src: '/fonts/Roboto-Regular.ttf' });
Font.register({ family: 'Montserrat', src: '/fonts/Montserrat-Regular.ttf' });
Font.register({ family: 'Lora', src: '/fonts/Lora-Regular.ttf' });
Font.register({ family: 'Raleway', src: '/fonts/Raleway-Regular.ttf' });
Font.register({ family: 'Open Sans', src: '/fonts/OpenSans-Regular.ttf' });

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const FinalPDFDocument = ({ 
    frontData,
    backData,
    canvasDimensions, 
    qte, 
    format, 
    motif, 
    modelName,
    safeArea,
    verticalAlignmentPercent
}) => {
    
    if (!canvasDimensions || !safeArea || !frontData) return null;

    const scaleX = PAGE_WIDTH / canvasDimensions.width;
    const scaleY = PAGE_HEIGHT / canvasDimensions.height;
    const scaleFactor = Math.min(scaleX, scaleY);

    const scaledContentWidth = canvasDimensions.width * scaleFactor;
    const scaledContentHeight = canvasDimensions.height * scaleFactor;

    const offsetX = (PAGE_WIDTH - scaledContentWidth) / 2;
    const offsetY = (PAGE_HEIGHT - scaledContentHeight) / 2;
    
    return (
        <Document>
            {/* Page 1: Summary Page (Unchanged) */}
            <Page size="A4" style={styles.summaryPage}>
                <View style={styles.section}><Text style={styles.h1}>Récapitulatif de votre commande</Text><Text style={styles.h2}>{modelName || ''}</Text></View>
                <View style={styles.divider} />
                <View style={styles.section}><Text style={styles.label}>Quantité:</Text><Text style={styles.value}>{qte || 'N/A'}</Text></View>
                <View style={styles.section}><Text style={styles.label}>Format:</Text><Text style={styles.value}>{format || 'N/A'}</Text></View>
                <View style={styles.section}><Text style={styles.label}>Motif:</Text><Text style={styles.value}>{motif || 'N/A'}</Text></View>
            </Page>

            {/* Page 2: Renders the Front Card using the imported component */}
            <RenderCardPage 
                cardData={frontData}
                canvasDimensions={canvasDimensions}
                scaleFactor={scaleFactor}
                offsetX={offsetX}
                offsetY={offsetY}
                safeArea={safeArea}
                verticalAlignmentPercent={verticalAlignmentPercent}
            />

            {/* Page 3: Renders the Back Card (only if backData is provided) */}
            {backData && backData.image && (
                 <RenderCardPage 
                    cardData={backData}
                    canvasDimensions={canvasDimensions}
                    scaleFactor={scaleFactor}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    safeArea={safeArea}
                    verticalAlignmentPercent={verticalAlignmentPercent}
                />
            )}
        </Document>
    );
};

const styles = StyleSheet.create({
    summaryPage: { padding: 40, fontFamily: 'Helvetica' },
    h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#111827' },
    h2: { fontSize: 16, color: '#6B7280' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 },
    section: { marginBottom: 16 },
    label: { fontSize: 12, color: '#374151', marginBottom: 4 },
    value: { fontSize: 14, color: '#111827' },
});

export default FinalPDFDocument;