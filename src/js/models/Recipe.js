import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);
        } catch (err) {
            // console.log(err);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 mins for each 3 ingredients
        const numOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numOfIngredients / 3);
        this.time = periods * 15;
    }

    calcServing() {
        this.servings = 4;
    }
}


// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);