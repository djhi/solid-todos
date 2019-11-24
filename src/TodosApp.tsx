import React, { FC } from 'react';
import {
	Text,
	FormControl,
	FormHelperText,
	Input,
	Button,
	Flex,
	List,
	ListItem,
	Divider,
	IconButton,
	VisuallyHidden,
	ControlBox,
	Icon,
	Box,
} from '@chakra-ui/core';
import { withTypes, Field } from 'react-final-form';
import { required } from 'redux-form-validators';

import { useTodosList, getTodo } from './useTodoList';
import { Todo, AddTodo, RemoveTodo } from './types';
import { TripleSubject } from 'tripledoc';
import { FormApi } from 'final-form';
import MaxWidthContainer from './MaxWidthContainer';

const TodosApp = () => {
	const [todos, loading, actions] = useTodosList();

	return loading ? null : (
		<MaxWidthContainer as="main" flex={1} direction="column" p={4}>
			{todos.length === 0 ? <TodosOnboarding /> : null}
			<NewTodo onSubmit={actions.add} />
			{todos.length > 0 ? (
				<>
					<Divider my={4} />
					<TodosList todos={todos} onRemove={actions.remove} />
				</>
			) : null}
		</MaxWidthContainer>
	);
};

export default TodosApp;

const TodosList = ({ todos, onRemove }: { todos: TripleSubject[]; onRemove: RemoveTodo }) => {
	return (
		<List spacing={3}>
			{todos.map(todo => (
				<TodoItem key={todo.asRef()} todo={todo} onRemove={onRemove} />
			))}
		</List>
	);
};

const TodoItem = ({ todo, onRemove }: { todo: TripleSubject; onRemove: RemoveTodo }) => {
	const todoData = getTodo(todo);
	const handleRemove = () => {
		onRemove(todo.asRef());
	};

	return (
		// @ts-ignore
		<ListItem
			display="flex"
			alignItems="center"
			// @ts-ignore
			_hover={{
				bg: 'gray.100',
			}}
		>
			<Box as="label" ml={4}>
				{/*
                // @ts-ignore */}
				<VisuallyHidden as="input" type="checkbox" defaultChecked={todoData.completed} />

				<ControlBox
					borderColor="gray.500"
					borderWidth="1px"
					size="24px"
					rounded="sm"
					_checked={{ bg: 'green.500', color: 'white', borderColor: 'green.500' }}
					_focus={{ borderColor: 'green.600', boxShadow: 'outline' }}
					defaultChecked={todoData.completed}
				>
					<Icon name="check" size="16px" />
				</ControlBox>

				{/* You can pass additional text */}
				<Box as="span" verticalAlign="top" ml={4}>
					{todoData.label}
				</Box>
			</Box>
			<IconButton
				aria-label="Remove"
				title="Remove"
				icon="delete"
				variant="ghost"
				variantColor="red"
				onClick={handleRemove}
				ml="auto"
				my={2}
				mr={2}
			/>
		</ListItem>
	);
};

const TodosOnboarding: FC = ({ children }) => (
	<Flex direction="column">
		<Text>Let's create your very first todo!</Text>
		{children}
	</Flex>
);

const { Form } = withTypes<Todo>();

const NewTodo = ({ onSubmit }: { onSubmit: AddTodo }) => {
	const handleAddTodo = async (values: Todo, form: FormApi<Todo>) => {
		onSubmit(values).then(() => form.reset());
	};

	return (
		<Form
			onSubmit={handleAddTodo}
			render={({ handleSubmit }) => (
				<Flex as="form" alignItems="flex-start" onSubmit={handleSubmit}>
					<Field
						name="label"
						validate={required()}
						render={({ input, meta }) => (
							<FormControl flex={1} mr={1} isInvalid={meta.touched && meta.error} isRequired>
								<Input
									type="label"
									id="label"
									aria-label="Label"
									aria-describedby={meta.touched && meta.error ? 'label-helper-text' : undefined}
									placeholder="Enter something to do!"
									{...input}
								/>
								{meta.touched && meta.error ? (
									<FormHelperText id="label-helper-text">{meta.error}</FormHelperText>
								) : null}
							</FormControl>
						)}
					/>
					<Button variantColor="teal" type="submit">
						Add
					</Button>
				</Flex>
			)}
		/>
	);
};
