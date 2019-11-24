import React from 'react';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { useLoggedIn } from '@solid/react';

import theme from './theme';
import AppBar from './AppBar';
import TodosApp from './TodosApp';

const App = () => {
	const loggedIn = useLoggedIn();
	return (
		<ThemeProvider theme={theme}>
			<CSSReset />
			<AppBar />
			{loggedIn ? <TodosApp /> : null}
		</ThemeProvider>
	);
};

export default App;
