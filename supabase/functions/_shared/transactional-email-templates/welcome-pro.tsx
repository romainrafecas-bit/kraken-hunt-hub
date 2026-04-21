/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Krakken'
const SITE_URL = 'https://krakken.io'

interface WelcomeProProps {
  name?: string
}

const WelcomeProEmail = ({ name }: WelcomeProProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Ta traque commence — 14 jours d'essai t'attendent.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>KRAKKEN</Text>
        </Section>
        <Heading style={h1}>
          {name ? `Bienvenue à bord, ${name}.` : 'Bienvenue à bord.'}
        </Heading>
        <Text style={text}>
          Ton compte est actif. Tu as <strong>14 jours d'essai gratuit</strong> pour explorer
          les zones de chasse, traquer les meilleures récurrences et valider tes prochains produits.
        </Text>
        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button style={button} href={`${SITE_URL}/dashboard`}>
            Ouvrir mon dashboard
          </Button>
        </Section>
        <Text style={text}>
          Trois choses à faire dès maintenant :
        </Text>
        <Text style={listItem}>→ Parcourir les <strong>produits en vélocité</strong> sur le dashboard</Text>
        <Text style={listItem}>→ Ajouter tes premiers <strong>favoris</strong> à sourcer</Text>
        <Text style={listItem}>→ Tester le <strong>calculateur de marges</strong></Text>
        <Text style={footer}>
          Bonne traque,<br />L'équipage {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeProEmail,
  subject: 'Bienvenue à bord — ta traque commence',
  displayName: 'Bienvenue Pro',
  previewData: { name: 'Capitaine' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"Nunito", "DM Sans", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { borderBottom: '2px solid #1FB8A8', paddingBottom: '16px', marginBottom: '28px' }
const brand = { fontSize: '20px', fontWeight: '800' as const, letterSpacing: '0.18em', color: '#1FB8A8', margin: '0' }
const h1 = { fontSize: '24px', fontWeight: '800' as const, color: '#0a1428', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d4757', lineHeight: '1.6', margin: '0 0 16px' }
const listItem = { fontSize: '15px', color: '#3d4757', lineHeight: '1.7', margin: '0 0 8px' }
const button = {
  backgroundColor: '#1FB8A8', color: '#ffffff', fontSize: '15px', fontWeight: '700' as const,
  borderRadius: '12px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block',
}
const footer = { fontSize: '13px', color: '#7a8595', margin: '36px 0 0', lineHeight: '1.6' }
