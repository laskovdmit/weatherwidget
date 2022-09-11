interface ICityParams {
  lat: number;
  lon: number;
  order: number;
}
  
interface ICityWeather {
  id: number;
  timezone: number;
  visibility: number;
  weather: any[];
  coord: ICityParams,
  order: number;
}

interface INotification {
  type?: MessageType;
  message?: string;
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
  citiesWeather: ICityWeather[];
}

enum MessageType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export {
  ICityParams,
  ICityWeather,
  IRootState,
  INotification,
  INotificationState,
  ICitiesWeatherState,
  MessageType
}