import { createAction, props } from '@ngrx/store';

export const addBookmark = createAction(
    '[Repositories Component] add a bookmark',
    props<{path: string}>()
);

export const removeBookmark = createAction(
    '[Repositories Component] removee a bookmark',
    props<{path: string}>()
);