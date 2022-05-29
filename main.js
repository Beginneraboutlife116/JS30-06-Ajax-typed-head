const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const searchBar = document.querySelector('[data-search-input]')
const suggestionList = document.querySelector('.suggestions')
const searchBarLabel = document.querySelector('[data-search-label]')
const searchBarButton = document.querySelector('[data-search-button]')
const cities = []
let initialListElements = ''
const events = ['change', 'keyup']

// fetch(endpoint).then(response => response.json()).then(data => console.log(data))
//* rewrite it by using async/await
/**
 * This function is rewritten fetch APi to async/await
 * @param {string} url The rewrote fetch function for this JS30
 * @returns Promise object
 */
async function fetchData(url) {
  try {
    const data = await (await fetch(url)).json()
    return data
  } catch(error) {
    console.error(error)
  }
}

/**
 * This is for filtering corresponding keyword to a new array
 * @param {string} word String that user inputs
 * @param {array} list What we get from the beginning fetch
 * @returns Array
 */
function findKeyword(word, list) {
  return list.filter(item => {
    const regExp = new RegExp(word, 'gi')
    return item.city.match(regExp) || item.state.match(regExp)
  })
}

/**
 * This is to show the finding result.
 * @param {array} arr What we filter from findKeyword function
 * @param {string} word What user inputs in
 * @returns String for HTML template
 */
function displayResult(arr, word = '') {
  return arr.map(item => {
    let highlightCityName, highlightStateName
    if (word !== '') {
      const regExp = new RegExp(word, 'gi')
      highlightCityName = item.city.replace(regExp, `<mark class="text_highlight">${word}</mark>`)
      highlightStateName = item.state.replace(regExp, `<mark class="text_highlight">${word}</mark>`)
    }
    return `
      <li class="suggestions__item">
        <p class="text text_lg">${highlightCityName ?? item.city}</p>
        <p class="text text_italic">${highlightStateName ?? item.state}</p>
        <p class="stay-right-side">${Number(item.population).toLocaleString()}</p>
      </li>
    `
  }).join('')
}

searchBarLabel.addEventListener('click', () => {
  searchBarLabel.dataset.searchLabel = false
  searchBar.dataset.searchInput = true
  searchBarButton.dataset.searchButton = true
})

searchBarButton.addEventListener('click', event => {
  event.preventDefault()
  searchBar.dataset.searchInput = false
  searchBarButton.dataset.searchButton = false
  searchBarLabel.dataset.searchLabel = true
  suggestionList.innerHTML = ''
  searchBar.value = ''
})

fetchData(endpoint).then(data => {
  cities.push(...data)
  initialListElements = displayResult(cities)
})

events.forEach(event => {
  searchBar.addEventListener(event, dom => {
    const target = dom.target.value.trim()
    suggestionList.innerHTML = ''
    suggestionList.innerHTML = target === '' ? initialListElements : (
      findKeyword(target, cities).length ? displayResult(findKeyword(target, cities), target) : `
        <li class="suggestions__item">
          <p class="text text_xl">Can't find corresponding city and state name</p>
        </li>
      `
    )
  })
})