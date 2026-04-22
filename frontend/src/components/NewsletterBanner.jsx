import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import API_URL from '../config'

const NewsletterBanner = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async () => {
    if (!email.trim()) return toast.error("Please enter your email.")
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/subscribe`, { email })
      if (res.data.success) {
        toast.success(res.data.message)
        setSubscribed(true)
        setEmail('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-r from-green-700 to-green-500 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Get Exclusive Deals in Your Inbox
        </h2>
        <p className="text-green-100 text-sm sm:text-base mb-6">
          Subscribe to receive our latest sales, new arrivals, and festival promotions — straight to your email.
        </p>

        {subscribed ? (
          <div className="bg-white/20 text-white font-semibold rounded-full px-6 py-3 inline-block">
            🎉 You're subscribed! Check your inbox for a welcome email.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              placeholder="Enter your email address"
              className="flex-1 w-full px-5 py-3 rounded-full outline-none text-sm text-gray-800 focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-7 py-3 rounded-full text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsletterBanner
