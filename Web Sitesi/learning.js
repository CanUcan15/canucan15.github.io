console.log("learning.js loaded");

function collectElementsData() {
  const elements = document.querySelectorAll('.element');

  const data = Array.from(elements).map(el => ({
    symbol: el.dataset.symbol,
    name: el.dataset.name,
    atomicNumber: Number(el.dataset.atomicNumber),
    group: Number(el.dataset.group),
    period: Number(el.dataset.period),
    category: el.dataset.category
  })).filter(e => e.symbol && e.name);

  return data;
}

const ELEMENTS = collectElementsData();

console.log("Elements collected:", ELEMENTS.length);
console.log("Sample element:", ELEMENTS[0]);
