interface ICity {
  local_names?: any;
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface ICoord {
  lat: number;
  lon: number;
}
  
interface ICityWeather {
  id: number;
  coord: ICoord,
  order: number;
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
  citiesWeather: ICityWeather[];
}

enum MessageType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export {
  ICity,
  ICityWeather,
  IRootState,
  INotification,
  INotificationState,
  ICitiesWeatherState,
  MessageType
}