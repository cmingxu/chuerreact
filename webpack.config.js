// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    preload: "./src/preload.js",
    main: "./index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist")
  },
  target: "electron-main",
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./index.html", to: "" },
        { from: "./dashboard.html", to: "" }
      ]
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-react"] }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset"
      },
      {
        test: /\.css$|\.less$/i,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
        // use: ["style-loader", "css-loader", "postcss-loader"]
        use: [
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              lessOptions: {
                // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                modifyVars: {
                  "primary-color": "#1DA57A",
                  "link-color": "#1DA57A",
                  "border-radius-base": "0px"
                },
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
