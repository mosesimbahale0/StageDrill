// ======================
// Countdown Display
// ======================
export function CountdownDisplay({
  timeLeft,
  auctionEnded,
}: {
  timeLeft: { days: string; hours: string; minutes: string; seconds: string };
  auctionEnded: boolean;
}) {
  const TimeUnit = ({ value, unit }: { value: string; unit: string }) => (
    <div className="flex flex-col items-center p-2 min-w-[50px] bg-primary">
      <span className="text-3xl font-bold text-accent tracking-wider">
        {value}
      </span>
      <span className="text-xs text-text2 uppercase">{unit}</span>
    </div>
  );

  if (auctionEnded)
    return (
      <div className="text-center p-4 bg-secondary rounded-lg border border-tertiary">
        <h3 className="text-2xl font-bold text-red-400">Auction Ended</h3>
      </div>
    );

  return (
    <div className="p-4 bg-secondary rounded-lg border border-tertiary">
      <h3 className="text-sm text-text2 mb-3 text-center uppercase tracking-wider">
        Auction Ends In
      </h3>
      <div className="flex justify-center gap-2 sm:gap-4 ">
        <TimeUnit value={timeLeft.days} unit="Days" />
        <span className="text-3xl font-light text-text2 pt-2">:</span>
        <TimeUnit value={timeLeft.hours} unit="Hours" />
        <span className="text-3xl font-light text-text2 pt-2">:</span>
        <TimeUnit value={timeLeft.minutes} unit="Mins" />
        <span className="text-3xl font-light text-text2 pt-2">:</span>
        <TimeUnit value={timeLeft.seconds} unit="Secs" />
      </div>
    </div>
  );
}
