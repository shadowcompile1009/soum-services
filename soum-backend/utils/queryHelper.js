const lookup = (from, localField, foreignField, as) => {
  return {
    $lookup: {
      from: from,
      localField: localField,
      foreignField: foreignField,
      as: as,
    }
  }
};

const unwind = (path, preserveNullAndEmptyArrays = false) => {
  return {
    $unwind: {
      path: path,
      preserveNullAndEmptyArrays: preserveNullAndEmptyArrays,
    },
  }
};

module.exports = {
  lookup,
  unwind
};
