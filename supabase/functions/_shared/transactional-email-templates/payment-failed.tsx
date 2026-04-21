/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Krakken'
const SITE_URL = 'https://krakken.io'

interface PaymentFailedProps {
  name?: string
  amount?: string
}

const PaymentFailedEmail = ({ name, amount }: PaymentFailedProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Ton paiement a échoué — mets à jour ta carte avant suspension.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>KRAKKEN</Text>
        </Section>
        <Heading style={h1}>
          {name ? `${name}, ton paiement a échoué.` : 'Ton paiement a échoué.'}
        </Heading>
        <Text style={text}>
          Nous n'avons pas pu prélever {amount ? <strong>{amount}</strong> : 'ton abonnement'} sur ta carte.
          Cela peut arriver pour plusieurs raisons : carte expirée, plafond atteint, ou blocage temporaire.
        </Text>
        <Section style={alertBox}>
          <Text style={alertText}>
            ⚠ Sans mise à jour, ton accès Krakken sera <strong>suspendu</strong> sous quelques jours.
          </Text>
        </Section>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button style={button} href={`${SITE_URL}/abonnement`}>
            Mettre à jour ma carte
          </Button>
        </Section>
        <Text style={footer}>
          Une question ? Réponds simplement à cet email.<br />
          L'équipage {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentFailedEmail,
  subject: 'Ton paiement a échoué — action requise',
  displayName: 'Paiement échoué',
  previewData: { name: 'Capitaine', amount: '9,90 €' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: '"Nunito", "DM Sans", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { borderBottom: '2px solid #1FB8A8', paddingBottom: '16px', marginBottom: '28px' }
const brand = { fontSize: '20px', fontWeight: '800' as const, letterSpacing: '0.18em', color: '#1FB8A8', margin: '0' }
const h1 = { fontSize: '24px', fontWeight: '800' as const, color: '#0a1428', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d4757', lineHeight: '1.6', margin: '0 0 16px' }
const alertBox = {
  backgroundColor: '#fef6f0', border: '1px solid #f59e0b', borderRadius: '10px',
  padding: '14px 18px', margin: '20px 0',
}
const alertText = { fontSize: '14px', color: '#92400e', lineHeight: '1.5', margin: '0' }
const button = {
  backgroundColor: '#1FB8A8', color: '#ffffff', fontSize: '15px', fontWeight: '700' as const,
  borderRadius: '12px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block',
}
const footer = { fontSize: '13px', color: '#7a8595', margin: '32px 0 0', lineHeight: '1.6' }
