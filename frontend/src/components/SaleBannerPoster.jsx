import React from 'react'
import { useSettings } from '../context/SettingsProvider'
import { Link } from 'react-router-dom'

const gradientMap = {
  green:  'from-green-800 to-green-500',
  orange: 'from-orange-700 to-orange-400',
  red:    'from-red-800 to-red-500',
  purple: 'from-purple-800 to-purple-500',
  blue:   'from-blue-800 to-blue-500',
  gold:   'from-yellow-700 to-yellow-400',
}

const buttonTextMap = {
  green:  'text-green-700',
  orange: 'text-orange-600',
  red:    'text-red-600',
  purple: 'text-purple-700',
  blue:   'text-blue-700',
  gold:   'text-yellow-800',
}

const SaleBannerPoster = () => {
  const { saleBanner } = useSettings()
  if (!saleBanner?.enabled || !saleBanner?.title) return null

  const hasImage = !!saleBanner.imageUrl
  const gradient = gradientMap[saleBanner.bgColor] || gradientMap.green
  const btnText = buttonTextMap[saleBanner.bgColor] || 'text-green-700'

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center justify-center px-4 text-center text-white relative ${hasImage ? '' : `bg-gradient-to-r ${gradient}`}`}
      style={hasImage ? {
        backgroundImage: `url(${saleBanner.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : {}}
    >
      {/* Dark overlay when image is set */}
      {hasImage && <div className='absolute inset-0 bg-black/55' />}

      <div className='relative z-10'>
        <p className='text-xs sm:text-sm font-semibold uppercase tracking-widest opacity-75 mb-2'>Limited Time Offer</p>
        <h1 className='text-4xl sm:text-6xl font-extrabold tracking-wide drop-shadow-lg'>{saleBanner.title}</h1>
        {saleBanner.subtitle && (
          <p className='mt-3 text-base sm:text-xl opacity-90 max-w-2xl mx-auto'>{saleBanner.subtitle}</p>
        )}
        <Link to='/products'>
          <button className={`mt-8 bg-white ${btnText} px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:opacity-90 cursor-pointer transition-opacity`}>
            Shop the Sale
          </button>
        </Link>
      </div>
    </div>
  )
}

export default SaleBannerPoster
