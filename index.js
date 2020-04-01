const userDeck = data;
let selectedCard = {};

const renderDeck = () => {
  let htmlToRender = ``;
  for (let card of userDeck) {
    console.log('renderDeck card ', card.name);
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

  document.querySelector('.right-deck').innerHTML = htmlToRender;
  document.querySelector('.left-summary').innerHTML = '';
  document.querySelector('.right-header').innerHTML = `
    <div class="column notification is-primary tutorial">
      <h1 id="deck-count-div" class="title">Your deck (${deckSize(userDeck)} cards)</h1>
        <p class="subtitle">Click to view card</p>
    </div>
  `;
};

window.onload = renderDeck();

const autoCompleteConfig = {
    renderOption(card) {
      const imgSrc = card.image_uris.small === 'N/A' ? '' : card.image_uris.small;
      return `
        <img src="${imgSrc}" />
        ${card.name} (${card.mana_cost})
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
    //   if (response.data.Error) {
    //       return [];
    //   }
      console.log('response.data:', response.data);
      return response.data;
    }
  }
  
  createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(card) {
      document.querySelector('#left-autocomplete > input').value = '';
      document.querySelector('.tutorial').classList.add('is-hidden');
      onCardSelect(card, document.querySelector('.left-summary'));
      // console.log('card-left', card);
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
        // console.log(`${format}: ${status[format]}`);
        validFormats += `<li>${format}</li>`
      }
    }
    if (validFormats.length > 0) {
      return validFormats;
    } else {
      return `<li>Card not legal in recognized formats</li>`;
    };
  }



 