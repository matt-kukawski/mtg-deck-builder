const userDeck = data;
let selectedCard = {};

const renderDeck = () => {
  let htmlToRender = ``;
  for (let card of userDeck) {
    // console.log('renderDeck card ', card.name);
    htmlToRender +=
      `<figure card-id="${card.id}" class="media-left deck-card">
        <p class="image">
          <img img-id="${card.id}" onclick={viewDeckCard(this.getAttribute("img-id"))} class="card-img" src="${card.image_uris.small}" />
          <div class="total-in-deck">
            <i class="fas fa-minus" onclick={decrementCard(this.parentNode.parentNode.getAttribute("card-id"))}></i>
              <span span-id="${card.id}">${card.count}</span>
            <i class="fas fa-plus" onclick={incrementCard(this.parentNode.parentNode.getAttribute("card-id"))}></i>
          </div>
        </p>
      </figure>`
  }

  document.querySelector('.deck-summary').innerHTML = htmlToRender;
  document.querySelector('.autocomplete-summary').innerHTML = '';

  if (userDeck.length > 0) {
    updateDeckCount();
  };

  const sortCont = document.querySelector('#sort-cards');
  // console.log(sortCont);
  if (sortCont === null) {
    document.querySelector('.sort-container').innerHTML = renderSortCont();
  }
 
};

window.onload = function() {
  // console.log('onload function');
  renderDeck();
  selectScript();
  renderManaColors();
}

const autoCompleteConfig = {
    renderOption(card) {
      const imgSrc = card.image_uris.small === 'N/A' ? '' : card.image_uris.small;
      return `
        <img src="${imgSrc}" />
        ${card.name}
      `;
    }, 
    inputValue(card) {
      return card.name;
    }, 
    async fetchData(searchTerm) {
      const response = await axios.get('https://api.scryfall.com/cards/search', {
          params: {
              q: searchTerm,
              page: 1
          }
      });

      // console.log('response.data:', response.data);
      return response.data;
    }
  }
  
  createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#autocomplete-container'),
    onOptionSelect(card) {
      document.querySelector('#autocomplete-container > input').value = '';
      onCardSelect(card, document.querySelector('.autocomplete-summary'));
      selectedCard = card;
    },
    placeholder: "Search for a card..."
  });
  
  const onCardSelect = async (card, summaryElement) => {
    const cardUrl = `https://api.scryfall.com/cards/${card.id}`;
    const response = await axios.get(cardUrl, {
        params: {
            
        }
    });
    // console.log(response.data);
    summaryElement.innerHTML = cardTemplate(response.data);
  }
  
  const deckTypesAllowed = cardDetails => {
    const status = cardDetails.legalities;
    // console.log('status:', status);
    let validFormats = ``;
    for (let format in status) {
      if (status[format] === 'legal') {
        validFormats += `<li>${format}</li>`
      }
    }
    if (validFormats.length > 0) {
      return validFormats;
    } else {
      return `<li>Card not legal in recognized formats</li>`;
    };
  }

  const renderSortCont = () => {
      return `
        <label for="sort-cards">Sort deck by:</label>
  
        <select id="sort-cards">
          <option value="default">-</option>
          <option value="mana-cost">Mana Cost - low to high</option>
          <option value="mana-cost-rev">Mana Cost - high to low</option>
          <option value="name">Name</option>
          <option value="name-reverse">Name - reverse</option>
          <option value="rarity">Rarity</option>
        </select>
      `
  };
