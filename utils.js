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
    // console.log('cardTemplate called: ', cardDetail);
    const cardType = (cardDetail.type_line).replace(/[^a-zA-Z ]/g, "");
    return `
    <div class="columns">
      <div class="column left-autocomplete">
        <div class="content">
          <h1>${cardDetail.name}</h1>
          <h4>${cardType}</h4>
        </div>
        <article class="media">
          <figure class="media-left">
            <p class="image feature-img">
              <img src="${cardDetail.image_uris.normal}" />
            </p>
          </figure>
        </article>
      </div>
      <div class="column right-autocomplete">
        <article class="notification is-primary">
          <p class="title">Formats allowed</p>
          <ul>${deckTypesAllowed(cardDetail)}</ul>
        </article>
        <div class="add-card-div">
          ${cardInDeck(cardDetail.id)}
        </div>
      </div>
    </div>
    `;
  };

const cardInDeck = (cardId) => {
  const alreadyPresent = userDeck.some(el => el.id === cardId);
  // console.log('alreadyPresent:', alreadyPresent);
  if (alreadyPresent) {
    return `
      <article class="notification is-primary">
        <p class="title">Card already in deck</p>
      </article>
    `
  } else {
    return `
      <article class="notification is-primary">
        <p class="title">Add to deck
          <span class="icon">
            <i onclick={addCardToDeck(selectedCard)} id="add-card-to-deck" class="far fa-plus-square"></i>
          </span>
        </p>
      </article>
    `
  }
}

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
    // console.log('cardDetails:', cardDetails);
    document.querySelector('.autocomplete-summary').innerHTML = cardTemplate(cardDetails);
}

const addDupeToDeck = cardDetails => {
  // console.log('addDupeToDeck cardDetails:', cardDetails);
  cardDetails.count += 1;
}

const addCardToDeck = (cardDetails) => {
  // console.log('adding card: ', cardDetails);
  let alreadyAdded = '';
  for (let card of userDeck) {
    if (card.id === cardDetails.id) {
      alreadyAdded = cardDetails.id;
      if (card.count < 4) {
        addDupeToDeck(card);
      } else if (card.count === 4) {
        alert('Maximum 4 cards of any one type in a deck');
      } 
    }
  }

  if (alreadyAdded.length < 1) {
    cardDetails.count = 1;
    userDeck.push(cardDetails);
  } 

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
  // console.log('update deck executing...');
  document.querySelector('#deck-count-div').innerHTML = `Your deck (${deckSize(userDeck)} cards)`;
  renderManaCurve();
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
        // 4 card maximum per deck
        if (userDeck[i].count < 4 || (userDeck[i].type_line).includes("Basic Land")) {
          userDeck[i].count += 1;
          countElement.innerHTML = userDeck[i].count;
          updateDeckCount();
        } else {
          alert('Maximum 4 cards of any one type in a deck');
        }       
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

const manaCurve = () => {
  // console.log('manaCurve executing');
  let curve = [0,0,0,0,0,0];

  for (let card of userDeck) {
    const cmc = card.cmc;
    if (cmc > 6) {
      curve[5] += card.count;
    } else {
      curve[cmc-1] += card.count;
    }
    // console.log(curve);
  }
  return curve;
}

const sortBy = (field, reverse, primer) => {
  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };

  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

// count number of specified mana colors in deck
const manaColorSummary = (userDeck) => {
  const manaColors = [
    { 
      color: 'W',
      count:0
    },
    { 
      color: 'U',
      count:0
    },
    { 
      color: 'B',
      count:0
    },
    { 
      color: 'R',
      count:0
    },
    { 
      color: 'G',
      count:0
    },
    { 
      color: 'C',
      count:0
    }
  ]
  for (let card of userDeck) {
    const colors = card.mana_cost.replace(/[^a-zA-Z ]/g, "")    
    const manaColor = manaColors.filter(obj => {
      return obj.color === card.colors[0]
    })
    manaColor[0].count += colors.length;
  }
  // console.log('manaColors:', manaColors);
  return manaColors;
}

const colorConverter = (abbreviation) => {
  switch(abbreviation) {
    case 'W':
      return 'White';
      break;
    case 'U':
      return 'Blue';
      break;
    case 'B':
      return 'Black';
      break;
    case 'R':
      return 'Red';
      break;
    case 'G':
      return 'Green';
      break;
    case 'C':
      return 'Wastes';
      break;
    default:
      break;
  }
}

const renderManaColors = () => {
  const manas = manaColorSummary(userDeck);
  let htmlToRender = ``;
  for (let mana of manas) {
    if (mana.count > 0) {
      htmlToRender += `<li class="mana-color-li">${colorConverter(mana.color)}: ${mana.count}</li>`;
    }
  }
  const htmlToRenderUl = `<ul>${htmlToRender}</ul>`
  document.querySelector('.mana-colors').innerHTML = htmlToRenderUl;
}