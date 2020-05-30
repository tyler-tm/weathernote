import compose from "https://deno.land/x/denofun/compose.ts";
import concat from "https://deno.land/x/denofun/concat.ts";
import curry from "https://deno.land/x/denofun/curry.ts";
import prop from "https://deno.land/x/denofun/prop.ts";
import reduce from "https://deno.land/x/denofun/reduce.ts";

type ClientValues = {
  appid: string;
  coords: [number, number];
};

type StringMap = {
  [key: string]: string;
};

type WeatherData = {
  current: {
    temp: number;
  };
};

const CLIENT_VALUES: ClientValues = JSON.parse(
  Deno.readTextFileSync("./client-values.json"),
);
const BASE_URI = "https://api.openweathermap.org/data/2.5/onecall";
const PARAMS: StringMap = {
  units: "imperial",
  exclude: "minutely,hourly,daily,",
  appid: CLIENT_VALUES.appid,
  lat: CLIENT_VALUES.coords[0].toString(),
  lon: CLIENT_VALUES.coords[1].toString(),
};

const Impure = {
  getJson: curry(
    async (callback: (_: any) => void, uri: string): Promise<void> => {
      const response: Response = await fetch(uri);
      const responseJson: any = await response.json();
      callback(responseJson);
    },
  ),
  printValue: curry((label: string, value: string): void =>
    console.log(label, value)
  ),
};

// -- Pure ---------------------------------------------------------------------

const curriedProp = curry(prop);

const appendParam = (
  path: string,
  param: [string, string],
  index: number,
): string => `${path}${index ? "&" : "?"}${param[0]}=${param[1]}`;

const toUri: (_: StringMap) => string = compose(
  curry(concat)(BASE_URI),
  curry(reduce)(appendParam, ""),
  Object.entries,
);

const toCurrentTemp: (_: Required<WeatherData>) => string = compose(
  curriedProp("temp"),
  curriedProp("current"),
);

// -- Impure ------------------------------------------------------------------

const printCurrentTemp: (_: Required<WeatherData>) => void = compose(
  Impure.printValue("Current Temp: "),
  toCurrentTemp,
);

const app: (_: StringMap) => void = compose(
  Impure.getJson(printCurrentTemp),
  toUri,
);

app(PARAMS);
