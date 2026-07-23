// https://umijs.org/config/

import { join } from 'node:path';
import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

import routes from './routes';

const { UMI_ENV = 'dev' } = process.env;

// Compute commit hash: env vars take precedence, fall back to git at build time
const commitHash =
  process.env.COMMIT_HASH ||
  process.env.CF_PAGES_COMMIT_SHA ||
  (() => {
    try {
      return require('node:child_process')
        .execSync('git rev-parse HEAD', {
          stdio: ['ignore', 'pipe', 'ignore'],
          encoding: 'utf-8',
        })
        .trim();
    } catch {
      return '';
    }
  })();

/**
 * @name Public path
 * @description The deployment path; configure this if deploying under a non-root directory
 * @doc https://umijs.org/docs/api/config#publicpath
 */
const PUBLIC_PATH: string = '/';

export default defineConfig({
  alias: {
    '@root': join(__dirname, '..'),
  },
  /**
   * @name Enable hash mode
   * @description Adds a hash suffix to build output. Commonly used for incremental releases and avoiding browser cache issues.
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  publicPath: PUBLIC_PATH,

  /**
   * @name Compatibility settings
   * @description Setting ie11 doesn't guarantee perfect compatibility; you need to check all of your dependencies
   * @doc https://umijs.org/docs/api/config#targets
   */
  // targets: {
  //   ie: 11,
  // },
  /**
   * @name Route configuration; files not referenced by a route are not compiled
   * @description Only path, component, routes, redirect, wrappers, and title are supported
   * @doc https://umijs.org/docs/guides/routes
   */
  // umi routes: https://umijs.org/docs/routing
  routes,
  /**
   * @name Theme configuration
   * @description Despite the name "theme", this is really just Less variable overrides
   * @doc antd theme configuration https://ant.design/docs/react/customize-theme
   * @doc umi's theme config https://umijs.org/docs/api/config#theme
   */
  // theme: { '@primary-color': '#1DA57A' }
  /**
   * @name moment i18n configuration
   * @description If you don't need internationalization, enabling this reduces the JS bundle size
   * @doc https://umijs.org/docs/api/config#ignoremomentlocale
   */
  ignoreMomentLocale: true,
  /**
   * @name Proxy configuration
   * @description Lets your local server proxy requests to your backend server, so you can access its data
   * @see Note: the proxy only works during local development; it has no effect after build.
   * @doc Proxy introduction https://umijs.org/docs/guides/proxy
   * @doc Proxy configuration https://umijs.org/docs/api/config#proxy
   */
  proxy: proxy[UMI_ENV as keyof typeof proxy],
  /**
   * @name Fast Refresh configuration
   * @description A great hot-reload feature that preserves state across updates
   */
  fastRefresh: true,
  /**
   * @name Route prefetching
   * @description Prefetches route resources to speed up page navigation
   * @doc https://umijs.org/docs/api/config#routePrefetch
   */
  routePrefetch: {},
  /**
   * @name manifest configuration
   * @description Generates an asset manifest, used together with routePrefetch
   */
  manifest: {},
  //============== Everything below is Max plugin configuration ===============
  /**
   * @name Data flow plugin
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * A global initial data flow that can be used to share data between plugins
   * @description Can be used to store global data, such as user info or global state; the global initial state is created at the very start of the Umi project.
   * @doc https://umijs.org/docs/max/data-flow#global-initial-state
   */
  initialState: {},
  /**
   * @name Layout plugin
   * @doc https://umijs.org/docs/max/layout-menu
   */
  title: 'Ant Design Pro',
  layout: {
    locale: true,
    ...defaultSettings,
  },
  /**
   * @name moment2dayjs plugin
   * @description Replaces moment with dayjs throughout the project
   * @doc https://umijs.org/docs/max/moment2dayjs
   */
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration', 'relativeTime'],
  },
  /**
   * @name Internationalization plugin
   * @doc https://umijs.org/docs/max/i18n
   */
  locale: {
    // default en-US
    default: 'en-US',
    antd: true,
    // English-only project: don't let the browser's language override the default
    baseNavigator: false,
  },
  /**
   * @name antd plugin
   * @description Includes the babel import plugin out of the box
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {
    appConfig: {},
    configProvider: {
      variant: 'filled',
      theme: {
        token: {
          fontFamily: 'AlibabaSans, sans-serif',
        },
      },
    },
  },
  /**
   * @name Network request configuration
   * @description Built on axios and ahooks' useRequest, providing a unified network request and error handling solution.
   * @doc https://umijs.org/docs/max/request
   */
  request: {},
  /**
   * @name React Query plugin
   * @description Uses react-query to manage server state
   * @doc https://umijs.org/docs/max/react-query
   */
  reactQuery: {},
  /**
   * @name Access plugin
   * @description An access-control plugin based on initialState; initialState must be enabled first
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name Google Analytics
   * @description Uses GA4 (gtag.js) for site analytics
   * @doc https://umijs.org/docs/max/analytics
   */
  analytics: {
    ga_v2: 'G-59NF1VHHPF',
  },
  /**
   * @name Extra scripts in <head>
   * @description Configure extra scripts to include in <head>
   */
  headScripts: [
    // Prevents a blank white screen on first load
    { src: join(PUBLIC_PATH, 'scripts/loading.js'), async: true },
  ],

  //================ Pro plugin configuration =================
  plugins: ['@umijs/max-plugin-openapi', '@umijs/request-record'],

  /**
   * @name openAPI plugin configuration
   * @description Generates services and mocks based on the OpenAPI spec, saving a lot of boilerplate code
   * @doc https://pro.ant.design/docs/openapi/
   */
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      // Or use the online version
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
  ],

  tailwindcss: {},

  mock: {
    include: ['src/pages/**/_mock.ts'],
    exclude: ['mock/requestRecord.mock.js'],
  },
  utoopack: {
    module: {
      rules: {
        '*.md': {
          loaders: [{ loader: join(__dirname, 'md-raw-loader.cjs') }],
          as: '*.js',
        },
      },
    },
  },
  requestRecord: {},
  exportStatic: {},
  define: {
    'process.env.CI': process.env.CI,
    'process.env.COMMIT_HASH': commitHash,
    __APP_VERSION__: require('./../package.json').version,
    __UMI_VERSION__: require('@umijs/max/package.json').version,
    __UTOO_VERSION__: require('@utoo/pack/package.json').version,
  },
});
