import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </QueryClientProvider>
      <ToastContainer />
    </Provider >
  </BrowserRouter>
)
