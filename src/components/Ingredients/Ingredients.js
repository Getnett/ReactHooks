import React, { useCallback, useEffect, useMemo, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngridentList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import { useFetch } from '../../hooks/useFetch';

const SET_INGREDIENT = 'SET';
const ADD_INGREDIENT = 'ADD';
const REMOVE_INGREDIENT = 'REMOVE';

const ADDING_INGRIDENT = 'ADDING_INGRIDENT';
const REMOVING_INGRIDENT = 'REMOVING_INGRIDENT';

const ingredientsReducer = (initialIngredients, action) => {
	switch (action.type) {
		case SET_INGREDIENT:
			return action.ingredients;
		case ADD_INGREDIENT:
			return [...initialIngredients, action.ingredient];
		case REMOVE_INGREDIENT:
			return initialIngredients.filter((ingredient) => ingredient.id !== action.ingredientId);
		default:
			throw new Error('Error occured!');
	}
};

function Ingredients() {
	const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
	const { isLoading, error, data, customParam, requestType, sendRequest, clearError } = useFetch();

	useEffect(() => {
		if (!isLoading && !error && requestType === REMOVING_INGRIDENT) {
			dispatch({ type: REMOVE_INGREDIENT, ingredientId: customParam });
		} else if (!isLoading && !error && requestType === ADDING_INGRIDENT) {
			dispatch({
				type: ADD_INGREDIENT,
				ingredient: { id: data.name, ...customParam },
			});
		}
	}, [data, customParam, isLoading, error, requestType]);

	const addIngredientHandler = useCallback(
		(ingrident) => {
			sendRequest(
				'https://test-csv-622dd-default-rtdb.europe-west1.firebasedatabase.app/orders.json',
				'POST',
				JSON.stringify(ingrident),
				ingrident,
				ADDING_INGRIDENT
			);
		},
		[sendRequest]
	);

	const removeIngredientHandler = useCallback(
		(ingredientId) => {
			sendRequest(
				`https://test-csv-622dd-default-rtdb.europe-west1.firebasedatabase.app/orders/${ingredientId}.jsn`,
				'DELETE',
				null,
				ingredientId,
				REMOVING_INGRIDENT
			);
		},
		[sendRequest]
	);

	const searchIngredient = useCallback((ingredients) => {
		dispatch({ type: SET_INGREDIENT, ingredients });
	}, []);

	const ingridentList = useMemo(() => {
		return <IngridentList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />;
	}, [userIngredients, removeIngredientHandler]);
	return (
		<div className="App">
			{error ? <ErrorModal onClose={() => clearError()}>{error}</ErrorModal> : null}
			<IngredientForm loading={isLoading} addOnIngredient={addIngredientHandler} />
			{ingridentList}
			<section>
				<Search onSearchIngredient={searchIngredient} />
			</section>
		</div>
	);
}

export default Ingredients;
