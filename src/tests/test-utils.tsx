import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { AppStore, RootState, setupConfiguredStore } from '../store/setup';
// As a basic setup, import your same slice reducers

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
}
  
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupConfiguredStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
  mockDispatch?: any
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  if (mockDispatch) {
    store.dispatch = mockDispatch;
  } else {
    store.dispatch = jest.fn();
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}