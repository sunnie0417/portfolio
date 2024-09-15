// Elements
const $pokemons = document.getElementById('pokemons')
const $more = document.getElementById('more')
const $dialog = document.getElementById('dialog')
const getFirst20 = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
const img = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"
const font = "kranky-regular"
// Data
const deck = []

// Display Pokemons
function displayPokemons(pokemons) {
    deck.push(...pokemons.results)
    const myList = Array.from(catchList);
    $pokemons.innerHTML = Object.values(deck).reduce((html, prop) => {
        const id = prop.url.match(/(\d+)\/$/)[1].toString()
        const isCaught = myList.includes(id);
        const classNames = isCaught ? 'pokemon col-lg-4 col-md-12 col-sm-12 catch-style' : 'pokemon col-lg-4 col-md-12 col-sm-12';
        console.log(classNames)
        const catchButton = isCaught ? '<span>CATCH</span>' : ''
        console.log(catchButton)

        return html + `
        <div id="pokemon" class="${classNames}" data-id="${id}">
            <img src="${img}${id}.png" class="w-75"/>
            <p class="${font} display-2">${prop.name}</p>
            ${catchButton}
        </div>
        `;
    }, '');
}

// Display CatchPokemons
function displayCatchPokemons(details) {
    const pokemonElements = document.querySelectorAll(`[data-id="${details.id}"]`)
    console.log(pokemonElements)
    if (catchList.has(details.id.toString())) {
        pokemonElements.forEach(element => {
            element.classList.add('catch-style')
            const span = document.createElement('span')
            span.textContent = 'CATCH'
            element.appendChild(span)
        });
    } else {
        pokemonElements.forEach(element => {
            element.classList.remove('catch-style');
            const span = element.querySelector('span');
            element.removeChild(span);
        });
    }
}

// Display details in dialog
function displayDetails(details) {
    const pokemonElements = document.querySelectorAll(`[data-id="${details.id}"]`)
    let catchStatus
    if (catchList.has(details.id.toString())) {
        catchStatus = "RELEASE"
    } else {
        catchStatus = "CATCH" 
    }
    $dialog.innerHTML = `
    <div class="container-lg container-md container-sm container-xs">
        <div class="details row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <p class="name m-0 display-4">${details.name}</p>
                <img src="${img}${details.id}.png" class="img-fluid"/>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="d-flex justify-content-end mt-3">
                    <form method="dialog">
                        <button class="close">close</button>
                    </form>
                </div>
                <div class="type-moves-detail">
                    <p class="type display-4">Type</p>
                    ${details.types.slice(0, 2).reduce((html, item, index) => {
        const comma = index < details.types.slice(0, 2).length - 1 ? ', ' : '';
        return html + `<p class="type-details d-inline">${item.type["name"]}${comma}</p>`;
    }, '')}
                    <p class="moves mt-3 display-4">Moves</p>
                    ${details.moves.slice(0, 5).reduce((html, item, index) => {
        const comma = index < details.moves.slice(0, 5).length - 1 ? ', ' : '';
        return html + `<p class="moves-details d-inline">${item.move["name"]}${comma}</p>`;
    }, '')}
                    <div class="mt-3">
                        <button id="storage" class="storage">${catchStatus}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}

// Get more 20
$more.addEventListener('click', async function (e) {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + deck.length)
    const json = await response.json()
    displayPokemons(json)
})

// Show dialog
$pokemons.addEventListener('click', async function (e) {
    const $pokemon = e.target.closest('.pokemon')
    if ($pokemon) {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + $pokemon.dataset.id)
        const details = await response.json()
        displayDetails(details)
        $dialog.showModal()

        // Storage and release
        const $storage = document.getElementById('storage')
        $storage.addEventListener('click', function (e) {
            if (catchList.has(details.id.toString())) {
                catchList.delete(details.id.toString())
            } else {
                catchList.add(details.id.toString())
            }
            localStorage.setItem('catch-list', JSON.stringify(Array.from(catchList)))
            $dialog.close()
            displayCatchPokemons(details)
        })
    }
})

// Get localstorage
const cl = JSON.parse(localStorage.getItem('catch-list'))
const catchList = cl ? new Set(cl) : new Set()

// Get first 20
fetch(getFirst20)
    .then(response => response.json())
    .then(json => displayPokemons(json))

// localStorage.clear()
