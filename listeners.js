const selectScript = () => {
    document.querySelector('#sort-cards').addEventListener('change', function(e) {
        // console.log('query option selected');
        // console.log(e);
        const target = e.target.value;
        // console.log('target:', target);
    
        switch(target) {
        case 'mana-cost':
            // code block
            userDeck.sort(sortBy('cmc', false, parseInt));
            break;
        case 'mana-cost-rev':
            // code block
            userDeck.sort(sortBy('cmc', true, parseInt));
            break;
        case 'rarity':
            // code block
            userDeck.sort(sortBy('rarity', false, (a) =>  a.toUpperCase()))
            break;
        case 'name':
            // code block
            userDeck.sort(sortBy('name', false, (a) =>  a.toUpperCase()))
            break;
        case 'name-reverse':
            // code block
            userDeck.sort(sortBy('name', true, (a) =>  a.toUpperCase()))
            break;
        default:
            // code block
        }
        renderDeck();
    });
}