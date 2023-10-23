import { v4 } from 'uuid';
import mockRecipes from '../recipes/mockGetRecipesRes.json';  
import { Recipe, ResourceState } from '../../../store/store.model';
import mockUserRes from '../users/mockUserRes.json';

  const map = new Map(mockRecipes.map((recipe) => [recipe.id, { ...recipe, recipeIngredients: recipe.recipeIngredients.map((ri) => ({
    ...ri,
    uuid: v4(),
  })) }]));
  
  const recipesState = {
    resourceMap: Object.fromEntries(map),
    loading: false,
  } as ResourceState<Recipe>;
  
  const userState = {
    loggedInUser: mockUserRes,
    loading: false,
  };
  
  const notificationState = {
    errors: [],
    notifications: [],
    currentNotificationMessage: '',
    triggerNotification: false,
  };
  
  
  export const preloadedState = {
    recipes: recipesState,
    users: userState,
    notifications: notificationState,
  };