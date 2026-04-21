/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Ton code de vérification Krakken</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}><Text style={brand}>KRAKKEN</Text></Section>
        <Heading style={h1}>Code de vérification</Heading>
        <Text style={text}>Utilise le code ci-dessous pour confirmer que c'est bien toi :</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>Ce code expire rapidement. Si tu n'as rien demandé, ignore cet email.</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: '"Nunito", "DM Sans", Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { borderBottom: '2px solid #1FB8A8', paddingBottom: '16px', marginBottom: '28px' }
const brand = { fontSize: '20px', fontWeight: '800' as const, letterSpacing: '0.18em', color: '#1FB8A8', margin: '0' }
const h1 = { fontSize: '24px', fontWeight: '800' as const, color: '#0a1428', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#3d4757', lineHeight: '1.6', margin: '0 0 20px' }
const codeStyle = {
  fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: '800' as const,
  color: '#1FB8A8', letterSpacing: '0.3em', margin: '0 0 28px', textAlign: 'center' as const,
  backgroundColor: '#f4fbfa', padding: '16px', borderRadius: '10px',
}
const footer = { fontSize: '13px', color: '#7a8595', margin: '32px 0 0' }
