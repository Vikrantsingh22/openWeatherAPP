import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { CloudSunRain, Menu, Package2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useWeatherStore from "@/store/weatherStore";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";

export function Layout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const WeatherList = useWeatherStore((state) => state.weatherList);
  const setWeatherList = useWeatherStore((state) => state.setWeatherList);
  const setSelectedWeather = useWeatherStore(
    (state) => state.setSelectedWeather
  );
  const selectedWeather = useWeatherStore((state) => state.selectedWeather);
  const [userLat, setUserLat] = useState(0);
  const [userLon, setUserLon] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLon(longitude);
      });
    }
  }, [searchTerm]);

  const fetchWeatherData = async (searchTerm) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${searchTerm}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );

    return response.data.list;
  };

  const userLatLongResponse = async (userLat, userLon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );
    await setSelectedWeather(response.data);
    navigate("/weather");

    return response.data;
  };

  const userweather = async () => {
    try {
      //   if (window.location.pathname === "/weather") window.location.reload();
      //   window.location.reload();
      refetchByuser();

      queryClient.invalidateQueries(["userWeather"]);
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  };

  const {
    data: userWeatherData,
    error: userError,
    isLoading: userIsLoading,
    refetch: refetchByuser,
    isSuccess: userSuccess,
  } = useQuery({
    queryKey: ["userWeather"],
    queryFn: () => userLatLongResponse(userLat, userLon),
    enabled: false,
  });

  useEffect(() => {
    if (userSuccess) {
      setSelectedWeather(userWeatherData);
    }
  }, [userSuccess, userWeatherData, navigate, setSelectedWeather]);

  const submitFunction = (event) => {
    event.preventDefault();
    refetch();
  };

  const onSuccess = (data) => {
    if (data.length < 1) {
      alert("No data found for this City Name Please try again.");
    }
    setWeatherList(data);

    navigate("/");
  };

  const {
    data: weatherData,
    error,
    isLoading,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["weather", searchTerm],
    queryFn: () => fetchWeatherData(searchTerm),
    enabled: false,
  });

  useEffect(() => {
    if (isSuccess) {
      onSuccess(weatherData);
    }
  }, [isSuccess, weatherData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to={""}
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <CloudSunRain className="h-6 w-6" />
            <span className="sr-only">Weather App</span>
          </Link>
          <Link
            to={"/"}
            className="text-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to={"/"}
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <CloudSunRain className="h-6 w-6" />
                <span className="sr-only">Weather App</span>
              </Link>
              <Link to={"/"} className="hover:text-foreground">
                Home
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form
            className="ml-auto flex-1 sm:flex-initial"
            onSubmit={submitFunction}
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Cities,States,Countries..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Button onClick={userweather}>AutoWeather</Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
