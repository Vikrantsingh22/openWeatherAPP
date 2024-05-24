import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useWeatherStore from "@/store/weatherStore";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const HomePage = (props: Props) => {
  const WeatherList = useWeatherStore((state) => state.weatherList);
  const setSelectedWeather = useWeatherStore(
    (state) => state.setSelectedWeather
  );
  const navigate = useNavigate();
  const handleCardClick = (weather) => {
    setSelectedWeather(weather);
    navigate("/weather");
  };
  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Results</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 ">
        <div className="grid gap-6 w-full">
          {WeatherList.length > 0 &&
            WeatherList.map((weather) => (
              <Card
                x-chunk="dashboard-04-chunk-1"
                key={weather?.id}
                onClick={() => handleCardClick(weather)}
              >
                <CardHeader>
                  <CardTitle>
                    <div className="flex justify-between">
                      <div>
                        {weather.name}, {weather?.sys?.country}
                      </div>
                      <div className="place-items-end">
                        <img
                          className="aspect-square rounded-md object-cover"
                          height="40"
                          width="40"
                          src={`icons/${weather?.weather[0]?.icon}.png`}
                          alt={weather?.weather[0]?.description}
                        />
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription className="pt-2 ">
                    <div className="pb-2">
                      Description: {weather?.weather[0]?.description}
                    </div>
                    <div className="font-bold mb-3">
                      <span>Weather Details</span>
                    </div>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        Min Temp <span>{weather?.main.temp_min}°C</span>
                      </li>

                      <li className="flex items-center justify-between">
                        Max Temp <span>{weather?.main.temp_max}°C</span>
                      </li>
                      <li className="flex items-center justify-between">
                        Feels like: <span>{weather?.main.feels_like}°C</span>
                      </li>
                      <li className="flex items-center justify-between">
                        Feels like: <span>{weather?.main.feels_like}°C</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <Badge>Click for Info</Badge>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="font-bold font">{weather?.main.temp}°C</div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
