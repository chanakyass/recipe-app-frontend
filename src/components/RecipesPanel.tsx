import { useCallback, useEffect } from "react";
import history from "../app-history";
import { useModalState } from "../customHooks";
import { getRecipeList } from "../store/recipeSlice";
import { Recipe, useAppDispatch, useRecipeSelector } from "../store/store.model";
import CompleteRecipeCardModal from "./CompleteRecipeCardModal";
import RecipeCard from "./RecipeCard";
import withLoading from "./LoadingPage";

const RecipesPanel = () => {
    const recipeIds = useRecipeSelector((state) => {
       return Object.keys(state.recipes.resourceMap).map((key) => parseInt(key)) || [];
    });
    const dispatch = useAppDispatch();
    
    const [modalProps, setModalProps] = useModalState<Recipe>({ showModal: false, resource: null });
        
    useEffect(() => {
        dispatch(getRecipeList());
    }, [dispatch]);




    const viewRecipe = useCallback((recipe: Recipe) => {
        setModalProps((modalProps) => ({ ...modalProps, showModal: true, resource: recipe }));
    }, [setModalProps])


    return <>               
                <>
                {
                    modalProps.showModal === true && modalProps.resource !== null
                        && <CompleteRecipeCardModal modalProps={modalProps} setModalProps={setModalProps} />
                }
                </>
                <div className="container recipe-panel">
                    <div className="row p-3">
                            {
                                [-1, ...recipeIds].map((id, index) => (
                                     index === 0 ? <div key={id} className="col-md-3 col-lg-3 col-sm-3 m-4 rounded shadow grow" style={{ cursor: "pointer" }} onClick={() => history.push({
                                        pathname: `/recipe/new`,
                                        state: {mode: "ADD", recipeToModify: null}

                                            })}>

                                            <div className="row h-100">
                                            <div className="my-auto mx-auto">Click here to add a new Recipe</div>
                                            </div>
                                        </div> :  
                                

                                     <RecipeCard recipeId={id} key={id} viewRecipe={viewRecipe} />
                                ))
                            }
                    </div>
                </div>
            </>
    
}

export default withLoading(RecipesPanel);
