const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const searchBar = document.querySelector('#search')
const suggestionList = document.querySelector('.suggestions')
const searchBarLabel = document.querySelector('.search__label')
const searchBarButton = document.querySelector('.search__close-button')
const cities = []
let initialListElements = ''
const events = ['change', 'keyup']

// fetch(endpoint).then(response => response.json()).then(data => console.log(data))
//* rewrite it by using async/await
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
  searchBarLabel.classList.add('search_moving-up')
  searchBar.classList.add('search__input_show')
  searchBarButton.classList.add('search__close-button_show')
})

searchBarButton.addEventListener('click', event => {
  event.preventDefault()
  searchBar.classList.remove('search__input_show')
  searchBarButton.classList.remove('search__close-button_show')
  searchBarLabel.classList.remove('search_moving-up')
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