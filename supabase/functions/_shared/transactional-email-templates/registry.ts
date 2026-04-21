/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as welcomePro } from './welcome-pro.tsx'
import { template as trialEnding } from './trial-ending.tsx'
import { template as paymentFailed } from './payment-failed.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'welcome-pro': welcomePro,
  'trial-ending': trialEnding,
  'payment-failed': paymentFailed,
}
