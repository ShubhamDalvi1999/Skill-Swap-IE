'use client'

import React from 'react'

export default function PricingPlans() {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-[#0062A6] mb-4">Choose the Plan That Fits You</h2>
          <p className="text-[#1E1E1E] max-w-2xl mx-auto">
            Whether you're here to learn or to teach, we have a plan designed to help you grow.
          </p>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-[#0062A6] rounded-xl border border-[#8BE3FF]/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FFD644]/10 hover:border-[#FFD644] p-8">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
              <span className="mr-2">🚀</span> Free Plan
            </h3>
            <p className="text-[#C1C8D2] mb-6">Perfect for getting started and exploring the platform.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Access to core learning features</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Watch ads to support free access</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <div className="ml-3 text-[#8BE3FF]">
                  <p>Earn tokens through fun, meaningful activities:</p>
                  <ul className="mt-2 space-y-1 list-inside ml-4">
                    <li>Solve challenges</li>
                    <li>Teach others</li>
                    <li>...and 10+ more rewarding ways</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Buy tokens anytime to unlock premium features</p>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full py-3 rounded-lg font-medium mb-4 bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 text-white"
            >
              Get Started Free
            </button>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-[#0062A6] rounded-xl border border-[#FFD644] shadow-lg shadow-[#FFD644]/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FFD644]/10 p-8">
            <div className="absolute top-0 right-0 left-0 bg-[#FFD644] text-[#1E1E1E] text-center text-sm py-1.5 font-medium">
              Most Popular
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center mt-4">
              <span className="mr-2">🌟</span> Premium Plan
            </h3>
            <p className="text-[#C1C8D2] mb-6">Go further, faster — with the ultimate learning experience.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Full access to all premium content and tools</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Build real-world projects with guided mentorship</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">One-on-one feedback from experienced educators</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Completely ad-free</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 text-[#FFD644]">•</div>
                <p className="ml-3 text-[#8BE3FF]">Includes tokens equivalent to your subscription value</p>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full py-3 rounded-lg font-medium mb-4 bg-[#FFD644] hover:bg-[#28D7A0] text-[#1E1E1E]"
            >
              Go Premium
            </button>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-10 text-[#1E1E1E] max-w-2xl mx-auto">
          <p className="font-medium">Start free, grow your skills, and unlock your potential — on your terms.</p>
        </div>
      </div>
    </div>
  )
} 