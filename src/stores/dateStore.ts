import { defineStore } from 'pinia'

function getTodayAsString(): string {
  const today = new Date()
  return today.toISOString().split('T')[0] // format YYYY-MM-DD
}

export const useDateStore = defineStore('date', {
  state: () => ({
    startDate: getTodayAsString(),
    endDate: getTodayAsString(),
    currentDate: 0 as number,
    maxDateIndex: 0 as number
  }),
  actions: {
    setStartDate(date: string) {
      this.startDate = date
    },
    setEndDate(date: string) {
      this.endDate = date
    },
    setCurrentDate(date: number){
      this.currentDate = date
    }
  }
})
