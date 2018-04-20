const places = [];

module.exports = {
  places,

  addPlace: (city, country) => {
    // const id = ++places.length;
    const id = places.length + 1;
    let numType = 'odd';
    if (id % 2 === 0) {
      numType = 'even';
    }
    places.push({
      id, city, country, numType,
    });
  },
};
