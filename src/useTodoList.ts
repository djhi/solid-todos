import { useEffect, useState, useCallback } from 'react';
import { createDocument, fetchDocument, TripleDocument, TripleSubject, Reference } from 'tripledoc';
import { rdf, solid, schema, space } from 'rdf-namespaces';
import newUuid from 'uuid/v4';

import usePublicTypeIndex from './usePublicTypeIndex';
import useProfile from './useProfile';
import { Todo, AddTodo, RemoveTodo } from './types';

type TodosActions = {
	add: AddTodo;
	remove: RemoveTodo;
};

export function useTodosList(): [TripleSubject[], boolean, TodosActions] {
	const profile = useProfile();
	const publicTypeIndex = usePublicTypeIndex();
	const [loading, setLoading] = useState(true);
	const [todosList, setTodosList] = useState<TripleDocument>();

	useEffect(() => {
		if (!profile) {
			return;
		}

		if (!publicTypeIndex) {
			return;
		}

		(async () => {
			const todosListIndex = publicTypeIndex.findSubject(solid.forClass, schema.Event);
			if (!todosListIndex) {
				// If no todos document is listed in the public type index, create one:
				const todosList = await initialiseTodosList(profile, publicTypeIndex);
				if (todosList === null) {
					return;
				}
				setTodosList(todosList);
				return;
			}

			// If the public type index does list a todos document, fetch it:
			const todosListUrl = todosListIndex.getRef(solid.instance);
			if (typeof todosListUrl !== 'string') {
				return;
			}
			const document = await fetchDocument(todosListUrl);
			setTodosList(document);
			setLoading(false);
		})();
	}, [profile, publicTypeIndex]);

	const createNewTodo: AddTodo = useCallback(
		async (values: Todo) => {
			if (!todosList) {
				return;
			}
			addTodo(values, todosList);
			setTodosList(await todosList.save());
		},
		[todosList],
	);

	const removeTodo: RemoveTodo = useCallback(
		async (todoIRI: string) => {
			if (!todosList) {
				return;
			}

			todosList.removeSubject(todoIRI);
			setTodosList(await todosList.save());
		},
		[todosList],
	);

	return [todosList ? getTodos(todosList) : [], loading, { add: createNewTodo, remove: removeTodo }];
}

export const getTodos = (todosList: TripleDocument): TripleSubject[] => {
	return todosList.getSubjectsOfType(schema.Event);
};

export const getTodo = (todoSubject: TripleSubject): Todo => {
	const label = (todoSubject.getLiteral(schema.text) || '').toString();
	const completed = (todoSubject.getLiteral(schema.Boolean) || 'false').toString();

	return {
		label,
		completed: JSON.parse(completed),
	};
};

export async function initialiseTodosList(profile: TripleSubject, publicTypeIndex: TripleDocument) {
	const storage = profile.getRef(space.storage);
	if (typeof storage !== 'string') {
		return null;
	}

	// Note: There's an assumption here that `/public/` exists and is writable for this app.
	//       In the future, "Shapes" should hopefully allow us to get more guarantees about this:
	//       https://ruben.verborgh.org/blog/2019/06/17/shaping-linked-data-apps/#need-for-shapes
	const notesListRef = storage + 'public/todos.ttl';
	const notesList = createDocument(notesListRef);
	await notesList.save();
	await addToTypeIndex(publicTypeIndex, notesList, schema.Event);
	return notesList;
}

export async function addToTypeIndex(typeIndex: TripleDocument, document: TripleDocument, forClass: Reference) {
	const typeRegistration = typeIndex.addSubject();
	typeRegistration.addRef(rdf.type, solid.TypeRegistration);
	typeRegistration.addRef(solid.instance, document.asRef());
	typeRegistration.addRef(solid.forClass, forClass);
	return typeIndex.save([typeRegistration]);
}

export const addTodo = async (values: Todo, todosList: TripleDocument): Promise<TripleDocument> => {
	const newNote = todosList.addSubject();
	newNote.addRef(rdf.type, schema.Event);
	newNote.addLiteral(schema.identifier, newUuid());
	newNote.addLiteral(schema.text, values.label);
	newNote.addLiteral(schema.Boolean, JSON.stringify(!!values.completed));
	newNote.addLiteral(schema.dateCreated, new Date(Date.now()));

	return await todosList.save([newNote]);
};
