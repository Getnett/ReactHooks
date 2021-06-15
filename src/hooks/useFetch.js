import { useCallback, useReducer } from 'react';

const HTTP_SEND = 'SEND';
const HTTP_RESPONSE = 'RESPONSE';
const HTTP_ERROR = 'FAILED';
const HTTP_CANCEL_ERROR = 'CANCEL';

const intitialState = {
	error: null,
	loading: false,
	data: null,
	customParam: null,
	reqIdentifier: null,
};
const httpStateReducer = (initialState, action) => {
	switch (action.type) {
		case HTTP_SEND:
			return { error: null, loading: true, data: null, customParam: null, reqIdentifier: action.identifier };
		case HTTP_RESPONSE:
			return { ...initialState, loading: false, data: action.data, customParam: action.customArg };
		case HTTP_ERROR:
			return { loading: false, error: action.errorMessage, data: null };
		case HTTP_CANCEL_ERROR:
			return intitialState;
		default:
			return new Error('Error Occured');
	}
};

export const useFetch = () => {
	const [httpState, dispatchHttpRequest] = useReducer(httpStateReducer, intitialState);

	const clearErrorHandler = useCallback(() => dispatchHttpRequest({ type: HTTP_CANCEL_ERROR }), []);

	const sendHttpRequest = useCallback((url, method, body, customArg, identifier) => {
		dispatchHttpRequest({ type: HTTP_SEND, identifier });
		fetch(url, {
			method: method,
			body: body,
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((responseData) => {
				dispatchHttpRequest({ type: HTTP_RESPONSE, data: responseData, customArg });
			})
			.catch((error) => {
				dispatchHttpRequest({ type: HTTP_ERROR, errorMessage: error.message });
			});
	}, []);

	return {
		isLoading: httpState.loading,
		error: httpState.error,
		data: httpState.data,
		customParam: httpState.customParam,
		requestType: httpState.reqIdentifier,
		clearError: clearErrorHandler,
		sendRequest: sendHttpRequest,
	};
};
