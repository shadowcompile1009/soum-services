const getSearchablePhone = (phone) => {
    return phone.indexOf('0') === 0 ? phone.slice(1) : phone;
}

module.exports = {
  getSearchablePhone
};
