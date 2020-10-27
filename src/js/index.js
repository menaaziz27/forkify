import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, loader, removeLoader } from './views/base';

const state = {};

const controlSearch = async () => {

    // 1- get query from view
    // const query = searchView.getInput();

    // TESTING
    const query = 'pizza';

    if (query) {

        // 2- new search object and add to state
        state.search = new Search(query);

        // 3- prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        loader(elements.searchRes);

        try {

            // 4- search for recipe
            await state.search.getResults();

            // 5- Render result on UI 
            removeLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something went wrong with search ...');
            removeLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING
window.addEventListener('load', e => {
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


const controlRecipe = async () => {

    const id = window.location.hash.replace('#', ''); // this returns a number of type string 
    console.log(id);

    if (id) {

        // prepare UI for changes

        // create a new recipe obj 
        state.recipe = new Recipe(id);

        //TESTING
        window.r = state.recipe;

        try {
            // get recipe data 
            await state.recipe.getRecipe();

            // calculate serving and time 
            state.recipe.calcTime();
            state.recipe.calcServing();

            // render recipe 
            console.log(state.recipe);

        } catch (err) {

            alert('Error processing recipe.');

        }
    }
}

window.addEventListener('hashchange', controlRecipe);






// const r = new Recipe('f852ec');
// r.getRecipe();
// console.log(r);