/**
 * Mastodon application settings
 */
// cmx.im
export const CLIENT_ID = 'LkSupYPZ0Rm17yWEN4w_VzRIochPYfocFVRsD-o4Rhw';
export const CLIENT_SECRET = 'rI8I_5Ly8OoIJB4YTHngRCnE8hql0zY8Z60xXwWq5zk';
// hachyderm.io
// export const CLIENT_ID = 'XSR5kDhWDSXEaSEMsBCbi5nLasHrcCJP5rZXDJ6NV98';
// export const CLIENT_SECRET = '2Z17LQjT23Q_wBJ_gILaFCU3yoNXMzOuAb68OFFqqvo';

export const REDIRECT_URL_LOCAL = 'urn:ietf:wg:oauth:2.0:oob';
export const REDIRECT_URL = 'https://likidu.github.io/webactivity-callback/kaistodon.html';

export enum Instance {
  CMX = 'm.cmx.im',
  HACHYDERM = 'hachyderm.io',
}
