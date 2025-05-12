'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'

// Pricing plans data
const plans = [
  {
    id: 'solo',
    name: 'Solo Learner',
    description: 'Perfect for individuals building their skills',
    price: {
      monthly: 29,
      yearly: 19,
    },
    features: [
      'Unlimited access to all courses',
      'Learning path customization',
      'Project-based learning resources',
      'Community forum access',
      'Code reviews (2 per month)',
      'Portfolio development tools',
      'Personal skill tracker',
    ],
    popular: false,
    callToAction: 'Start Solo Journey',
  },
  {
    id: 'pro',
    name: 'Pro Learner',
    description: 'Accelerate your learning with mentorship',
    price: {
      monthly: 49,
      yearly: 39,
    },
    features: [
      'All Solo features, plus:',
      'Weekly 1:1 mentorship sessions',
      'Priority code reviews (unlimited)',
      'Career path guidance',
      'Mock interviews & feedback',
      'Private Discord access',
      'Project completion certificates',
      'Job opportunity notifications',
    ],
    popular: true,
    callToAction: 'Level Up with Pro',
  },
  {
    id: 'team',
    name: 'Team Learning',
    description: 'Optimal for small dev teams & startups',
    price: {
      monthly: 249,
      yearly: 199,
    },
    features: [
      'All Pro features, plus:',
      'Up to 10 team members',
      'Team learning dashboard',
      'Custom learning paths for teams',
      'Team project challenges',
      'Dedicated team mentor',
      'Skill gap analysis',
      'Monthly progress reports',
    ],
    popular: false,
    callToAction: 'Empower Your Team',
  },
]

export default function PricingPlans() {
  const [annualBilling, setAnnualBilling] = useState(true)
  
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0062A6] mb-4">Choose Your Learning Adventure</h2>
          <p className="text-[#1E1E1E] max-w-2xl mx-auto">
            Unlock your potential with a plan that fits your learning goals and budget.
          </p>
          
          {/* Billing toggle */}
          <div className="mt-10 flex justify-center">
            <div className="bg-[#1E1E1E] p-1 rounded-lg inline-flex">
              <button
                type="button"
                onClick={() => setAnnualBilling(true)}
                className={`px-6 py-2 rounded-md ${
                  annualBilling 
                    ? 'bg-[#FFD644] text-[#1E1E1E]' 
                    : 'text-[#C1C8D2] hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnualBilling(false)}
                className={`px-6 py-2 rounded-md ${
                  !annualBilling 
                    ? 'bg-[#FFD644] text-[#1E1E1E]' 
                    : 'text-[#C1C8D2] hover:text-white'
                }`}
              >
                Yearly <span className="text-xs opacity-75">(20% off)</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-[#0062A6] rounded-xl border ${
                plan.popular 
                  ? 'border-[#FFD644] shadow-lg shadow-[#FFD644]/20' 
                  : 'border-[#8BE3FF]/30'
              } overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FFD644]/10 hover:border-[#FFD644]`}
            >
              {plan.popular && (
                <div className="bg-[#FFD644] text-[#1E1E1E] text-center text-sm py-1.5 font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-[#C1C8D2] mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <p className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">${plan.price[annualBilling ? 'yearly' : 'monthly']}</span>
                    <span className="text-[#C1C8D2] ml-2">/mo</span>
                  </p>
                  {!annualBilling && (
                    <p className="text-[#28D7A0] text-sm mt-1">Billed annually (${plan.price.yearly * 12})</p>
                  )}
                </div>
                
                <button
                  type="button"
                  className={`w-full py-3 rounded-lg font-medium mb-8 ${
                    plan.popular 
                      ? 'bg-[#FFD644] hover:bg-[#28D7A0] text-[#1E1E1E]' 
                      : 'bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 text-white'
                  }`}
                >
                  {plan.callToAction}
                </button>
                
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 text-[#FFD644]">
                        <Check className="h-5 w-5" />
                      </div>
                      <p className="ml-3 text-[#8BE3FF]">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Money-back guarantee */}
        <div className="text-center mt-10 text-[#C1C8D2]">
          <p>30-day money-back guarantee. No questions asked.</p>
        </div>
      </div>
    </div>
  )
} 