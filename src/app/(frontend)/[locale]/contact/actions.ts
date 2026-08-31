'use server'

import type { ContactFormState } from '@/components/contact/ContactForm'
import { createInquiry } from '@/services/inquiries/createInquiry'

export async function submitInquiry(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const result = await createInquiry({
    name: formData.get('name'),
    company: formData.get('company'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    website: formData.get('website') ?? '',
    projectType: formData.get('projectType') ?? '',
    estimatedBudget: formData.get('estimatedBudget') ?? '',
    desiredStart: formData.get('desiredStart') ?? '',
    message: formData.get('message'),
    consent: formData.get('consent') === 'true',
  })

  if (result.ok) return { status: 'success' }
  return { status: 'error', errors: result.errors }
}
