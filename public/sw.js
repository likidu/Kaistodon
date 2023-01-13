// The service worker to handle OAuth token
const channel = new BroadcastChannel('sw-messages');

self.onsystemmessage = (evt) => {
  console.log('onsystemmessage');
  channel.postMessage('Hello');

  const serviceHandler = () => {
    if (evt.name === 'activity') {
      console.log('About to handle activity...');
      const handler = evt.data.webActivityRequestHandler();
      const { name: activityName, data: activityData } = handler.source;
      console.log('Activity name: ', activityName);
      console.log('Activity data: ', activityData);

      // Handle OAuth callback
      if (activityName === 'KaistodonCallback') {
        const { code } = activityData;
        channel.postMessage({ accessToken: code });

        const url = `/index.html?code=${code}`;
        clients.openWindow(url);
      }

      // Handle picking image
      // const image = getImageToReturn();
      // if (!image) {
      //   handler.postError('No Image!');
      //   return;
      // }
      // handler.postResult({ type: 'image', url: image });
    }
  };
  evt.waitUntil(serviceHandler());
};
