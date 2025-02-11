# Virtual Tabletop Application

A modern web application for managing tabletop role-playing game sessions with real-time collaboration features.

## Core Features

- Interactive game board with WebSocket-based token management
- Dynamic fog of war system
- Real-time sound effects with MIDI controller support
- RGB light control system integration
- Character creation and management
- Equipment and inventory system
- Monster database with thermal printer integration
- Session management and tracking

## Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, PartyKit for WebSocket
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **APIs**: Freesound, Cloudinary

## Requirements

- Node.js 18+
- MySQL 8+
- Cloudinary account
- Freesound API key
- (Optional) MIDI controller
- (Optional) Thermal printer

## Project Structure

```
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── components/    # Shared components
│   ├── game/         # Game components
│   ├── hooks/        # Custom hooks
│   └── services/     # External services
├── lib/               # Utilities
├── party/            # PartyKit server
├── prisma/           # Database
└── public/           # Static assets
```

## Setup

1. Clone and install dependencies:

2. Configure environment:

```bash
cp .env.example .env.local
# Add your credentials to .env.local:
# - Database URL
# - Cloudinary credentials
# - Freesound API key
# - Auth secret (generate with: openssl rand -base64 32)
```

3. Initialize database:

```bash
npx prisma generate
npx prisma db push
```

4. Start development servers:

```bash
npm run dev          # Next.js
npm run party:dev    # PartyKit
```

## Development

### Database Changes

```bash
npx prisma migrate dev --name change_description
npx prisma studio    # Database UI
```

### Real-time Features

- WebSocket server: `party/index.ts`
- Client connections: `lib/websocket.tsx`
- State management: `app/game/context/`

### Component Guidelines

- Use server components by default
- Add 'use client' directive for client components
- Follow Next.js 13+ app directory conventions

## Features

### Game Board

- WebSocket-based token management
- Dynamic zoom and pan
- Customizable fog of war
- Background image support
- Fullscreen mode

### Token System

- HP tracking
- Size customization
- Visibility controls
- Context menu actions
- Status indicators

### Sound System

- Sound library management
- MIDI controller support
- Multiple sound playback
- Volume control per effect
- Favorites system

### Additional Systems

- Character creation
- Equipment management
- Monster database
- Session tracking
- User authentication
- Light control integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT - See [LICENSE](LICENSE) for details.
