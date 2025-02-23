
# RssWave - Your Personal AI Radio Station

RssWave is an innovative web application that transforms RSS feeds into personalized audio content using AI technology. It allows users to convert any RSS feed into a customizable radio station, offering an ad-free, noise-free listening experience. The platform leverages advanced AI technology (Gemini and ElevenLabs) to convert text content into natural-sounding audio, letting users choose from various voices and control playback speeds.

## Demo

[Demo](https://www.rsswave.com/)


## Tech Stack

**Frontend:**
- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Query](https://tanstack.com/query/latest) - Data fetching and state management
- [Lucide React](https://lucide.dev) - Icon library

**Backend:**
- [Supabase](https://supabase.com) - Backend as a Service
  - Authentication
  - Database
  - Storage
  - Edge Functions
- [ElevenLabs](https://elevenlabs.io) - Text-to-speech API
- [Gemini AI](https://deepmind.google/technologies/gemini/) - Text processing

**Development Tools:**
- [Vite](https://vitejs.dev) - Build tool and dev server
- [ESLint](https://eslint.org) - Code linting
- [PostCSS](https://postcss.org) - CSS processing

## Features

- 🎙️ AI-Powered Audio Conversion
  - Convert any RSS article to natural-sounding audio
  - Multiple voice options via ElevenLabs integration
  - Smart text processing with Gemini AI

- 📱 Modern User Experience
  - Clean, responsive design
  - Dark/light mode support
  - Smooth animations and transitions
  - Mobile-friendly interface

- 📻 Advanced Playback Controls
  - Queue management for continuous listening
  - Playback speed control
  - Progress tracking across articles
  - Batch conversion support

- 📊 Feed Management
  - Multiple RSS feed support
  - Feed organization and categorization
  - Curated feed suggestions
  - Easy feed addition and removal

- 🔐 Secure User Experience
  - User authentication via Supabase
  - Personal API key management
  - Secure audio storage
  - Cross-device synchronization
## Installation

1. Clone the repository
```bash
git clone https://github.com/ajaymalik14/rsswave.git
cd rsswave
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create a .env file in the root directory and add the following:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher
- A Supabase account
- A Google Cloud account (for Gemini AI)
- An ElevenLabs account

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

`VITE_SUPABASE_URL`=your-project-url.supabase.co
`VITE_SUPABASE_ANON_KEY`=your-anon-key ## FAQ

#### How does RssWave convert text to audio?
RssWave uses a combination of Gemini AI for text processing and ElevenLabs for voice synthesis. The platform first processes your RSS feed content through Gemini AI to optimize it for audio conversion, then uses ElevenLabs' advanced text-to-speech technology to create natural-sounding audio.

#### Can I customize the voice and speed of the audio?
Yes! RssWave offers multiple voice options powered by ElevenLabs AI. You can select different voices and adjust playback speeds to match your preferences. The platform provides full control over voice selection and audio playback settings.

#### Is there a limit to how many RSS feeds I can add?
No, there's no limit to the number of RSS feeds you can add to your RssWave account. You can convert articles from any number of RSS feeds into audio format, making it easy to build your personal audio library from multiple sources.

#### Do I need to provide my own API keys?
Yes, RssWave requires you to provide your own Gemini and ElevenLabs API keys for security and billing purposes. This ensures you have full control over your usage and costs. You can easily add these API keys in your dashboard settings.

#### Can I listen to my audio content offline?
Currently, RssWave requires an internet connection to stream your audio content. However, you can access your converted articles from any device with an internet connection, and the audio plays without any advertisements or interruptions.
## Authors

- [@ajaymalik14](https://github.com/ajaymalik14/)


## Feedback

If you have any feedback, please reach out to me  at [@ajaymalikpro](https://x.com/ajaymalikpro)

