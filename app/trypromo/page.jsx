'use client';
import React, { useState, useEffect } from 'react';
import { useUser, SignIn } from '@clerk/nextjs'; // Keep SignIn import from HEAD
import { Sparkles, Star, Trophy, AlertCircle, Gift, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function TryPromoPage() {
  const { user, isLoaded } = useUser();
  const [guessedNumber, setGuessedNumber] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameStatus, setGameStatus] = useState('active'); // 'active', 'won', 'exhausted'
  const [promoCode, setPromoCode] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      checkGameStatus();
    }
    // eslint-disable-next-line
  }, [isLoaded, user]);

  const checkGameStatus = async () => {
    try {
      const response = await fetch('/api/user-promo-status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setAttempts(data.attempts || 0);
        setHasWon(data.hasWon || false);
        setPromoCode(data.promoCode || '');
        if (data.hasWon) {
          setGameStatus('won');
          setMessage(`🎉 Congratulations! You've already won with promo code: ${data.promoCode}`);
        } else if (data.attempts >= 3) {
          setGameStatus('exhausted');
          setMessage('😔 You\'ve used all 3 attempts. Better luck next time!');
        }
      }
    } catch (error) {
      console.error('Error checking game status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !guessedNumber || isSubmitting) return;
    const number = parseInt(guessedNumber);
    if (number < 1 || number > 100) {
      setMessage('⚠️ Please enter a number between 1 and 100!');
      return;
    }
    setIsSubmitting(true);
    setMessage('🎲 Checking your lucky number...');
    try {
      const response = await fetch('/api/redeem-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          guessedNumber: number,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.success && data.promoCode) {
          setHasWon(true);
          setGameStatus('won');
          setPromoCode(data.promoCode);
          setMessage(`🎉 WINNER! Your promo code: ${data.promoCode}`);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= 3) {
            setGameStatus('exhausted');
            setMessage('😔 Sorry! You\'ve used all 3 attempts. The winning numbers remain a mystery!');
          } else {
            setMessage(`❌ Not quite! You have ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} left. Try again!`);
          }
        }
      } else {
        setMessage(`❌ ${data.error || 'Something went wrong. Please try again.'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please check your connection and try again.');
      console.error('Error submitting guess:', error);
    } finally {
      setIsSubmitting(false);
      setGuessedNumber('');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-200 mb-6">Please sign in to participate in the lucky number promo!</p>
          <SignIn /> {/* Keep SignIn component */}
        </div>
      </div>
    );
  }

  const isGameDisabled = gameStatus === 'won' || gameStatus === 'exhausted';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      {/* Home Button */}
      <div className="relative z-20 container mx-auto px-4 pt-8 flex">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl shadow transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          Home
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Star className="w-10 h-10 text-yellow-400 animate-spin" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Hamro eShop's Lucky Number Game
              </h1>
              <Star className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
            <p className="text-xl text-gray-200 mb-4">
              Guess a number between 1-100 and win exclusive promo codes!
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>10 winning numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>3 attempts per user</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>1 win per user</span>
              </div>
            </div>
          </div>

          {/* Game Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* User Info */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {user.firstName || user.username || user.emailAddresses?.[0]?.emailAddress || 'Player'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Attempts: {attempts}/3
                  </p>
                </div>
              </div>
              {gameStatus === 'won' && (
                <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-green-300 font-semibold">Winner!</span>
                </div>
              )}
            </div>

            {/* Game Form */}
            {!isGameDisabled && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="guess" className="block text-white text-lg font-semibold mb-3">
                    Enter your lucky number (1-100):
                  </label>
                  <input
                    id="guess"
                    type="number"
                    min="1"
                    max="100"
                    value={guessedNumber}
                    onChange={(e) => setGuessedNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    className="w-full px-6 py-4 text-2xl text-center bg-white/20 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
                    placeholder="42"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!guessedNumber || isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Submit Guess
                      <Sparkles className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-6 rounded-2xl text-center text-lg font-semibold ${
                gameStatus === 'won'
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : gameStatus === 'exhausted'
                  ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              }`}>
                {message}
              </div>
            )}

            {/* Promo Code Display */}
            {promoCode && gameStatus === 'won' && (
              <div className="mt-6 p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl border border-yellow-400/30">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-white text-xl font-bold mb-2">Your Promo Code:</h3>
                  <div className="bg-black/30 rounded-xl p-4 font-mono text-2xl text-yellow-400 tracking-wider">
                    {promoCode}
                  </div>
                  <p className="text-gray-300 text-sm mt-3">
                    Save this code! You can use it for exclusive offers.
                  </p>
                </div>
              </div>
            )}

            {/* Game Rules */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Game Rules:
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• You have 3 attempts to guess a winning number</li>
                <li>• There are 10 winning numbers between 1-100</li>
                <li>• Each winning number can only be claimed once</li>
                <li>• Each user can win only one promo code</li>
                <li>• Once you win or use all attempts, the game ends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}