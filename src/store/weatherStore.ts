import create from "zustand";

const useWeatherStore = create((set) => ({
  selectedWeather: null,
  setSelectedWeather: (weather) => set({ selectedWeather: weather }),
  userCoords: null,
  setUserCoords: (coords) => set({ userCoords: coords }),
  weatherList: [],
  setWeatherList: (list) => set({ weatherList: list }),
  units: "metric", // Default units set to "metric"
  setUnits: (newUnits) => set({ units: newUnits }),
}));

export default useWeatherStore;
