import { useEffect, useState } from "react";
import { fetchIngredientsStartingWith, addOrModifyRecipe, getRecipe } from "./services/recipe-services";
import { equalsIgnoringCase, debounced, convertStringToCapitalCamelCase } from "../util/utility-functions";
import { v4 as uuidv4 } from 'uuid';
import { Form, Col, ListGroup, ListGroupItem, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import history from "../app-history";
import { handleError } from "../util/error-handling";
import { storage } from "../firebase";
import cookie from 'react-cookies';

const AddModifyRecipe = () => {  
  const [recipe, setRecipe] = useState({
        id: null,
        name: "",
        description: "",
        createdOn: "",
        itemType: "",
        serving: null,
        recipeIngredients: [],
        user: {
            id: null
        },
        cookingInstructions: ""
    });
  
  //const history = useHistory();

  let mode = null;

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState("");


  const { id } = useParams();

    if (id !== "new") {
      mode = "MODIFY";
  }
    else {
      mode = "ADD";
  }

  const loggedInUser = cookie.load('current_user');

  const loadRecipe = (id) => {
        getRecipe(id).then(({ response, error }) => {
          if (!error) {
            const recipeToModify = response;
            const recipeIngredients = recipeToModify.recipeIngredients.map(
              (recipeIngredient) => {
                return { ...recipeIngredient, uuid: uuidv4() };
              }
            );
            setRecipe({
              ...recipeToModify,
              recipeIngredients: [...recipeIngredients],
            });
          } else handleError({error: error})
        });
  }

  const handleChange = (e) => {
    e.preventDefault();
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
  };
  
  const handleUpload = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`images/${loggedInUser.id}/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = Math.round(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
          setProgress("wait");
      },
      (error) => {
        handleError({error: error})
      },
      () => {
        setProgress("done");
        storage
          .ref(`images/${loggedInUser.id}`)
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setRecipe({ ...recipe, recipeImageAddress: url });
          });
      }
    );
  };
  



      
  useEffect(() => {
    if (mode === "MODIFY") {
      loadRecipe(id);
    }
  }, [mode, id]);
  
  const [ingredientListFetched, setIngredientListFetched] = useState({ingredientsList: []});
  
  const uomList = ["MILLIGRAMS", "GRAMS", "KILOGRAMS", "MILLILITRES", "LITRES", "TEA_SPOON", "TABLE_SPOON", "NUMBER"];

  const changeDefaults = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRecipe({ ...recipe, [name]: value })
  };

  const fetchIngredientsEventHandler =  (e) => {
    const ingredientName = e.target.value;
    if (ingredientName) {
      fetchIngredientsStartingWith(ingredientName).then(({ response, error }) => {
        if (!error) {
          let ingredientsList = response;
          setIngredientListFetched({
            ...ingredientListFetched,
            ingredientsList: ingredientsList,
          });
        }
        else {
          //handleError({error: error})
        }
      });
    }
  }


  const changeRecipeIngredient = (targetName, targetValue, uuid) => {
    const name = targetName.split("_")[2].trim();
    const value = targetValue.trim();

    if (equalsIgnoringCase(name, "name")) {
      let ingredient1 = ingredientListFetched.ingredientsList.find((ingredient) => equalsIgnoringCase(ingredient.name, value));
      setRecipe((recipe) => {
        let ll = recipe.recipeIngredients.map((recipeIngredient) => {
          if (equalsIgnoringCase(recipeIngredient.uuid, uuid)) {
            return {
              ...recipeIngredient,
              ingredient: (ingredient1 === undefined) ? { [name]: convertStringToCapitalCamelCase(value) } : {...ingredient1, [name]: convertStringToCapitalCamelCase(value)},
            };
          }
          return recipeIngredient;
        });
        return { ...recipe, recipeIngredients: ll };
      });
    }
    else {

      setRecipe((recipe) => {
        let ll = recipe.recipeIngredients.map((recipeIngredient) => {
          if (equalsIgnoringCase(recipeIngredient.uuid, uuid)) {
            return { ...recipeIngredient, ingredient: { ...recipeIngredient.ingredient }, [name]: value };
          }
          return recipeIngredient;
        });
        return { ...recipe, recipeIngredients: ll };
      });
    }
  }

  const addNewIngredient = (e) => {
    setRecipe(recipe => {
      return {
        ...recipe,
        recipeIngredients: [
          ...recipe.recipeIngredients,
          {
            ingredient: {
              name: "",
            },
            quantity: null,
            uom: null,
            uuid: uuidv4()
          }
        ],
      };
    });
  }

  const removeIngredient = (e, uuid) => {
    setRecipe(recipe => {
      let ll = recipe.recipeIngredients.filter(recipeIngredient => !equalsIgnoringCase(recipeIngredient.uuid, uuid));
      return {...recipe, recipeIngredients: ll};
    });
  }
  
  const submitHandler = (e) => {
    e.preventDefault();
      addOrModifyRecipe(recipe, mode).then(({ response, error }) => {
        if (error) {
          handleError({ error: error });
        } else {
          const apiMessageResponse = response;
          if (mode === "ADD") {
            setRecipe({ ...recipe, id: apiMessageResponse.generatedId });
          }
          history.push('/');
        }
      });
  }

    return (
      <div style={{ height: "80vh", maxHeight: "80vh" }}>
        <div className="row h-100 m-4">
          <div className="col-md-5 col-lg-5 col-sm-5 mx-auto my-auto rounded shadow bg-white ">
            <div className="col-md-12 col-sm-12 col-lg-12 mx-auto mt-3">
              <h3>{mode === "MODIFY" ? "Modify Recipe" : "Add Recipe"}</h3>
            </div>
            <Form noValidate onSubmit={submitHandler}>
              <Form.Group as={Col} md={12}>
                <Form.Label>Recipe Name</Form.Label>
                <Form.Control
                  id="name"
                  name="name"
                  type="text"
                  value={recipe.name}
                  onChange={changeDefaults}
                />
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>Recipe Image</Form.Label>
                <Form.Control
                  type="file"
                  id="recipeImageAddress"
                  name="recipeImageAddress"
                  onChange={handleChange}
                />
                <button className="link-button" onClick={handleUpload}>Upload image</button>
                <div>{progress}</div>
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <Form.Label>Small Description</Form.Label>
                <Form.Control
                  id="description"
                  name="description"
                  type="text"
                  value={recipe.description}
                  onChange={changeDefaults}
                />
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <Form.Label>Veg or Non Veg</Form.Label>
                <Form.Control
                  id="itemType"
                  name="itemType"
                  type="text"
                  value={recipe.itemType}
                  onChange={changeDefaults}
                />
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <Form.Label>No of people item can serve</Form.Label>
                <Form.Control
                  id="serving"
                  name="serving"
                  type="text"
                  value={recipe.serving}
                  onChange={changeDefaults}
                />
              </Form.Group>

              <Form.Group as={Col} md={12}>
                <div>
                  <ListGroup className="list-group-flush">
                    {recipe.recipeIngredients.map((recipeIngredient, index) => {
                      return (
                        <ListGroupItem
                          key={recipeIngredient.uuid}
                          className="border-0"
                        >
                          <InputGroup>
                            <FormControl
                              className="mx-1"
                              id={`recipeIngredient_${recipeIngredient.uuid}_name`}
                              name={`recipeIngredient_${recipeIngredient.uuid}_name`}
                              placeholder="Ingredient name"
                              type="text"
                              value={recipeIngredient.ingredient.name}
                              disabled={
                                recipeIngredient.id !== null &&
                                recipeIngredient.id !== undefined
                              }
                              list="ingredientsList"
                              onChange={(e) => {
                                e.preventDefault();
                                debounced(fetchIngredientsEventHandler, 300, e);
                                changeRecipeIngredient(
                                  e.target.name,
                                  e.target.value,
                                  recipeIngredient.uuid
                                );
                              }}
                            />
                            <datalist id="ingredientsList">
                              {ingredientListFetched.ingredientsList &&
                                ingredientListFetched.ingredientsList.map(
                                  (ingredient) => {
                                    let name = convertStringToCapitalCamelCase(
                                      ingredient.name
                                    );
                                    return <option>{name}</option>;
                                  }
                                )}
                            </datalist>
                            <InputGroup.Append>
                              <FormControl
                                className="mx-1"
                                id={`recipeIngredient_${recipeIngredient.uuid}_quantity`}
                                name={`recipeIngredient_${recipeIngredient.uuid}_quantity`}
                                placeholder="measurement"
                                aria-describedby="basic-addon2"
                                value={recipeIngredient.quantity}
                                onChange={(e) =>
                                  changeRecipeIngredient(
                                    e.target.name,
                                    e.target.value,
                                    recipeIngredient.uuid
                                  )
                                }
                              />
                            </InputGroup.Append>

                            <InputGroup.Append>
                              <Form.Control
                                className="mx-1"
                                id={`recipeIngredient_${recipeIngredient.ingredient.name}_uom`}
                                name={`recipeIngredient_${recipeIngredient.ingredient.name}_uom`}
                                as="select"
                                value={recipeIngredient.uom}
                                onChange={(e) =>
                                  changeRecipeIngredient(
                                    e.target.name,
                                    e.target.value,
                                    recipeIngredient.uuid
                                  )
                                }
                              >
                                {uomList.map((uom, index2) => {
                                  return <option>{uom}</option>;
                                })}
                              </Form.Control>
                            </InputGroup.Append>

                            <InputGroup.Append>
                              <button
                                className="link-button my-2 mx-3"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeIngredient(e, recipeIngredient.uuid);
                                }}
                              >
                                Remove
                              </button>
                            </InputGroup.Append>
                          </InputGroup>
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>

                  <button
                    className="link-button"
                    onClick={(e) => {
                      e.preventDefault();
                      addNewIngredient(e);
                    }}
                  >
                    Add ingredient
                  </button>
                </div>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Control
                  id="cookingInstructions"
                  name="cookingInstructions"
                  as="textarea"
                  rows={10}
                  value={recipe.cookingInstructions}
                  onChange={changeDefaults}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Button className="my-5" type="submit">
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      // </div>
    );
}

export default AddModifyRecipe;