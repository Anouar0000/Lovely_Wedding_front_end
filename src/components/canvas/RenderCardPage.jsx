// src/components/canvas/RenderCardPage.js

import React from 'react';
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    designPage: { backgroundColor: '#FFFFFF' },
});

// This is the component that renders ONE side of the card.
const RenderCardPage = ({ cardData, canvasDimensions, scaleFactor, offsetX, offsetY, safeArea, verticalAlignmentPercent }) => (
    <Page size="A4" style={styles.designPage}>
        <View style={{ position: 'absolute', left: offsetX, top: offsetY, width: canvasDimensions.width * scaleFactor, height: canvasDimensions.height * scaleFactor }}>
            
            <View style={{ position: 'absolute', top: safeArea.top * scaleFactor, bottom: safeArea.bottom * scaleFactor, left: safeArea.left * scaleFactor, right: safeArea.right * scaleFactor }}>
                {cardData.image && (
                    <Image src={cardData.image} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: `center ${verticalAlignmentPercent || 50}%` }} />
                )}
            </View>
            
            {cardData.textBoxes.map(box => {
                const style = box.style || {};
                const textContent = box.text || '';
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
);

export default RenderCardPage;