export default (value) => {
  const date = new Date(value)
  return date.toLocaleDateString()
  // return date.toLocaleDateString({month: 'short', day: '2-digit', year: 'numeric', hourr: '2-digit', minute: '2-digit'})
}
