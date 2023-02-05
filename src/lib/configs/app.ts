/**
 * Mastodon application settings
 */
import type { Instance } from '@/lib/models';

export const INSTANCES: Instance[] = [
  {
    id: 'cmx.im',
    url: 'm.cmx.im',
    client_id: 'LkSupYPZ0Rm17yWEN4w_VzRIochPYfocFVRsD-o4Rhw',
    client_secret: 'rI8I_5Ly8OoIJB4YTHngRCnE8hql0zY8Z60xXwWq5zk',
  },
  {
    id: 'hachyderm.io',
    url: 'hachyderm.io',
    client_id: 'XSR5kDhWDSXEaSEMsBCbi5nLasHrcCJP5rZXDJ6NV98',
    client_secret: '2Z17LQjT23Q_wBJ_gILaFCU3yoNXMzOuAb68OFFqqvo',
  },
  {
    id: 'fosstodon.org',
    url: 'fosstodon.org',
    client_id: 'XSR5kDhWDSXEaSEMsBCbi5nLasHrcCJP5rZXDJ6NV98',
    client_secret: '2Z17LQjT23Q_wBJ_gILaFCU3yoNXMzOuAb68OFFqqvo',
  },
  {
    id: 'mstdn.social',
    url: 'mstdn.social',
    client_id: 'XSR5kDhWDSXEaSEMsBCbi5nLasHrcCJP5rZXDJ6NV98',
    client_secret: '2Z17LQjT23Q_wBJ_gILaFCU3yoNXMzOuAb68OFFqqvo',
  },
  {
    id: 'mas.to',
    url: 'mas.to',
    client_id: 'XSR5kDhWDSXEaSEMsBCbi5nLasHrcCJP5rZXDJ6NV98',
    client_secret: '2Z17LQjT23Q_wBJ_gILaFCU3yoNXMzOuAb68OFFqqvo',
  },
];

export const DEFAULT_INSTANCE = INSTANCES[0];
export const REDIRECT_URL_LOCAL = 'urn:ietf:wg:oauth:2.0:oob';
export const REDIRECT_URL = 'https://likidu.github.io/webactivity-callback/kaistodon.html';
