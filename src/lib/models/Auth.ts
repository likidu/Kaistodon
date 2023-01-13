export type Token = {
  instance: string;
  token: string;
};

export type TokenRequest = {
  client_id: string;
  scope: string;
  redirect_uri: string;
  code: string;
  client_secret: string;
  grant_type: 'authorization_code';
};

export type TokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  created_at: number;
};
