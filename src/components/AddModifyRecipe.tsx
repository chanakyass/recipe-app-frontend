import { useCallback, useEffect, useState } from "react";
import { Button, Col, Form, FormControl, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import history from "../app-history";
import { addRecipe, fetchIngredientsStartingWithName, modifyRecipe } from "../store/recipeSlice";
import { Ingredient, Recipe, RecipeIngredient, ThunkResponse, UserProxy, useAppDispatch, useRecipeSelector, useUserSelector } from "../store/store.model";
import { convertStringToCapitalCamelCase, debounced, equalsIgnoringCase } from "../util/utility-functions";

const AddModifyRecipe = () => {

  const dispatch = useAppDispatch();

  const [recipe, setRecipe] = useState<Recipe>({
    name: '',
    description: '',
    createdOn: '',
    itemType: '',
    serving: '',
    recipeImageAddress: '',
    cookingInstructions: '',
    recipeIngredients: [] as RecipeIngredient[],
    user: {} as UserProxy
  } as Recipe);

  const [ingredientListFetched, setIngredientListFetched] = useState({ingredientsList: [] as Ingredient[]});


  const { id } = useParams<{ id: string }>();

  const [mode, setMode] = useState('');

  const loggedInUser = useUserSelector((state) => state.users.loggedInUser);

  useEffect(() => {
    if (id !== "new") {
      setMode('MODIFY');
    } else {
      setMode('ADD');
      setRecipe((recipe) => ({
        ...recipe,
        user: {
          id: loggedInUser.id!,
          email: loggedInUser.email,
          profileName: loggedInUser.profileName,
        }
      }));
    }
  }, [id, loggedInUser, setRecipe])

  const recipeToModify = useRecipeSelector((state) => {
    if (id !== 'new') {
      const recipe = state.recipes.resourceMap[parseInt(id)];
      return recipe;
    }
    return undefined;
  }) as Recipe;

  useEffect(() => {
    if (recipeToModify) {
      setRecipe(recipeToModify);
    }
  }, [recipeToModify, setRecipe]);

  const handleChange = useCallback((e: any) => {
    e.preventDefault();
    if (e.target?.files[0]) {
      setRecipe((recipe) => ({
        ...recipe,
        image: e.target.files[0],
      }));
    }
  }, [setRecipe]);
  
  const uomList = ["Select", "MILLIGRAMS", "GRAMS", "KILOGRAMS", "MILLILITRES", "LITRES", "TEA_SPOON", "TABLE_SPOON", "NUMBER"];

  const changeDefaults = useCallback((e: any) => {
    const name: string = e.target?.name;
    const value: string = e.target?.value;
    setRecipe({ ...recipe, [name]: value })
  }, [setRecipe, recipe]);

  const fetchIngredientsEventHandler = (e: any) => {
    const ingredientName = e.target?.value;
    if (ingredientName) {
      dispatch(fetchIngredientsStartingWithName(ingredientName)).then((response) => {
        let ingredientsList = response.payload as Ingredient[] || [];
        setIngredientListFetched({
          ...ingredientListFetched,
          ingredientsList: ingredientsList,
        });
      });
    }
  }


  const changeRecipeIngredient = useCallback((targetName: string, targetValue: string, uuid?: string) => {
    const name = targetName.split("_")[2].trim();
    const value = targetValue.replace(/\s+/g, ' ');

    if (equalsIgnoringCase(name, "name")) {
      let ingredient1 = ingredientListFetched.ingredientsList.find((ingredient) => equalsIgnoringCase(ingredient.name, value));
      setRecipe((recipe) => {
        let ll = recipe.recipeIngredients.map((recipeIngredient) => {
          if (uuid && recipeIngredient.uuid && equalsIgnoringCase(recipeIngredient.uuid, uuid)) {
            const ri = {
              ...recipeIngredient,
              ingredient: (ingredient1 === undefined) ? { ...recipeIngredient.ingredient, [name]: value } : {...ingredient1, [name]: value},
            };
            return ri;
          }
          return recipeIngredient;
        });
        return { ...recipe, recipeIngredients: ll };
      });
    }
    else {
      setRecipe((recipe) => {
        let ll = recipe.recipeIngredients.map((recipeIngredient) => {
          if (uuid && recipeIngredient.uuid && equalsIgnoringCase(recipeIngredient.uuid, uuid)) {
            return { ...recipeIngredient, ingredient: { ...recipeIngredient.ingredient }, [name]: value };
          }
          return recipeIngredient;
        });
        return { ...recipe, recipeIngredients: ll };
      });
    }
  }, [setRecipe, ingredientListFetched])

  const addNewIngredient = useCallback((_: any) => {
    setRecipe((recipe) => {
      return {
        ...recipe,
        recipeIngredients: [
          ...recipe.recipeIngredients,
          {
            ingredient: {
              name: '',
            },
            uuid: uuidv4()
          }
        ],
      };
    });
  }, [setRecipe])

  const removeIngredient = useCallback((_: any, uuid?: string) => {
    setRecipe(recipe => {
      let ll = recipe.recipeIngredients.filter(recipeIngredient => !equalsIgnoringCase(recipeIngredient.uuid!, uuid!));
      return {...recipe, recipeIngredients: ll};
    });
  }, [setRecipe])
  
  const submitHandler = useCallback(async (e: Event) => {
    e.preventDefault();
    let thunkResponse;
    if (mode === 'MODIFY') {
      thunkResponse = await dispatch(modifyRecipe(recipe)).unwrap();
    } else {
      thunkResponse = await dispatch(addRecipe(recipe)).unwrap();
    }
    if (thunkResponse === ThunkResponse.SUCCESS) {
      history.push('/');
    }
  }, [recipe, dispatch, mode])

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
                <Form.Check
                  inline
                  label="Veg"
                  name="itemType"
                  type='radio'
                  id='itemType'
                  value='VEG'
                  onChange={changeDefaults}
                  checked={recipe.itemType === 'VEG'}
                />
                <Form.Check
                  inline
                  label="Non-Veg"
                  name="itemType"
                  type='radio'
                  id='itemType'
                  value='NON_VEG'
                  onChange={changeDefaults}
                  checked={recipe.itemType === 'NON_VEG'}
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
                          className="border-0 px-0 d-flex"
                        >
                          <InputGroup>
                            <FormControl
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
                              onChange={(e: any) => {
                                e.preventDefault();
                                debounced(fetchIngredientsEventHandler, 300, e);
                                changeRecipeIngredient(
                                  e.target.name,
                                  e.target.value,
                                  recipeIngredient.uuid
                                );
                              }}
                              onBlur={(e: any) => {
                                changeRecipeIngredient(
                                  e.target.name,
                                  convertStringToCapitalCamelCase(e.target.value),
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
                                id={`recipeIngredient_${recipeIngredient.uuid}_quantity`}
                                name={`recipeIngredient_${recipeIngredient.uuid}_quantity`}
                                placeholder="measurement"
                                aria-describedby="basic-addon2"
                                value={recipeIngredient.quantity}
                                onChange={(e: any) =>
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
                                id={`recipeIngredient_${recipeIngredient.ingredient.name}_uom`}
                                name={`recipeIngredient_${recipeIngredient.ingredient.name}_uom`}
                                as="select"
                                value={recipeIngredient.uom}
                                
                                onChange={(e: any) =>
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
                                className="link-button my-2 mx-2"
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