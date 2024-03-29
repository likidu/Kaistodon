// The service worker to handle OAuth token
const channel = new BroadcastChannel('sw-messages');

self.onsystemmessage = (evt) => {
  console.log('onsystemmessage');

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
        const url = `/index.html?code=${code}`;
        clients.openWindow(url);

        channel.postMessage(code);
      }

      // Handle picking image
      if (activityName === 'pick') {
        const image = getImageToReturn();
        if (!image) {
          handler.postError('No Image!');
          return;
        }
        // handler.postResult({ type: 'image', url: image });
        handler.postResult(image);
      }
    }
  };
  evt.waitUntil(serviceHandler());
};
