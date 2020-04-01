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

const addDupeToDeck = cardDetails => {
  cardDetails.count += 1;
}

const addCardToDeck = (cardDetails) => {
  console.log('adding card: ', cardDetails);
  if (!cardDetails.count) {
    cardDetails.count = 1;
    userDeck.push(cardDetails);
  } else {
    addDupeToDeck(cardDetails);
  }
  console.log('userDeck:', userDeck);
  renderDeck();
}

const deckSize = (deck) => {
  let cardCount = 0;
  for (let card of deck) {
    cardCount += card.count;
  }
  return cardCount;
}

const removeCard = (cardId) => {
  for (let i=0; i < userDeck.length; i++) {
    if (cardId === userDeck[i].id) {
      userDeck.splice(i, 1);
      renderDeck();
    }
  }
}

const updateDeckCount = () => {
  document.querySelector('#deck-count-div').innerHTML = `Your deck (${deckSize(userDeck)} cards)`;
}

const incDecCard = (cardId, action) => {
  // console.log(`${action}: ${cardId}`);
  const countElement = document.querySelector(`[span-id="${cardId}"]`);
  // console.log('countElement:', countElement);
  for (let i=0; i < userDeck.length; i++) {
    if (cardId === userDeck[i].id) {
      // console.log(`${action}: ${userDeck[i].name}`);
      if (action === 'decrement') {
        userDeck[i].count -= 1;
        if (userDeck[i].count < 1) {
          console.log('remove card');
          removeCard(cardId);
        } else {
          countElement.innerHTML = userDeck[i].count;
        }
        updateDeckCount();
      } else if (action === 'increment') {
        userDeck[i].count += 1;
        countElement.innerHTML = userDeck[i].count;
        updateDeckCount();
      }          
    }
  } 
}

const decrementCard = (cardId) => {
  incDecCard(cardId, 'decrement');
}

const incrementCard = (cardId) => {
  incDecCard(cardId, 'increment');
}





