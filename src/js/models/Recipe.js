import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios()
        } catch (err) {
            console.log(err);
        }
    }
}


// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);