/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Tu es invité à rejoindre {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}><Text style={brand}>KRAKKEN</Text></Section>
        <Heading style={h1}>Tu es invité à bord.</Heading>
        <Text style={text}>
          Tu viens d'être invité à rejoindre{' '}
          <Link href={siteUrl} style={link}><strong>{siteName}</strong></Link>.
          Accepte l'invitation pour créer ton compte et embarquer.
        </Text>
        <Section style={{ textAlign: 'center', margin: '28px 0' }}>
          <Button style={button} href={confirmationUrl}>Accepter l'invitation</Button>
        </Section>
        <Text style={footer}>Si tu n'attendais pas cette invitation, ignore cet email.</Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Nunito", "DM Sans", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { borderBottom: '2px solid #1FB8A8', paddingBottom: '16px', marginBottom: '28px' }
const brand = { fontSize: '20px', fontWeight: '800' as const, letterSpacing: '0.18em', color: '#1FB8A8', margin: '0' }
const h1 = { fontSize: '24px', fontWeight: '800' as const, color: '#0a1428', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d4757', lineHeight: '1.6', margin: '0 0 16px' }
const link = { color: '#1FB8A8', textDecoration: 'underline' }
const button = {
  backgroundColor: '#1FB8A8', color: '#ffffff', fontSize: '15px', fontWeight: '700' as const,
  borderRadius: '12px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block',
}
const footer = { fontSize: '13px', color: '#7a8595', margin: '32px 0 0' }
