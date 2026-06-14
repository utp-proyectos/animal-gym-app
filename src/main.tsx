import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'
import { router } from '@/router'

import '@/index.css'
import { Toast } from '@heroui/react'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Toast.Provider placement="bottom end" />
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
)
