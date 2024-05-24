import { Earth, Wind } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useWeatherStore from "@/store/weatherStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LineChart } from "@/Charts/Line";
const Page = (props: Props) => {
  const selectedWeather = useWeatherStore((state) => state.selectedWeather);
  const lat = selectedWeather?.coord.lat;
  const lon = selectedWeather?.coord.lon;
  const fetchForecast = async (lat, lon) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );
    return response.data;
  };

  const {
    data: forecastData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["forecast", lat, lon],
    queryFn: () =>
      fetchForecast(selectedWeather?.coord.lat, selectedWeather?.coord.lon),
    enabled: !!lat && !!lon,
  });
  function extractDailyForecastAtNine(apiResponse) {
    const nineAMForecast = apiResponse?.list.filter((entry) =>
      entry.dt_txt.includes("09:00:00")
    );

    return {
      ...apiResponse,
      list: nineAMForecast,
    };
  }

  const dailyForecast = extractDailyForecastAtNine(forecastData);

  if (selectedWeather?.length < 1) {
    return <div>City name is invalid</div>;
  }

  function extractArrays(data) {
    const tempMinArray = [];
    const tempMaxArray = [];
    const dtTxtArray = [];

    data?.list?.forEach((item) => {
      tempMinArray.push(item.main.temp_min);
      tempMaxArray.push(item.main.temp_max);
      dtTxtArray.push(item.dt_txt);
    });

    return {
      tempMinArray,
      tempMaxArray,
      dtTxtArray,
    };
  }

  const result = extractArrays(forecastData);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">GeoCoord</CardTitle>
            <Earth />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              [{selectedWeather?.coord.lat},{selectedWeather?.coord.lon}]
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {selectedWeather?.name},{selectedWeather?.sys.country}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">Temperature</CardTitle>
            <div className="font-bold">{selectedWeather?.main?.temp}°C</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold"></div>
            <p className="text-sm font-semibold text-muted-foreground">
              Minimum Temperature: {selectedWeather?.main?.temp_min}°C
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Maximum Temperature: {selectedWeather?.main?.temp_max}°C
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Feels Like: {selectedWeather?.main?.feels_like}°C
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">Wind</CardTitle>
            <Wind />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold"></div>
            <p className="text-sm font-semibold text-muted-foreground">
              Speed: {selectedWeather?.wind?.speed} m/s
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Degree: {selectedWeather?.wind?.deg}
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              Humidity: {selectedWeather?.main?.humidity}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">Weather</CardTitle>
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src={`icons/${selectedWeather?.weather[0].icon}.png`}
                alt="Avatar"
              />
            </Avatar>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold"></div>
            <p className="text-sm font-semibold text-muted-foreground">
              Description : {selectedWeather?.weather[0]?.description}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card
          className="xl:col-span-2 hidden md:block "
          x-chunk="dashboard-01-chunk-4"
        >
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>
                {selectedWeather?.name},{selectedWeather?.sys.country}
              </CardTitle>
              <CardDescription>
                Hourly Forcast for {selectedWeather?.name}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              title1="Min Temp"
              title2="Max Temp"
              labels={result.dtTxtArray}
              data1={result.tempMinArray}
              data2={result.tempMaxArray}
              label="Temperature"
              backgroundColor="rgba(255,255,255, 0.9)"
              borderColor1="rgba(255, 99, 132, 1)"
              borderColor2="rgba(54, 162, 235, 1)"
            />
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {dailyForecast?.list?.map((forecast) => (
              <div className="flex items-center gap-4" key={forecast?.dt}>
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage
                    src={`icons/${forecast?.weather[0].icon}.png`}
                    alt="Avatar"
                  />
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {forecast?.dt_txt}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Description: {forecast?.weather[0]?.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Wind: {forecast?.wind?.speed} m/s
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Feels like: {forecast?.main?.feels_like}°C
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {forecast?.main?.temp}°C
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
