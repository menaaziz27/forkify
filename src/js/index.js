import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, loader, removeLoader } from './views/base';

const state = {};

const controlSearch = async () => {

    // 1- get query from view
    const query = searchView.getInput();

    if (query) {

        // 2- new search object and add to state
        state.search = new Search(query);

        // 3- prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        loader(elements.searchRes);


        // 4- search for recipe
        await state.search.getResults();

        // 5- Render result on UI 
        removeLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Event delegation 
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // finds the closest element with btn-inline class and select it 
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // base 10
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage);
    }

})
