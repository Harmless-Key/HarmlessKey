module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/css/variables.scss";`
      }
    }
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
      importScripts: []
    },
    manifestOptions: {
      name: "Harmless Key",
      short_name: "Harmless Key",
      start_url: ".",
      description: "Harmless Key is the initiative tracker for D&D 5e. We keep track of everything in encounters so even during combat you can give your players the attention they deserve.",
      orientation: "portrait",
      theme_color: "#191a1c",
      background_color: "#191a1c",
      display: "standalone",
      categories: [
        "games",
        "entertainment"
      ],
      icons: [
        {
          src: "/img/icons/transparent-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "/img/icons/transparent-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/maskable-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable"
        },
        {
          src: "/img/icons/ms/app-icon-44x44.png",
          sizes: "44x44",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/ms/small-tile-71x71.png",
          sizes: "71x71",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/ms/wide-tile-350x150.png",
          sizes: "350x150",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/ms/large-tile-310x310.png",
          sizes: "310x310",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/ms/store-logo-50x50.png",
          sizes: "50x50",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/img/icons/ms/splash-screen-620x300.png",
          sizes: "620x300",
          type: "image/png",
          purpose: "any"
        }
      ],
      shortcuts: [
        {
          name: "Campaigns",
          description: "The campaigns you are running.",
          url: "/content/campaigns",
          icons: [
            {
              src: "/img/icons/shortcuts/campaigns-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            }
          ]
        },
        {
          name: "Characters",
          description: "Your player characters.",
          url: "/content/characters",
          icons: [
            {
              src: "/img/icons/shortcuts/characters-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            }
          ]
        }
      ]
    }
  }
}