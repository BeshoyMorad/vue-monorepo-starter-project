/** Flattens intersection types so editors show the resolved shape on hover. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
