import React, { useEffect, useRef, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo((props) => {
	const { onSearchIngredient } = props;
	const [enteredFilter, setEnteredaFilter] = useState('');
	const inputRef = useRef();
	const { isLoading, error, data, sendRequest, clearError } = useFetch();
	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredFilter === inputRef.current.value) {
				const query = enteredFilter.length >= 1 ? `?orderBy="title"&equalTo="${enteredFilter}" ` : '';
				sendRequest(
					'https://test-csv-622dd-default-rtdb.europe-west1.firebasedatabase.app/orders.json' + query,
					'GET'
				);
			}
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [enteredFilter, sendRequest]);

	useEffect(() => {
		if (!isLoading && !error) {
			const ingredients = [];
			for (let key in data) {
				ingredients.push({
					id: key,
					title: data[key].title,
					amount: data[key].amount,
				});
			}
			onSearchIngredient(ingredients);
		}
	}, [data, onSearchIngredient, isLoading, error]);
	return (
		<section className="search">
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
			<Card>
				<div className="search-input">
					{isLoading && <span>Loading...</span>}
					<label>Filter by Title</label>
					<input
						ref={inputRef}
						type="text"
						value={enteredFilter}
						onChange={(e) => setEnteredaFilter(e.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
