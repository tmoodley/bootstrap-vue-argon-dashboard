import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'
export default {
  install(Vue) {
    const connection = new HubConnectionBuilder()
      .withUrl('/chathub')
      .configureLogging(LogLevel.Information)
      .build()
    
    connection.start()
  }
}
