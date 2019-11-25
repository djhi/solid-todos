import React from 'react';
import {
	Heading,
	Button,
	Flex,
	BoxProps,
	ButtonProps,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Text,
} from '@chakra-ui/core';
import { useLoggedIn, useLDflex } from '@solid/react';
import auth from 'solid-auth-client';
import MaxWidthContainer from './MaxWidthContainer';

const AppBar = () => {
	const isLoggedIn = useLoggedIn();

	return (
		<Flex bg="teal.600" direction="column">
			<MaxWidthContainer as="header" flex={1} alignItems="center" p={4}>
				<Heading color="teal.50" as="h1" fontSize="md">
					Solid Todos
				</Heading>
				{isLoggedIn ? <UserMenu /> : <LogInButton />}
			</MaxWidthContainer>
		</Flex>
	);
};

export default AppBar;

const UserMenu = (props: BoxProps) => {
	const [name, isLoading] = useLDflex('user.name');
	const handleLogOut = () => auth.logout();

	return (
		<Flex ml="auto" alignItems="center">
			{isLoading ? null : <Text color="teal.50" mr={1}>{`${name}`}</Text>}
			<Menu>
				{/*
                // @ts-ignore */}
				<MenuButton
					as={IconButton}
					// @ts-ignore
					variant="link"
					// @ts-ignore
					variantColor="teal"
					color="teal.50"
					icon="chevron-down"
					aria-label="Open menu"
				></MenuButton>
				<MenuList>
					<MenuItem onClick={handleLogOut}>Logout</MenuItem>
				</MenuList>
			</Menu>
		</Flex>
	);
};

const LogInButton = (props: Omit<ButtonProps, 'children'>) => {
	const handleLogIn = () => auth.popupLogin({ popupUri: '/login-popup.html' });

	return (
		<Button onClick={handleLogIn} ml="auto" variantColor="teal">
			Login
		</Button>
	);
};
