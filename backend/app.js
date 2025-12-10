// backend/app.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// demo podatki
const listings = [
  { id: "apt-1", title: "Svetlo 2-sobno stanovanje", city: "Ljubljana", price: 285000, beds: 2, baths: 1, size: 58, type: "Stanovanje" },
  { id: "apt-2", title: "Garsonjera blizu centra", city: "Maribor", price: 125000, beds: 1, baths: 1, size: 32, type: "Stanovanje" },
  { id: "house-1", title: "Družinska hiša z vrtom", city: "Kranj", price: 420000, beds: 4, baths: 2, size: 165, type: "Hiša" },
  { id: "house-2", title: "Moderna enodružinska hiša", city: "Celje", price: 510000, beds: 5, baths: 3, size: 210, type: "Hiša" },
  { id: "apt-3", title: "3-sobno z razgledom", city: "Koper", price: 339000, beds: 3, baths: 2, size: 86, type: "Stanovanje" },
  { id: "house-3", title: "Rustikalna hiša v naravi", city: "Bled", price: 690000, beds: 4, baths: 2, size: 180, type: "Hiša" },
  { id: "apt-4", title: "Prenovljeno staromeščansko", city: "Ljubljana", price: 449000, beds: 3, baths: 2, size: 102, type: "Stanovanje" },
  { id: "house-4", title: "Hiša dvojček z atrijem", city: "Novo mesto", price: 298000, beds: 3, baths: 2, size: 124, type: "Hiša" },
  { id: "apt-5", title: "Duplex penthouse", city: "Ljubljana", price: 725000, beds: 4, baths: 3, size: 150, type: "Stanovanje" },
  { id: "house-5", title: "Manjša hiša za prenovo", city: "Ptuj", price: 149000, beds: 2, baths: 1, size: 74, type: "Hiša" },
  { id: "apt-6", title: "Mini 1.5-sobno", city: "Velenje", price: 98000, beds: 1, baths: 1, size: 29, type: "Stanovanje" },
  { id: "house-6", title: "Vila s pogledom", city: "Piran", price: 1100000, beds: 5, baths: 4, size: 260, type: "Hiša" },
];

app.get('/', (req, res) => {
  res.send('Backend za nepremicnine deluje');
});

app.get('/api/nepremicnine', (req, res) => {
  let result = listings.slice();
  const { city, type, minPrice, maxPrice, minBeds } = req.query;

  if (city) {
    result = result.filter((x) => x.city === city);
  }
  if (type) {
    result = result.filter((x) => x.type === type);
  }
  if (minPrice) {
    const v = Number(minPrice);
    result = result.filter((x) => x.price >= v);
  }
  if (maxPrice) {
    const v = Number(maxPrice);
    result = result.filter((x) => x.price <= v);
  }
  if (minBeds) {
    const v = Number(minBeds);
    result = result.filter((x) => x.beds >= v);
  }

  res.json(result);
});

app.get('/api/nepremicnine/:id', (req, res) => {
  const item = listings.find((x) => x.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(item);
});

module.exports = app;
