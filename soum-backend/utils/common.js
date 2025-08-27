const isUUIDv4 = (body) => {
  const presetConditionUUIDRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  return presetConditionUUIDRegex.test(body);
}

module.exports = {
  isUUIDv4
};
