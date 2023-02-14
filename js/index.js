// GETTING ELEMENTS FROM DOCUMENT
const searchBar = document.querySelector('#search-bar')
const cleanSearchBar = document.querySelector('#clean-searchbar')
const form = document.querySelector("form")
const alert = document.querySelector("#alert")

// DECLARING GLOBAL VARIABLE
let countries = []
myCountry = {}



// FETCHES DATA FROM API
const getAllCountries = async () => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', 'https://restcountries.com/v3/all')
    xhr.responseType = 'json'

    xhr.onload = () => { countries = xhr.response }

    xhr.send()
}



// AUTOCOMPLETE CORE FUNCTION: SHOWS AUTOCOMPLETE RESULTS DEPENDING ON SEARCHBAR VALUE
const onSearchValueChange = () => {
    removeAutocomplete()

    toggleSearchClasses('add')

    const value = searchBar.value.toLowerCase()

    if (value.length === 0) {
        toggleSearchClasses('remove')
        return
    }

    const filteredCountries = countries.filter(country => country.name.common.substr(0, value.length).toLowerCase() === value)

    showAutocomplete(filteredCountries)
}

// GETS VALUE FROM AUTOCOMPLETE CORE FUNCTION AND CREATES DOM ELEMENTS
const showAutocomplete = (filteredCountries) => {

    if (filteredCountries.length === 0) {
        toggleSearchClasses('remove-onmatching')
        return
    }

    const list = document.createElement('ul')
    list.className = 'match-list'
    list.id = 'match-list'

    filteredCountries.map(country => {

        const listItem = document.createElement('li')

        const btn = document.createElement('button')
        btn.setAttribute("title", country.name.common)
        btn.addEventListener('click', onSuggestionClick)

        const img = document.createElement('IMG')
        img.setAttribute("title", country.name.common)
        img.setAttribute("src", country.flags[0])
        img.setAttribute("alt", "country flag")
        btn.appendChild(img)

        const infoDiv = document.createElement('div')
        infoDiv.className = 'info-div'

        const name = document.createElement('p')
        name.setAttribute("title", country.name.common)
        name.textContent = country.name.common
        infoDiv.appendChild(name)

        const region = document.createElement('p')
        region.setAttribute("title", country.name.common)
        region.textContent = country.subregion
        region.className = 'subregion'
        infoDiv.appendChild(region)

        btn.appendChild(infoDiv)

        listItem.appendChild(btn)
        list.appendChild(listItem)
    })

    document.querySelector('#wrapper').appendChild(list)
}

// REMOVES DOM ELEMENTS 
const removeAutocomplete = () => {
    toggleSearchClasses('remove')

    const list = document.querySelector('#match-list')
    if (list) list.remove()
}

// PASSES VALUE FROM AUTOCOMPLETE TO SEARCHBAR
const onSuggestionClick = (e) => {
    e.preventDefault()

    searchBar.value = e.target.title
    toggleSearchClasses('remove-onmatching')

    removeAutocomplete()
}

// HIDES CANCEL ICON AND CLEAN SEARCH BAR VALUE
const onCleanSearchBarClick = () => {
    removeAutocomplete()
    searchBar.value = ''
    return
}



// SHOW COUNTRY INFO CORE FUNCTION: IT FIRES ON FORM SUBMIT
const handleSubmit = (e) => {
    e.preventDefault()

    myCountry = countries.filter(country => country.name.common === searchBar.value)

    if (myCountry.length === 0) {
        displayAlert()
        return
    }

    showCountryInfo(myCountry)
}

// ADDS SELECTED COUNTRY INFOS TO HTML ELEMENTS
const showCountryInfo = (myCountry) => {
    const searchCnt = document.querySelector('#search')
    const resultCtn = document.querySelector('#result-cnt')

    searchCnt.classList.add('search-open')
    resultCtn.classList.add('show-result-cnt')

    myCountry.map(info => {
        document.querySelector('#country-img').src = info.flags[0] || info.flags[1]
        document.querySelector('#country-name').textContent = info.name.common
        document.querySelector('#country-region').textContent = info.subregion
        document.querySelector('#country-capital').textContent = `Capital: ${info.capital[0]}`
        document.querySelector('#country-area').textContent = `Area: ${info.area} km²`
        document.querySelector('#country-population').textContent = `Population: ${info.population}`
        const language = Object.values(info.languages)[0]
        document.querySelector('#country-language').textContent = `Language: ${language}`
        document.querySelector('#country-map-link').href = info.maps.googleMaps || info.maps.openStreetMaps
    })

    searchBar.value = ''
}

// DISPLAY ALERT
const displayAlert = () => {
    alert.style.display = 'block'
    setTimeout(() => {
        alert.style.display = 'none'
    }, 2500);
}

// ADD/REMOVE CLASSES BETWEEN ELEMENTS
const toggleSearchClasses = (action) => {
    if (action === 'add') {
        searchBar.classList.add('input-onmatching')
        cleanSearchBar.classList.add('show-minus-icon')
    } else if (action === 'remove') {
        searchBar.classList.remove('input-onmatching')
        cleanSearchBar.classList.remove('show-minus-icon')
    } else if (action === 'remove-onmatching') {
        searchBar.classList.remove('input-onmatching')
    } else {
        console.error('action not found!')
    }
}


searchBar.addEventListener('input', onSearchValueChange)
cleanSearchBar.addEventListener('click', onCleanSearchBarClick)

form.addEventListener("submit", handleSubmit)


getAllCountries()