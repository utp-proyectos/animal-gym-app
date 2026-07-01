createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Toast.Provider placement="bottom end" />
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
)
