import { useState, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { RoutineInfo } from '@/features/partner/types'

export function useRoutineCarousel(routines: RoutineInfo[] | undefined) {
	const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null)

	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: 'center',
		skipSnaps: false,
		containScroll: false,
	})

	const currentActiveRoutine =
		routines?.find((r) => r.id === selectedRoutineId) || routines?.[routines.length - 1]

	const activeId = selectedRoutineId || currentActiveRoutine?.id || null

	useEffect(() => {
		if (emblaApi && routines && routines.length > 0 && !selectedRoutineId) {
			const lastIndex = routines.length - 1
			emblaApi.scrollTo(lastIndex, true)
		}
	}, [emblaApi, routines, selectedRoutineId])

	useEffect(() => {
		if (!emblaApi || !routines) return

		const handleSelect = () => {
			const selectedIndex = emblaApi.selectedScrollSnap()
			const activeRoutine = routines[selectedIndex]
			if (activeRoutine) {
				setSelectedRoutineId(activeRoutine.id)
			}
		}

		emblaApi.on('select', handleSelect)
		emblaApi.on('reInit', handleSelect)

		return () => {
			emblaApi.off('select', handleSelect)
			emblaApi.off('reInit', handleSelect)
		}
	}, [emblaApi, routines])

	return {
		selectedRoutineId,
		setSelectedRoutineId,
		currentActiveRoutine,
		activeId,
		emblaRef,
		emblaApi,
	}
}
