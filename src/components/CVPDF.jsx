import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image, Svg, Circle, Path } from '@react-pdf/renderer';

// Enregistrement de la police Courier
Font.register({
  family: 'Courier',
  src: 'https://fonts.gstatic.com/s/courierprime/v9/u-450i2J9k-pS3u8fG3ax00.ttf'
});
// Désactivation de la césure pour éviter les coupures de mots bizarres
Font.registerHyphenationCallback(word => [word]);

const styles = StyleSheet.create({
  page: { flexDirection: 'row', backgroundColor: '#FFFFFF', fontFamily: 'Courier', padding: 35, fontSize: 10, lineHeight: 1.4, color: '#333' },

  // SIDEBAR
  sidebar: { width: '32%', borderRight: '1px solid #e5e7eb', paddingRight: 15, marginRight: 15, height: '100%' },
  avatar: { width: 125, height: 125, borderRadius: 62.5, objectFit: 'cover', marginBottom: 20, border: '5px solid #16a34a' },
  headerName: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  headerRole: { fontSize: 11, color: '#16a34a', marginBottom: 25, fontWeight: 'bold' },

  // INFOS
  infoSection: { marginBottom: 20, paddingBottom: 15, borderBottom: '1px solid #f3f4f6' },
  infoRow: { marginBottom: 8 },
  infoLabel: { fontSize: 8, color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { fontSize: 10, color: '#374151', fontWeight: 'bold', flexDirection: 'row', alignItems: 'center' },
  emailValue: { fontSize: 10, color: '#374151', fontWeight: 'bold' },

  // SECTIONS & SKILLS
  sidebarSectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#16a34a', marginBottom: 8, marginTop: 10, textTransform: 'uppercase' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  skillBadge: { backgroundColor: '#f3f4f6', padding: '3px 6px', borderRadius: 4, fontSize: 9, border: '1px solid #e5e7eb', color: '#4b5563', marginBottom: 4, marginRight: 4 },

  // MAIN CONTENT
  main: { width: '68%', paddingLeft: 10 },
  mainSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#16a34a', marginTop: 10, marginBottom: 15, textTransform: 'uppercase', borderBottom: '2px solid #16a34a', paddingBottom: 5, letterSpacing: 1.2 },

  // ITEMS
  itemContainer: { marginBottom: 20, paddingLeft: 10, borderLeft: '2px solid #f3f4f6' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  itemTitle: { fontSize: 12, fontWeight: 'bold', color: '#000', maxWidth: '75%' },
  itemDateBadge: { fontSize: 9, color: '#065f46', backgroundColor: '#d1fae5', padding: '3px 8px', borderRadius: 10, fontWeight: 'bold' },
  itemPlace: { fontSize: 10, color: '#6b7280', fontStyle: 'italic', marginBottom: 8 },

  // LISTES
  listItem: { flexDirection: 'row', marginBottom: 4, alignItems: 'center' },
  listText: { fontSize: 9, color: '#4b5563', marginLeft: 6, flex: 1 }, // Texte liste décalé après le SVG

  // DESCRIPTION TEXTE
  normalText: { fontSize: 10, color: '#4b5563', marginBottom: 4, textAlign: 'justify' }
});

// --- COMPOSANTS SVG (VECTORIELS) ---

// Puce verte (Cercle plein)
const SvgBullet = () => (
  <Svg viewBox="0 0 10 10" style={{ width: 4, height: 4, marginTop: 2 }}>
    <Circle cx="5" cy="5" r="5" fill="#16a34a" />
  </Svg>
);

// Coche verte (Checkmark)
const SvgCheck = () => (
  <Svg viewBox="0 0 24 24" style={{ width: 8, height: 8, marginTop: 1 }}>
    <Path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

// Pastille Statut
const SvgStatus = ({ color }) => (
  <Svg viewBox="0 0 10 10" style={{ width: 6, height: 6, marginRight: 6 }}>
    <Circle cx="5" cy="5" r="5" fill={color} />
  </Svg>
);


// --- FORMATAGE DESCRIPTION ---
const FormattedDescription = ({ text }) => {
  if (!text) return null;
  // Remplace les sauts de ligne littéraux et divise
  const lines = text.replace(/\\n/g, '\n').split('\n');

  return (
    <View>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Si tiret => Puce SVG
        if (trimmed.startsWith('-')) {
          return (
            <View key={i} style={styles.listItem}>
              <SvgBullet />
              <Text style={styles.listText}>{trimmed.substring(1).trim()}</Text>
            </View>
          );
        }
        // Sinon texte normal
        return (
          <Text key={i} style={styles.normalText}>
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
};

export const CVPDF = ({ profile, cvItems }) => {
  const experiences = cvItems.filter(item => item.category === 'experience');
  const formations = cvItems.filter(item => item.category === 'formation');
  const birthDate = profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('fr-FR') : '';

  // Calcul Âge Précis
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(profile?.birth_date);

  // Couleurs Statut (Hexadécimal pour le PDF)
  const getStatusHex = (status) => {
    if (!status) return '#6b7280'; // Gris
    const s = status.toLowerCase();
    if (s.includes('open')) return '#22c55e'; // Vert
    if (s.includes('poste')) return '#ef4444'; // Rouge
    if (s.includes('freelance')) return '#a855f7'; // Violet
    if (s.includes('écoute')) return '#f97316'; // Orange
    return '#3b82f6'; // Bleu
  };

  const safeName = profile?.full_name || 'CV';

  return (
    <Document
      title={`CV - ${safeName}`}
      author={safeName}
      subject="SysAdmin & Dev"
      creator="Portfolio App"
    >
      <Page size="A4" style={styles.page}>
        {/* === SIDEBAR === */}
        <View style={styles.sidebar}>

          {/* PHOTO RONDE */}
          {profile?.avatar_url && (
            <Image src={profile.avatar_url} style={styles.avatar} />
          )}

          <Text style={styles.headerName}>{profile?.full_name}</Text>
          <Text style={styles.headerRole}>{profile?.role}</Text>

          {/* BLOC INFO */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.emailValue}>{profile?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tél</Text>
              <Text style={styles.infoValue}>{profile?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lieu</Text>
              <Text style={styles.infoValue}>{profile?.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Âge</Text>
              <Text style={styles.infoValue}>{age} ans</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Permis</Text>
              <Text style={styles.infoValue}>{profile?.driving_license}</Text>
            </View>
          </View>

          {/* LANGUES (avec puces SVG) */}
          {profile?.languages && profile.languages.length > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.sidebarSectionTitle}>Langues</Text>
              {profile.languages.map((l, i) => (
                <View key={i} style={styles.listItem}>
                  <SvgBullet />
                  <Text style={styles.listText}>{l}</Text>
                </View>
              ))}
            </View>
          )}

          {/* CERTIFICATIONS (avec coches SVG) */}
          {profile?.certifications && profile.certifications.length > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.sidebarSectionTitle}>Certifs / Diplômes</Text>
              {profile.certifications.map((c, i) => (
                <View key={i} style={styles.listItem}>
                  <SvgCheck />
                  <Text style={styles.listText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          {/* SKILLS */}
          <Text style={styles.sidebarSectionTitle}>Compétences</Text>
          <View style={styles.skillsContainer}>
            {profile?.hard_skills?.map((skill, i) => (
              <Text key={i} style={styles.skillBadge}>{skill}</Text>
            ))}
          </View>
        </View>

        {/* === MAIN CONTENT === */}
        <View style={styles.main}>

          {/* EXPÉRIENCES */}
          {experiences.length > 0 && (
            <>
              <Text style={styles.mainSectionTitle}># EXPÉRIENCES PROFESSIONNELLES</Text>
              {experiences.map(exp => (
                <View key={exp.id} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.title}</Text>
                    <Text style={styles.itemDateBadge}>{exp.date_range}</Text>
                  </View>
                  <Text style={styles.itemPlace}>@ {exp.place}</Text>
                  <FormattedDescription text={exp.description} />
                </View>
              ))}
            </>
          )}

          {/* FORMATIONS */}
          {formations.length > 0 && (
            <>
              <Text style={styles.mainSectionTitle}># FORMATIONS</Text>
              {formations.map(edu => (
                <View key={edu.id} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{edu.title}</Text>
                    <Text style={styles.itemDateBadge}>{edu.date_range}</Text>
                  </View>
                  <Text style={styles.itemPlace}>@ {edu.place}</Text>
                  <FormattedDescription text={edu.description} />
                </View>
              ))}
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};