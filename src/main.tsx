import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './components/ui/sonner.tsx'
import './index.css'
import App from './App.tsx'

//Cria o cliente do React Query com as configurações padrão
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //Dados ficam "frescos" por 1m antes de revalidar
      staleTime: 1000 * 60,
      //Em caso de erro tenta 1 vez
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provedor do React Query para disponibilizar o cliente em toda a aplicação */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Toaster para exibir notificações */}
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
