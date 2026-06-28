/**
 * Nuxt UI のカラーエイリアス。
 * Relay DS のトークン (.workspace/tokens.js) に合わせ、
 * primary をインディゴ(iris)、neutral をニュートラルグレー(ink)に割り当てる。
 * パレット実体は assets/css/main.css の @theme で定義。
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'iris',
      neutral: 'ink',
      success: 'green',
      warning: 'amber',
      error: 'red',
    },
  },
})
