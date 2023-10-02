import {
    Card,
    ListGroup,
    ListGroupItem
}
 from "react-bootstrap";
import { Recipe, useRecipeSelector } from "../store/store.model";

const RecipeCard = ({ recipeId, viewRecipe }: { recipeId: number, viewRecipe: (recipe: Recipe) => void }) => {
    const vegPng = process.env.PUBLIC_URL + "/veg.png";
    const nonVegPng = process.env.PUBLIC_URL + "/non-veg.png";
    const servingPng = process.env.PUBLIC_URL + "/SERVES.png";

    const recipe = useRecipeSelector((state) => state.recipes.resourceMap[recipeId]);

    return <>
        <div className="col-md-3 col-lg-3 col-sm-3 m-4 rounded shadow grow" style={{ cursor: "pointer" }} onClick={ () => viewRecipe(recipe) }>
            <Card className="border-0">
                <Card.Img variant="top" src={recipe.recipeImageAddress}/>
                <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>
                    <Card.Text>
                        { recipe.description }
                    </Card.Text>
                </Card.Body>
                    <Card.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-lg-6 col-sm-6">
                                    <img src={ recipe.itemType === "VEG" ? vegPng: nonVegPng} alt="Unavailable"/>
                                </div>
                                <div className="col-md-6 col-lg-6 col-sm-6">
                                        <img src={ servingPng } alt="Unavailable"/> { recipe.serving }
                                </div>
                            </div>
                        </div>
                </Card.Body>
                <div hidden={true}>
                    <ListGroup className="list-group-flush">
                        {
                            recipe.recipeIngredients.map((recipeIngredient) => {
                                return (<ListGroupItem key={recipeIngredient.uuid}>
                                    {
                                        recipeIngredient.quantity + " " + recipeIngredient.uom + " " + recipeIngredient.ingredient.name
                                    }
                                </ListGroupItem>)
                            })
                        }
                    </ListGroup>
                    <Card.Body>
                        {recipe.cookingInstructions}
                    </Card.Body>
                </div>
            </Card>
        </div>
        </>

    
}

export default RecipeCard;