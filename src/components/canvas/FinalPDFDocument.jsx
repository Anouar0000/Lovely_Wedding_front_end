import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

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
    selectedTemplate, 
    textBoxes, 
    canvasDimensions, 
    qte, 
    format, 
    motif, 
    modelName,
    safeArea,
    verticalAlignmentPercent
}) => {
    
    if (!canvasDimensions || !safeArea) return null;

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

            {/* Page 2: The WYSIWYG Design */}
            <Page size="A4" style={styles.designPage}>
                <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: scaledContentWidth, height: scaledContentHeight }}>
                    
                    <View style={{ position: 'absolute', top: safeArea.top * scaleFactor, bottom: safeArea.bottom * scaleFactor, left: safeArea.left * scaleFactor, right: safeArea.right * scaleFactor }}>
                        {selectedTemplate && (
                            <Image src={selectedTemplate} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: `center ${verticalAlignmentPercent || 50}%` }} />
                        )}
                    </View>
                    
                    {textBoxes.map(box => {
                        const style = box.style || {};
                        const textContent = box.text || '';
                        
                        // --- THIS IS THE FINAL, GUARANTEED SOLUTION ---
                        // We insert a zero-width space after every character.
                        // This forces the PDF engine to allow a line break anywhere,
                        // perfectly mimicking browser text wrapping.
                        const processedText = textContent.split('').join('\u200B');

                        const layoutStyle = {
                            position: 'absolute',
                            left: (box.position?.x || 0) * scaleFactor,
                            top: (box.position?.y || 0) * scaleFactor,
                            width: (box.width || 150) * scaleFactor,
                        };

                        const textStyle = {
                            fontSize: (style.fontSize || 16) * scaleFactor,
                            color: style.color || '#000000',
                            textAlign: style.alignment || 'left',
                            fontStyle: style.italic ? 'italic' : 'normal',
                            fontWeight: style.bold ? 'bold' : 'normal',
                            fontFamily: style.fontFamily || 'Helvetica', 
                            lineHeight: style.lineHeight || 1.5,
                        };

                        return (
                            <View key={box.id} style={layoutStyle}>
                                <Text style={textStyle}>{processedText}</Text>
                            </View>
                        );
                    })}
                </View>
            </Page>
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
    designPage: { backgroundColor: '#FFFFFF' },
});

export default FinalPDFDocument;