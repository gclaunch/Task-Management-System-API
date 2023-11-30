module.exports.paginate = (array, limit, offset) => {
  const limitParsed = parseInt(limit)
  const offsetParsed = parseInt(offset)

  return array.filter(
    (_, index) => index >= offsetParsed && index < offsetParsed + limitParsed,
  )
}
