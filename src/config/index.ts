import { Metadata } from 'next'

export const SITE_CONFIG: Metadata = {
  title: {
    default: 'Buildfy - AI Powered Website Builder',
    template: `%s | Buildfy`
  },
  description:
    'Buildy is an AI powered website builder that helps you create a website in minutes. No coding skills required. Get started for free!',
  icons: {
    icon: [
      {
        url: '/icons/favicon.ico',
        href: '/icons/favicon.ico'
      }
    ]
  },
  openGraph: {
    title: 'Buildfy - AI Powered Website Builder',
    description:
      'Buildfy is an AI powered website builder that helps you create a website in minutes. No coding skills required. Get started for free!',
    images: [
      {
        url: '/assets/og-image.png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@shreyassihasane',
    title: 'Buildfy - AI Powered Website Builder',
    description:
      'Buildfy is an AI powered website builder that helps you create a website in minutes. No coding skills required. Get started for free!',
    images: [
      {
        url: '/assets/og-image.png'
      }
    ]
  },
  metadataBase: new URL('https://buildfy.ai')
}
