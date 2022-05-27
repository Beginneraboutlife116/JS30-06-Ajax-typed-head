const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const cities = []
const searchBar = document.querySelector('#search')

// fetch(endpoint).then(response => response.json()).then(data => console.log(data))
async function fetchData(url) {
  try {
    const data = await (await fetch(url)).json()
    return data
  } catch(error) {
    console.error(error)
  }
}

fetchData(endpoint).then(data => cities.push(...data))

console.log(cities)

function findKeyword(word, list) {
  return list.filter(item => {
    const regExp = new RegExp(word, 'gi')
    return item.city.match(regExp) || item.state.match(regExp)
  })
}

function displayResult(value) {
  console.log(findKeyword(value, cities))
}

// searchBar.addEventListener('change', event => displayResult(event.target.value))
// searchBar.addEventListener('keyup', event => displayResult(event.target.value))

const events = ['change', 'keyup']

events.forEach(event => {
  searchBar.addEventListener(event, dom => {
    const target = dom.target.value
    if (target.trim() === '' || target === '') return
    displayResult(target)
  })
})