import {CinchyConfig} from '@cinchy-co/angular-sdk';

// ng serve --port 3000

/*const cinchyConfig: CinchyConfig = {
  authority: 'https://cinchy.net/cinchysso',
  cinchyRootUrl: 'https://cinchy.net/Cinchy',
  clientId: 'deals-sheet',
  redirectUri: 'https://localhost:3000/deals-overview'
};*/

const cinchyConfig: CinchyConfig = {
  // The url of your Cinchy IdentityServer
  authority: 'http://qa.cinchy.co/cinchy-4.7_buildno-1816-ci/cinchysso',
  // The root url of your Cinchy instance
  cinchyRootUrl: 'http://qa.cinchy.co/cinchy-4.7_BuildNo-1816-CI/Cinchy',  // The redirect url after logging in
  // The client id for your applet
  clientId: 'deals-sheet',
  redirectUri: 'http://localhost:3000/'
};

export const environment = {
  production: false,
  cinchyConfig
};
