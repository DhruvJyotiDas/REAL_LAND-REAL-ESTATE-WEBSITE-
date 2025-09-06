export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatLargeNumber = (num) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr'
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, '') + ' L'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + ' K'
  }
  return num.toString()
}

export const getTimeAgo = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (years > 0) return years === 1 ? '1 year ago' : `${years} years ago`
  if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`
  if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`
  if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
  return 'Just now'
}

export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
