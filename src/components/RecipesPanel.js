import { useState, useEffect, useCallback } from "react";
import RecipeCard from "./RecipeCard";
import CompleteRecipeCardModal from "./CompleteRecipeCardModal";
import history from "../app-history";
import { getRecipes } from "./services/recipe-services";
import { handleError } from "../util/error-handling";

const RecipesPanel = () => {
    const [recipes, setRecipes] = useState([])

    const [modalProps, setModalProps] = useState({ "showModal": false, "recipe": null });
    

    const loadRecipes = useCallback(async () => {

        getRecipes().then(({ response, error }) => {
            if (!error) {
                const recipeList = response;
                setRecipes([...recipeList]);
            }
            else {
                handleError({ error: error });
            }
        })

    }, []);
        
    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);




    const viewRecipe = (recipe) => {
        setModalProps({ ...modalProps, "showModal": true, "recipe": recipe });
    }


    return <>
        {modalProps.showModal === true && <CompleteRecipeCardModal modalProps={modalProps} setModalProps={setModalProps} setRecipies={ setRecipes }  />}
        <div className="container">
            <div className="row p-3">
                    {
                    (recipes.length > 0) ? recipes.map((recipe, index) => {
                        if (index === 0) {
                            return <>
                            <div className="col-md-3 col-lg-3 col-sm-3 m-4 rounded shadow grow" style={{ cursor: "pointer" }} onClick={() => history.push({
                                pathname: `/recipe/new`,
                                state: {mode: "ADD", recipeToModify: null}

                                    })}>

                                    <div className="row h-100">
                                    <div className="my-auto mx-auto">Click here to add a new Recipe</div>
                                    </div>
                      

                            </div>
                            <RecipeCard recipe={recipe} setRecipies={setRecipes} key={recipe.id} hideAdditionalDetails={true} viewRecipe={viewRecipe} />
                            </>    
                        }
                        else {
                            return <RecipeCard recipe={recipe} setRecipies={setRecipes} key={recipe.id} hideAdditionalDetails={true} viewRecipe={viewRecipe} />
                        }

                        })
                        :
                        <div className="col-md-3 col-lg-3 col-sm-3 m-4 rounded shadow grow" style={{ cursor: "pointer" }} onClick={() => history.push({
                            pathname: `/recipe/new`,
                            state: {mode: "ADD", recipeToModify: null}

                                })}>

                                <div className="row h-100">
                                <div className="my-auto mx-auto">Click here to add a new Recipe</div>
                                </div>
                  

                        </div>
                    }
            </div>
        </div>
    </>
    
}

export default RecipesPanel;
