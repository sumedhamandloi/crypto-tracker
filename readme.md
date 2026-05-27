# CryptoTracker

A real-time cryptocurrency tracking and portfolio management dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Live Demo
_Coming soon_

## Screenshots
_Coming soon_

## Features

### Market Tab
- Live prices for the top 10 cryptocurrencies via CoinGecko API
- Market summary — total market cap, best and worst 24h performers
- Search coins by name
- Sort by price, 24h change, or market cap (click column headers)

### Portfolio Tab
- Add holdings with coin, quantity, buy price, and purchase date
- Auto-fetch historical buy price from CoinGecko by date
- Calculate total portfolio value vs cost basis
- Separate short-term and long-term P&L (< 1 year vs > 1 year)
- Portfolio persists across sessions via localStorage (per user)
- Google OAuth authentication via NextAuth.js

## Tech Stack

- **Next.js 15** — App Router, server components, API routes
- **TypeScript** — typed props and interfaces throughout
- **Tailwind CSS** — utility-first styling
- **NextAuth.js** — Google OAuth authentication
- **CoinGecko API** — free tier, no API key required
- **next/image** — optimized image loading

## Architecture Highlights

- Server components for data fetching with 60-second revalidation
- Client components with `useState` for search, sort, and portfolio interactions
- Proxy API route (`/api/history`) to avoid CORS on CoinGecko historical price calls
- Debounced inputs to respect API rate limits
- localStorage keyed per user email for portfolio persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

## What I Learned

- Difference between server and client components in Next.js App Router
- How `useState` and `useEffect` work in React
- Why `key` props matter in lists
- How to proxy API calls through Next.js to avoid CORS
- Short-term vs long-term capital gains classification
- Debouncing to handle API rate limits
