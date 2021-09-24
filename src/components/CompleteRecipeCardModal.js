import {
  Modal, Button, Card, ListGroup, ListGroupItem
} from "react-bootstrap";
import history from "../app-history";
import cookie from 'react-cookies';
import { deleteRecipe } from "./services/recipe-services";
import { handleError } from "../util/error-handling";
import { convertDateToReadableFormat } from "../util/utility-functions";

const CompleteRecipeCardModal = ({ modalProps, setModalProps, setRecipies }) => {
    const { recipe, showModal } = modalProps;
    const vegPng = process.env.PUBLIC_URL + "/veg.png";
    const nonVegPng = process.env.PUBLIC_URL + "/non-veg.png";
    const servingPng = process.env.PUBLIC_URL + "/SERVES.png";

    const currentUser = cookie.load('current_user');
    console.log(currentUser)

    const deleteHandler = (e, recipeId) => {
        e.preventDefault();
        deleteRecipe(recipeId).then(({ response, error }) => {
            if (!error) {
                setRecipies(recipies => recipies.filter(recipe => recipe.id !== recipeId));
                setModalProps({ ...modalProps, showModal: false });
                history.push("/");
            }
            else {
                handleError({ error: error });
            }
        })
    }

    
    return <>
            <Modal aria-labelledby="contained-modal-title-vcenter" size="md" show={showModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                    <Card className="border-0">
                        <Card.Img variant="top" src={ recipe.recipeImageAddress } />
                        <Card.Body>
                            <Card.Title>{recipe.name}</Card.Title>
                            <Card.Text>
                                { recipe.description }
                            </Card.Text>
                        </Card.Body>
                            <Card.Body>
                                <div className="container">
                                    <div className="row mb-5">
                                        <div className="col-md-6 col-lg-6 col-sm-6">
                                            <img src={ recipe.itemType === "VEG" ? vegPng: nonVegPng} alt="Unavilable"/>
                                        </div>
                                        <div className="col-md-6 col-lg-6 col-sm-6">
                                                <img src={ servingPng } alt="Unavailable" /> { recipe.serving }
                                        </div>
                                    </div>

                                    <div className="row mt-5">
                                        <div className="col-md-6 col-lg-6 col-sm-6">
                                    <div><p className="mx-1"><b>Created By</b></p><button className="mx-1 link-button" onClick={e => history.push(`/profile/${recipe.user.id}`)}>{recipe.user.firstName + " " + recipe.user.lastName}</button></div>
                                        </div>
                                        <div className="col-md-6 col-lg-6 col-sm-6">
                                            <div><p className="mx-2"><b>Created on</b></p><p className="mx-2">{convertDateToReadableFormat(recipe.createdOn)}</p></div>
                                        </div>
                                    </div>
                                </div>
                        </Card.Body>
                        <div>
                            <ListGroup className="list-group-flush">
                                {
                                    recipe.recipeIngredients.map((recipeIngredient, index) => {
                                        return (<ListGroupItem>
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
            </Modal.Body>
            <Modal.Footer>
                {currentUser.id === recipe.user.id && <Button onClick={(e) => history.push({ pathname: `/recipe/${recipe.id}`, state: { data: recipe, mode: 'MODIFY' } })}>Modify</Button>}
                {currentUser.id === recipe.user.id && <Button onClick={(e) => deleteHandler(e, recipe.id)}>Delete</Button>}
                <Button onClick={() => setModalProps({"recipe": recipe, "showModal": false})}>Close</Button>
            </Modal.Footer>
            </Modal>
        </>
}

export default CompleteRecipeCardModal;