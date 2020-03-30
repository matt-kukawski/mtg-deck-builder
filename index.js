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
      document.querySelector('.tutorial').classList.add('is-hidden');
      onCardSelect(card, document.querySelector('.left-summary'));
      console.log('card-left', card);
    }
  });
  
  const onCardSelect = async (card, summaryElement) => {
    const cardUrl = `https://api.scryfall.com/cards/${card.id}`;
    const response = await axios.get(cardUrl, {
        params: {
            
        }
    });
    console.log(response.data);
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
    return validFormats;
  }

  const cardTemplate = cardDetail => {
    return `
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${cardDetail.image_uris.small}" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${cardDetail.name}</h1>
            <h4>${cardDetail.type_line}</h4>
            <p>${cardDetail.oracle_text}</p>
          </div>
        </div>
      </article>
      <article class="notification is-primary">
        <p class="title">Rarity</p>
        <p class="subtitle">${cardDetail.rarity}</p>
      </article>
      <article class="notification is-primary">
        <p class="title">Mana cost</p>
        <p class="subtitle">${cardDetail.mana_cost}</p>
      </article>
      <article class="notification is-primary">
        <p class="title">Formats allowed</p>
        <ul>${deckTypesAllowed(cardDetail)}</ul>
      </article>
    `;
  };

 