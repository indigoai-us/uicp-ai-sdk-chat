import React from 'react';

export interface NBAGameScoreProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameDate?: string;
  gameStatus?: 'scheduled' | 'live' | 'final';
  quarter?: string;
  timeRemaining?: string;
}

export function NBAGameScore({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  gameDate,
  gameStatus = 'final',
  quarter,
  timeRemaining,
}: NBAGameScoreProps) {
  const homeWinning = homeScore > awayScore;
  const awayWinning = awayScore > homeScore;

  return (
    <div className="w-full max-w-md mx-auto my-4 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" 
               style={{ display: gameStatus === 'live' ? 'block' : 'none' }} />
          <span className="text-sm font-semibold text-gray-300 uppercase">
            {gameStatus === 'live' ? 'LIVE' : gameStatus === 'final' ? 'FINAL' : 'SCHEDULED'}
          </span>
        </div>
        {gameDate && (
          <span className="text-sm text-gray-400">{gameDate}</span>
        )}
      </div>

      {/* Game Score */}
      <div className="p-6">
        {/* Away Team */}
        <div className={`flex items-center justify-between mb-4 pb-4 border-b border-gray-700 ${
          awayWinning ? 'opacity-100' : 'opacity-70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {awayTeam.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <span className={`text-xl font-semibold ${
              awayWinning ? 'text-white' : 'text-gray-300'
            }`}>
              {awayTeam}
            </span>
          </div>
          <span className={`text-3xl font-bold ${
            awayWinning ? 'text-white' : 'text-gray-300'
          }`}>
            {awayScore}
          </span>
        </div>

        {/* Home Team */}
        <div className={`flex items-center justify-between ${
          homeWinning ? 'opacity-100' : 'opacity-70'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {homeTeam.substring(0, 3).toUpperCase()}
              </span>
            </div>
            <span className={`text-xl font-semibold ${
              homeWinning ? 'text-white' : 'text-gray-300'
            }`}>
              {homeTeam}
            </span>
          </div>
          <span className={`text-3xl font-bold ${
            homeWinning ? 'text-white' : 'text-gray-300'
          }`}>
            {homeScore}
          </span>
        </div>
      </div>

      {/* Game Info Footer */}
      {(quarter || timeRemaining) && (
        <div className="bg-gray-800 px-4 py-2 text-center">
          <span className="text-sm text-gray-300">
            {quarter && <span className="font-semibold">{quarter}</span>}
            {quarter && timeRemaining && <span className="mx-2">•</span>}
            {timeRemaining && <span>{timeRemaining}</span>}
          </span>
        </div>
      )}
    </div>
  );
}

