declare module 'solid-auth-client';

export interface Todo {
	label: string;
	completed: boolean;
}

export type AddTodo = (todo: Todo) => Promise<void>;
export type RemoveTodo = (todoIRI: string) => Promise<void>;
