const createAutoComplete = ({ root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData,
    placeholder 
}) => {
    root.innerHTML = `
      <label><b>Search</b></label>
      <input placeholder="${placeholder}" class="input" />
      <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results"></div>
        </div>
      </div>
    `;
    
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    
    const onInput = async event => {
      try {
        const request = await fetchData(event.target.value);
        console.log('request:', request);  
        const items = request.data;

        // handling empty response
        if (!items.length) {
          dropdown.classList.remove('is-active');
          // exit 'onInput' function
          return;
        }
      
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
          // console.log('item: ',item);
          const option = document.createElement('a');
      
          option.classList.add('dropdown-item');
          option.innerHTML = renderOption(item);
          option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
          });
      
          resultsWrapper.appendChild(option);
        }
      } catch(e) {
        console.log('error: ', e);
        alert('No cards match search term');
      }
    };
    input.addEventListener('input', debounce(onInput, 500));
    
    document.addEventListener('click', (e) => {
      // console.log(e.target);
      // click outside of root element (i.e. the widget) will close dropdown
      if (!root.contains(e.target)) {
        dropdown.classList.remove('is-active');
      }
    });
    
}