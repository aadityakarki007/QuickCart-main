// app/api/check-promo-usage/route.js
import UsedPromoCode from "@/models/UsedPromoCode";

export async function POST(req) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return Response.json({ 
        success: false, 
        error: 'Promo code is required' 
      }, { status: 400 });
    }

    // Check if promo code has been used
    const usedPromo = await UsedPromoCode.findOne({ code });
    
    return Response.json({
      success: true,
      isUsed: !!usedPromo,
      usedBy: usedPromo?.usedBy || null,
      usedAt: usedPromo?.usedAt || null
    });

  } catch (error) {
    console.error('Error checking promo code usage:', error);
    return Response.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}