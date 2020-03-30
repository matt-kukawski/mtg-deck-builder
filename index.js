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
      const response = await axios.get('https://eu.api.blizzard.com/hearthstone/cards', {
          params: {
              locale: 'en_GB',
              textFilter: searchTerm,
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
  
  createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(card) {
      document.querySelector('.tutorial').classList.add('is-hidden');
      onCardSelect(card, document.querySelector('.right-summary'));
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
        <p class="title">${cardDetail.rarity}</p>
        <p class="subtitle">Rarity</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${cardDetail.mana_cost}</p>
        <p class="subtitle">Mana cost</p>
      </article>
      <article class="notification is-primary">
        <p class="title">${cardDetail.released_at}</p>
        <p class="subtitle">Release date</p>
      </article>
    `;
  };

 