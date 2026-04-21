/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Krakken'
const SITE_URL = 'https://krakken.io'

interface TrialEndingProps {
  name?: string
  daysLeft?: number
}

const TrialEndingEmail = ({ name, daysLeft = 3 }: TrialEndingProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Plus que {daysLeft} jours d'essai sur {SITE_NAME}.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>KRAKKEN</Text>
        </Section>
        <Heading style={h1}>
          {name ? `${name}, plus que ${daysLeft} jours.` : `Plus que ${daysLeft} jours d'essai.`}
        </Heading>
        <Text style={text}>
          Ton essai gratuit se termine dans <strong>{daysLeft} jours</strong>. Pour continuer
          à traquer les meilleures récurrences sans interruption, active ton abonnement Pro.
        </Text>
        <Section style={pricingBox}>
          <Text style={priceLabel}>Plan Pro</Text>
          <Text style={price}>9,90 €<span style={priceSuffix}>/mois</span></Text>
          <Text style={priceDesc}>Accès illimité · Annulable à tout moment</Text>
        </Section>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button style={button} href={`${SITE_URL}/abonnement`}>
            Activer mon abonnement
          </Button>
        </Section>
        <Text style={footer}>
          Sans action de ta part, ton accès sera suspendu à la fin de l'essai.<br />
          L'équipage {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TrialEndingEmail,
  subject: (data) => `Plus que ${data?.daysLeft ?? 3} jours d'essai sur ${SITE_NAME}`,
  displayName: 'Fin d\'essai (J-3)',
  previewData: { name: 'Capitaine', daysLeft: 3 },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"Nunito", "DM Sans", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { borderBottom: '2px solid #1FB8A8', paddingBottom: '16px', marginBottom: '28px' }
const brand = { fontSize: '20px', fontWeight: '800' as const, letterSpacing: '0.18em', color: '#1FB8A8', margin: '0' }
const h1 = { fontSize: '24px', fontWeight: '800' as const, color: '#0a1428', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d4757', lineHeight: '1.6', margin: '0 0 20px' }
const pricingBox = {
  backgroundColor: '#f4fbfa', border: '1px solid #1FB8A8', borderRadius: '12px',
  padding: '20px 24px', textAlign: 'center' as const, margin: '24px 0',
}
const priceLabel = { fontSize: '13px', color: '#1FB8A8', fontWeight: '700' as const, letterSpacing: '0.1em', margin: '0 0 6px' }
const price = { fontSize: '32px', fontWeight: '800' as const, color: '#0a1428', margin: '0' }
const priceSuffix = { fontSize: '15px', fontWeight: '500' as const, color: '#7a8595' }
const priceDesc = { fontSize: '13px', color: '#7a8595', margin: '6px 0 0' }
const button = {
  backgroundColor: '#1FB8A8', color: '#ffffff', fontSize: '15px', fontWeight: '700' as const,
  borderRadius: '12px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block',
}
const footer = { fontSize: '13px', color: '#7a8595', margin: '32px 0 0', lineHeight: '1.6' }
