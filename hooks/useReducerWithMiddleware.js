import React, { useReducer, useRef } from 'react';



const useReducerWithMiddleware = (
    reducer,
    initialState,
    beforeMiddlewareFns,
    afterMiddlewareFns
) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const aRef = useRef();

    const dispatchWithMiddleware = (action) => {
        beforeMiddlewareFns.forEach((beforeMiddlewareFn) =>
            beforeMiddlewareFn(action, state)
        );

        aRef.current = action;

        dispatch(action);
    };

    React.useEffect(() => {
        if (!aRef.current) return;

        afterMiddlewareFns.forEach((afterMiddlewareFn) =>
            afterMiddlewareFn(aRef.current, state)
        );

        aRef.current = null;
    }, [afterMiddlewareFns, state]);

    return [state, dispatchWithMiddleware];
};

export default useReducerWithMiddleware;