import Pusher from "pusher-js";
import Echo from "laravel-echo";
import axios from "axios";
import { useAuthStore } from "../store/auth";
// import { createLighthouseSubscriptionLink } from "@thekonz/apollo-lighthouse-subscription-link";

const httpClient = axios;

// httpClient.defaults.withCredentials = true;

const { token } = useAuthStore.getState();

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
// Add a request interceptor
httpClient.interceptors.request.use(function (config) {
  const { token } = useAuthStore.getState();
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  console.log(token);
  return config;
});
const PusherClient = new Pusher(process.env.NEXT_PUBLIC_ECHO_KEY as string, {
  wsHost: process.env.NEXT_PUBLIC_ECHO_HOST as string,
  cluster: "mt1",
  wsPort: parseInt(process.env.NEXT_PUBLIC_ECHO_PORT as string),
  forceTLS: false,
  authEndpoint: process.env.NEXT_PUBLIC_ECHO_AUTH,
  authorizer: (channel: { name: any }) => {
    return {
      authorize: (socketId: any, callback: (arg0: any, arg1: any) => void) => {
        httpClient
          .post(process.env.NEXT_PUBLIC_ECHO_AUTH as string, {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response: { data: any }) => {
            callback(false as any, response.data);
          })
          .catch((error: any) => {
            callback(true as any, error);
          });
      },
    };
  },
});

const echo = new Echo({
  broadcaster: "pusher",
  client: PusherClient,
});

export default echo;

// export const echoLink = createLighthouseSubscriptionLink(echo);
