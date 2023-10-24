// @ts-nocheck
import { useCallback } from "react";
import {
    Button, Card, ListGroup, ListGroupItem,
    Modal
} from "react-bootstrap";
import { useHistory } from "react-router";
import { ModalProps, SetModalPropsType } from "../customHooks";
import { deleteRecipe } from "../store/recipe";
import { Recipe, ThunkResponse, useAppDispatch, useUserSelector } from "../store/store.model";
import { convertDateToReadableFormat } from "../util/utility-functions";

const CompleteRecipeCardModal = ({ modalProps, setModalProps }: { modalProps: ModalProps<Recipe>, setModalProps: SetModalPropsType<Recipe>}) => {
    const history = useHistory();
    const { resource, showModal } = modalProps;
    const recipe = resource!;
    const vegPng = process.env.PUBLIC_URL + "/veg.png";
    const nonVegPng = process.env.PUBLIC_URL + "/non-veg.png";
    const servingPng = process.env.PUBLIC_URL + "/SERVES.png";

    const currentUser = useUserSelector((state) => state.users.loggedInUser);
    const dispatch = useAppDispatch();

    const deleteHandler = useCallback((e: Event, recipe: Recipe) => {
        e.preventDefault();
        dispatch(deleteRecipe(recipe)).unwrap().then((thunkResponse) => {
            if (thunkResponse === ThunkResponse.SUCCESS) {
                setModalProps({ ...modalProps!, showModal: false });
                history.push('/');
            }
        })
    }, [dispatch, setModalProps, modalProps, history]);

    return <div data-testid={`complete-recipe-modal-${recipe.id}`}>
            <Modal aria-labelledby="contained-modal-title-vcenter" size="md" show={showModal} onHide={() => setModalProps({...modalProps, showModal: false})}>
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
                                    <div><p className="mx-1"><b>Created By</b></p><button className="mx-1 link-button" onClick={e => history.push(`/profile/${recipe.user.id}`)}>{recipe.user.profileName}</button></div>
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
            </Modal.Body>
            <Modal.Footer>
                {currentUser.id === recipe.user.id && <Button data-testid='modifyRecipeButton' onClick={() => history.push({ pathname: `/recipe/${recipe.id}`, state: { data: recipe, mode: 'MODIFY' } })}>Modify</Button>}
                {currentUser.id === recipe.user.id && <Button data-testid='deleteRecipeButton' onClick={(e: any) => deleteHandler(e, recipe)}>Delete</Button>}
                <Button onClick={() => setModalProps({resource: recipe, showModal: false})}>Close</Button>
            </Modal.Footer>
            </Modal>
        </div>
}

export default CompleteRecipeCardModal;