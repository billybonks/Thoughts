exports.facebook =
  {
    authorization_url: "https://www.facebook.com/dialog/oauth",
    client_id: "171284626406184",
    client_secret: "d6265fa2fd27376c2d939ecc9fe64c04",
    callback_url: "https://localhost:4730/auth/facebook/callback",
    token_url: "https://graph.facebook.com/oauth/access_token"
  }

exports.loggly =
  {
    username: "billybonks",
    password: "mi1ndful7",
    token: "b61d863c-0aae-400e-8cac-b444bf29d027",
    subDomain: "billybonks",
    globalTag:['thoughts-development-sebastien']
  }
exports.github =
  {
    authorization_url: "https://github.com/login/oauth/authorize",
    token_url: "https://github.com/login/oauth/access_token",
    client_id: "d31012219297fcee34b8",
    client_secret: "d61711641118f725f7f8153adb3adcd5b7e66a40",
    callback_url: "https://localhost:4730/auth/github/callback"

  }

exports.google =
  {
    authorization_url: "https://accounts.google.com/o/oauth2/auth",
    client_id: "422567831354-ihusbrf5peu0gi1v5313a4fajaan0j0b.apps.googleusercontent.com",
    client_secret: "Qci4rvj4jx_NWdtDOFaL1Gr9",
    callback_url: "https://billybonks.zapto.org:4730/auth/google/callback",
    token_url: "https://accounts.google.com/o/oauth2/token"
  }

exports.twitter =
  {
    authorization_url: "https://api.twitter.com/oauth/authorize",
    client_id: "OwiSBp7Xxsd5unpvDDtNBujjj",
    client_secret: "4fD3hM0wX0Hn8s13gbUygIKdyuCLz5ogTdIN24ct1RubYqpmhA",
    callback_url: "https://localhost:4730/auth/twitter/callback",
    token_url: "https://api.twitter.com/oauth/access_token"
  }