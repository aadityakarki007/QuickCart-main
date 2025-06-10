const luckyNumbers = {
  23: 'eShopA823',
  91: 'eShopA492',
  7:  'eShopA192',
  38: 'eShopA765',
  56: 'eShopA318',
  12: 'eShopA654',
  84: 'eShopA105',
  30: 'eShopA907',
  69: 'eShopA231',
  44: 'eShopA379',
};

// In-memory stores for demo (replace with DB in production)
const userAttempts = new Map(); // userId -> { attempts: number, hasWon: boolean }
const claimedNumbers = new Set(); // numbers that have been claimed

export async function POST(req) {
  try {
    const { userId, guessedNumber } = await req.json();
    if (!userId || typeof guessedNumber !== 'number') {
      return Response.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    // Get user state
    let userState = userAttempts.get(userId) || { attempts: 0, hasWon: false };
    if (userState.hasWon) {
      return Response.json({ success: false, error: 'You have already won a promo code.' }, { status: 400 });
    }
    if (userState.attempts >= 3) {
      return Response.json({ success: false, error: 'No attempts left.' }, { status: 400 });
    }

    // Check if guessed number is a lucky number and not claimed
    if (
      luckyNumbers.hasOwnProperty(guessedNumber) &&
      !claimedNumbers.has(guessedNumber)
    ) {
      // Mark as claimed
      claimedNumbers.add(guessedNumber);
      userAttempts.set(userId, { attempts: userState.attempts + 1, hasWon: true });
      return Response.json({ success: true, promoCode: luckyNumbers[guessedNumber] });
    } else {
      // Not a winner, increment attempts
      userAttempts.set(userId, { attempts: userState.attempts + 1, hasWon: false });
      return Response.json({ success: false, error: 'Not a winning number.' });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message || 'Unknown error' }, { status: 400 });
  }
}