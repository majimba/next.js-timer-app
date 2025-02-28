# Next.js Timer App

A Next.js timer app with millisecond precision and split functionality. Features include start/stop controls, reset, and the ability to record and display split times. Built with React and styled using Tailwind CSS.

## Features

- **Precise Timing**: Tracks time with millisecond precision
- **Intuitive Controls**: Simple start, stop, and reset functionality
- **Split Times**: Record and display split times while the timer is running
- **Split Modes**: Switch between Lap mode (interval timing) and Cumulative mode (total timing)
- **Auto-Record Final Split**: Automatically records the final split when stopping the timer
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface with animated background elements built with Tailwind CSS

## Screenshots

*[Add screenshots of your application here]*

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Start Timer**: Click the green "Start" button to begin timing
2. **Record Split**: While the timer is running, click the blue "Split" button to record a split time
3. **Stop Timer**: Click the red "Stop" button to pause the timer (automatically records final split)
4. **Reset Timer**: Click the "Reset" button to set the timer back to 00:00:00 and clear all splits
5. **Switch Modes**: Use the mode toggle to switch between:
   - **Lap Mode**: Shows the time for each individual lap and the total time
   - **Cumulative Mode**: Shows the total time at each split and the difference between splits

## Technical Implementation

The app uses:
- React's `useState` and `useEffect` hooks for state management
- `useRef` to properly handle timer intervals
- Tailwind CSS for styling with custom animations
- Conditional rendering for dynamic UI elements
- CSS animations for background elements

## Future Enhancements

Potential future features include:
- Countdown timer functionality
- Custom time input
- Sound alerts
- Dark/light mode toggle
- Persistent storage of times

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
