const debounce = (func, delay=1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const cardTemplate = cardDetail => {
    console.log('cardTemplate called');
    return `
      <div class="content">
        <h1>${cardDetail.name}</h1>
        <h4>${cardDetail.type_line}</h4>
      </div>
      <article class="media">
        <figure class="media-left">
          <p class="image feature-img">
            <img src="${cardDetail.image_uris.normal}" />
          </p>
        </figure>
      </article>
      <article class="notification is-primary">
        <p class="title">Formats allowed</p>
        <ul>${deckTypesAllowed(cardDetail)}</ul>
      </article>
      <article class="notification is-primary">
        <p class="title">Add to deck
          <span class="icon">
            <i onclick={addCardToDeck(selectedCard)} id="add-card-to-deck" class="far fa-plus-square"></i>
          </span>
        </p>
      </article>
    `;
  };

const viewDeckCard = (cardToView) => {
    console.log('card-id: ', cardToView);
    let cardDetails = {};
    for (let card of userDeck) {
        if (cardToView === card.id) {
            console.log('name:', card.name);
            cardDetails = card;
            selectedCard = card;
        }
    }
    console.log('cardDetails:', cardDetails);
    document.querySelector('.left-summary').innerHTML = cardTemplate(cardDetails);
}