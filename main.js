const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const cities = []
const searchBar = document.querySelector('#search')
const suggestionList = document.querySelector('.suggestions')
let initialListElements = ''
const events = ['change', 'keyup']

// fetch(endpoint).then(response => response.json()).then(data => console.log(data))
//* rewrite it to async/await
async function fetchData(url) {
  try {
    const data = await (await fetch(url)).json()
    return data
  } catch(error) {
    console.error(error)
  }
}

function findKeyword(word, list) {
  return list.filter(item => {
    const regExp = new RegExp(word, 'gi')
    return item.city.match(regExp) || item.state.match(regExp)
  })
}

function displayResult(arr) {
  return arr.map(item => {
    return `
      <li class="suggestions__item">
        <span>${item.city}</span>
        <span>${item.state}</span>
        <span>${item.population}</span>
      </li>
    `
  }).join('')
}

fetchData(endpoint).then(data => {
  cities.push(...data)
  initialListElements = displayResult(cities)
})


events.forEach(event => {
  searchBar.addEventListener(event, dom => {
    const target = dom.target.value.trim()
    suggestionList.innerHTML = ''
    if (target === '') {
      suggestionList.innerHTML = initialListElements
    } else {
      const foundArr = findKeyword(target, cities)
      suggestionList.innerHTML = foundArr.length ? displayResult(foundArr) : `
        <li class="suggestions__item">
          <p>Can't find corresponding city and state name</p>
        </li>
      `
    }
  })
})