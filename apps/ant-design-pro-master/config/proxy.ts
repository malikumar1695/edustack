/**
 * @name Proxy configuration
 * @see The proxy has no effect in the production environment, so there is no production config here
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // Uncomment and adjust as needed if you want to customize the local dev server
  // dev: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     // The address to proxy to
  //     target: 'https://preview.pro.ant.design',
  //     // Enabling this allows proxying from http to https
  //     // Features that rely on origin (e.g. cookies) may need this
  //     changeOrigin: true,
  //   },
  // },
  /**
   * @name Detailed proxy configuration
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://pro-api.ant-design-demo.workers.dev/api/**
    '/api/': {
      target: 'https://pro-api.ant-design-demo.workers.dev',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
    },
  },
};
