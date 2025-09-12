'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2, QrCode, Users, TrendingUp, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralCardProps {
  referralCode: string;
  totalReferrals: number;
  totalEarned: number;
  userName: string;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  totalReferrals,
  totalEarned,
  userName,
}) => {
  const { toast } = useToast();
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy referral code',
        variant: 'destructive',
      });
    }
  };

  const shareReferralCode = async () => {
    const referralText = `🎉 Join Chaandi Uphar with my referral code: ${referralCode}\n\nGet beautiful jewelry and I'll earn rewards when you make your first purchase!\n\n✨ Explore luxury jewelry at Chaandi Uphar`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Chaandi Uphar',
          text: referralText,
        });
      } catch (error) {
        // Fallback to copying if sharing fails
        await navigator.clipboard.writeText(referralText);
        toast({
          title: 'Shared!',
          description: 'Referral message copied to clipboard',
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(referralText);
        toast({
          title: 'Shared!',
          description: 'Referral message copied to clipboard',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to copy referral message',
          variant: 'destructive',
        });
      }
    }
  };

  const generateQRCode = () => {
    setIsGeneratingQR(true);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralCode)}`;
    
    // Open QR code in new window
    const newWindow = window.open('', '_blank', 'width=300,height=300');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Referral QR Code</title></head>
          <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
            <h3>Scan to use referral code</h3>
            <img src="${qrCodeUrl}" alt="Referral QR Code" style="border: 1px solid #ddd; border-radius: 8px;" />
            <p style="font-family: monospace; font-size: 14px; margin-top: 10px;">${referralCode}</p>
          </body>
        </html>
      `);
    }
    setIsGeneratingQR(false);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-[#ff8fab]/10 via-white to-[#ff8fab]/5 border-2 border-dashed border-[#ff8fab]/30 hover:border-[#ff8fab]/50 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-[#ff8fab] p-2 rounded-full">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Referral Card</h3>
              <p className="text-sm text-gray-600">Share & Earn Rewards</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">For</p>
            <p className="font-semibold text-gray-900">{userName}</p>
          </div>
        </div>

        {/* Referral Code Display */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-[#ff8fab]/20 shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Your Referral Code</p>
            <div className="bg-gradient-to-r from-[#ff8fab] to-[#ff7a9a] text-white px-4 py-3 rounded-lg inline-block">
              <code className="text-xl font-bold font-mono tracking-wider">
                {referralCode}
              </code>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            onClick={copyReferralCode}
            variant="outline"
            size="sm"
            className="border-[#ff8fab]/30 hover:bg-[#ff8fab]/10 hover:border-[#ff8fab]/50 text-[#ff8fab] hover:text-[#ff7a9a]"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button
            onClick={shareReferralCode}
            variant="outline"
            size="sm"
            className="border-[#ff8fab]/30 hover:bg-[#ff8fab]/10 hover:border-[#ff8fab]/50 text-[#ff8fab] hover:text-[#ff7a9a]"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
          <Button
            onClick={generateQRCode}
            variant="outline"
            size="sm"
            disabled={isGeneratingQR}
            className="border-[#ff8fab]/30 hover:bg-[#ff8fab]/10 hover:border-[#ff8fab]/50 text-[#ff8fab] hover:text-[#ff7a9a]"
          >
            <QrCode className="w-4 h-4 mr-1" />
            QR
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-xs font-medium text-blue-800">Referrals</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{totalReferrals}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs font-medium text-green-800">Earned</span>
            </div>
            <p className="text-lg font-bold text-green-600">₹{totalEarned}</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="border-t border-[#ff8fab]/20 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">How it works:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Share your referral code with friends</li>
            <li>• They get special discounts on their first order</li>
            <li>• You earn ₹500 when they make a purchase</li>
            <li>• Both you and your friend benefit!</li>
          </ul>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8fab]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ff8fab]/5 rounded-full translate-y-12 -translate-x-12"></div>
      </CardContent>
    </Card>
  );
};