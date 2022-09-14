interface ICity {
  local_names?: any;
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface ICityProps {
  order: number;
  coord: ICoord;
}

interface ICoord {
  lat: number;
  lon: number;
}

interface IWeather {
  icon: string;
  description: string;
}

interface ITemperature {
  temp: number;
  feels_like: number;
}

interface WeatherDetails extends ICityProps {
  id: number;
  weather: IWeather[];
  main: ITemperature;
  visibility: number;
  wind: {
    speed: number;
  },
}

interface INotification {
  type?: MessageType;
  message?: string;
  timeout?: number;
}

interface IRootState {
  API_KEY: string;
  loading: boolean;
}

interface INotificationState {
  notification: boolean;
  notificationProps: INotification,
  timerID: null | number
}

interface ICitiesWeatherState {
  citiesWeather: WeatherDetails[];
}

enum MessageType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export {
  ICity,
  ICityProps,
  WeatherDetails,
  INotification,
  IRootState,
  INotificationState,
  ICitiesWeatherState,
  MessageType
}