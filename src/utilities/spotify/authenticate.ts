import { BotHomemadeMusicStateManager } from "../../StateManager";

export const authenticateAccessToken = () => {
  const currentTime = new Date(Date.now());

  const accessToken = fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
  })
    .then((res) => res.json())
    .then((data) => {
      BotHomemadeMusicStateManager.spotify.accessToken = data.access_token;
      BotHomemadeMusicStateManager.spotify.expireTimestamp = currentTime
        .setSeconds(currentTime.getSeconds() + 3600)
        .toString();

      return data.access_token;
    })
    .catch(() => {
      console.log("Failed");
    });

  return accessToken;
};
