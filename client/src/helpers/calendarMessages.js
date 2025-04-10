export const calendarMessages = () => {
	return {
		// allDay: 'Todo el día',
		previous: '<',
		next: '>',
		today: 'Hoy',
		month: 'Mes',
		week: 'Semana',
		day: 'Día',
		agenda: 'Agenda',
		date: 'Fecha',
		time: 'Hora',
		event: 'Evento',
		noEventsInRange: 'No hay eventos en este rango',
		showMore: () => `Ver más`,
	}
}
//showMore: (total) => `Ver más ${(total)}`,//Recive el totaL de los eventos y los suma en el ver mas
