const selectScript = () => {
    document.querySelector('#sort-cards').addEventListener('change', function(e) {
        const target = e.target.value;
        // console.log('target:', target);
    
        switch(target) {
        case 'mana-cost':
            userDeck.sort(sortBy('cmc', false, parseInt));
            break;
        case 'mana-cost-rev':
            userDeck.sort(sortBy('cmc', true, parseInt));
            break;
        case 'rarity':
            userDeck.sort(sortBy('rarity', false, (a) =>  a.toUpperCase()))
            break;
        case 'name':
            userDeck.sort(sortBy('name', false, (a) =>  a.toUpperCase()))
            break;
        case 'name-reverse':
            userDeck.sort(sortBy('name', true, (a) =>  a.toUpperCase()))
            break;
        default:
            break;
        }
        renderDeck();
    });
}