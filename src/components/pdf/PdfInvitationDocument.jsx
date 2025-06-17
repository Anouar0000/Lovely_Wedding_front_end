import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register your font
Font.register({
  family: 'Playfair Display',
  src: `${window.location.origin}/fonts/PlayfairDisplay-Regular.ttf`,
});

const createStyles = (canvasWidth, canvasHeight) =>
  StyleSheet.create({
    page: {
      backgroundColor: '#fff',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    modelInfo: {
      width: '100%',
      padding: 8,
      marginBottom: 10,
      backgroundColor: '#f3f3f3',
      textAlign: 'center',
      borderRadius: 5,
    },
    canvasWrapper: {
      position: 'relative',
      width: canvasWidth,
      height: canvasHeight,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    textBox: {
      position: 'absolute',
      maxWidth: 250,
      wordBreak: 'break-word',
    },
  });

const PdfInvitationDocument = ({ selectedTemplate, textBoxes, model, qte, format, motif, canvasWidth = 400, canvasHeight = 667 }) => {
  const styles = createStyles(canvasWidth, canvasHeight);
  return (
    <Document>
      <Page size={{ width: canvasWidth + 40, height: canvasHeight + 120 }} style={styles.page}>
        {/* Header Info */}
        <View style={styles.modelInfo}>
          <Text>Modèle: {model}</Text>
          <Text>Qté: {qte}</Text>
          <Text>Format: {format}</Text>
          <Text>Motif: {motif}</Text>
        </View>

        {/* Canvas */}
        <View style={styles.canvasWrapper}>
          <Image src={selectedTemplate} style={styles.image} />

          {/* Overlay Text Boxes */}
          {textBoxes.map((box) => (
            <View
              key={box.id}
              style={[
                styles.textBox,
                {
                  top: box.position.y,
                  left: box.position.x,
                  width: box.width,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: box.style.fontSize,
                  fontWeight: box.style.bold ? 'bold' : 'normal',
                  fontStyle: box.style.italic ? 'italic' : 'normal',
                  textAlign: box.style.alignment,
                  lineHeight: box.style.lineHeight,
                  color: box.style.color,
                  fontFamily: 'Playfair Display',
                }}
              >
                {box.text}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfInvitationDocument;
