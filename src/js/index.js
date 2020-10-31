import Search from './models/Search';
import Recipe from './models/Recipe';
import Likes from './models/Likes';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, loader, removeLoader } from './views/base';

const state = {};
window.state = state;

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

        try {

            // 4- search for recipe and parse the ingredient
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

    // Get ID from url
    const id = window.location.hash.replace('#', ''); // returns number in string type

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        loader(elements.recipe);

        // highlight seleceted search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            // Render recipe
            removeLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

const controlList = () => {
    // Create a new list if there is none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

}

// TODO:
// TESTING
state.likes = new Likes();
likeView.toggleLikesMenu(state.likes.getNumLikes());

// Like controller
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not liked current recipe 
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button 
        likeView.toggleLikeBtn(true);
        // add like to UI list
        likeView.renderLike(newLike);
        // User  HAS liked current recipe  
    } else {
        // remove likes from the state
        state.likes.deleteLike(currentID);
        // toggle the like button 
        likeView.toggleLikeBtn(false);
        // remove like from ui
        likeView.deleteLike(currentID)
    }
    likeView.toggleLikesMenu(state.likes.getNumLikes());

}


// handle update and delete list item events 
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked 
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateRecipeServings(state.recipe)
        }
    } else if (e.target.matches('btn-increase, .btn-increase *')) {
        // Increase button is clicked 
        state.recipe.updateServings('inc');
        recipeView.updateRecipeServings(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }

});

window.l = new List();